# Deployment

How jamesjarvis.io gets from a note on a phone to Cloudflare Pages, and how to set up the machines
that do it. For the repository layout and how to write and run the site locally, see
[README.md](README.md).

## The pipeline

```
 iPhone  ──iCloud Drive──┐
                         │
 MacBook: iCloud vault ──┴──rsync──▶ ~/development/jamesjarvis.io/content
                                                    │
                                                    ├──restic──▶ Backblaze B2
                                                    │
                                              Syncthing (send-only)
                                                    ▼
 Pi:  /srv/site/repo/content  (receive-only)  +  /srv/site/repo  (this repo)
                                                    │
                                      systemd timer ─▶ hugo ─▶ wrangler
                                                    │
                                                    └─▶ Cloudflare Pages
```

### Syncthing must not watch the iCloud folder

iCloud evicts files it thinks you don't need to zero-byte `.name.ext.icloud` placeholders. Sharing
the vault directly would replicate those placeholders to the Pi and silently publish a site with
missing images.

That is why `scripts/sync-icloud.sh` exists: it mirrors the vault into a plain local directory and
**refuses to run** if any file is still evicted. Syncthing shares the mirror, never the vault.

Mark the vault "Keep Downloaded" in Finder so eviction stops happening at all.

## Publishing

The Pi rebuilds within seconds of content changing, and polls every five minutes as a fallback. To publish by hand from the Mac:

```bash
scripts/sync-icloud.sh
scripts/build-deploy.sh
```

`build-deploy.sh` is host-agnostic and runs identically on the Mac and the Pi. It deploys with
`bunx` where bun is installed and falls back to `npx` otherwise, which is what the Pi uses. It runs
wrangler from `~/.cache/jamesjarvis.io-wrangler` rather than the repo, because bun installs into
the working directory and would otherwise leave `package.json`, `bun.lock` and `node_modules` in
the project on every deploy. It hashes the repo
and content tree and exits without rebuilding when nothing changed. Useful flags:

- `--force` — rebuild even if nothing changed
- `--no-deploy` — build only, skip the upload to Cloudflare
- `--pull` — fetch and reset to the tracked branch before building

`--pull` is opt-in and only the Pi's systemd unit passes it, so running the script on the Mac
never touches your working tree. It refuses to pull when the tree has local changes rather than
discarding them, so an experiment left on the Pi is not silently destroyed.

Note that this means a push to the tracked branch deploys itself within about five minutes, with
no review step. That is the trade for not having to update the Pi by hand.

Credentials come from `/etc/site-deploy.env` (Pi) or `~/.config/site-deploy.env` (Mac). See
`hosts/site-deploy.env.example`.

## Machine setup

### MacBook

```bash
mise install
brew install syncthing && brew services start syncthing
sudo cp /bin/bash /usr/local/bin/jj-agent-bash
sudo codesign --force --sign - /usr/local/bin/jj-agent-bash
cp hosts/mac/io.jamesjarvis.content-sync.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/io.jamesjarvis.content-sync.plist
```

Then grant **Full Disk Access** to `/usr/local/bin/jj-agent-bash` in System Settings → Privacy &
Security → Full Disk Access.

LaunchAgents do not inherit Full Disk Access, and `~/Library/Mobile Documents` is protected by
macOS, so without this the agent fails with `Operation not permitted` even though the same script
runs fine from your terminal. The agent uses a dedicated copy of bash so the grant applies only to
it, rather than to every bash script on the machine.

The re-signing step is not optional. `/bin/bash` is a platform binary whose signature is validated
against the kernel trust cache, so a plain copy is killed on launch with SIGKILL and no useful
error. `codesign --force --sign -` replaces it with an ad-hoc signature that is valid anywhere.

Sign before granting Full Disk Access: re-signing changes the binary's cdhash, which is what TCC
matches on, so a grant made beforehand stops applying. After a major macOS upgrade, re-copy,
re-sign, then remove and re-add the Full Disk Access entry.

Whenever the plist changes, reinstall it before reloading. `launchctl` reads the copy in
`~/Library/LaunchAgents`, not the one in this repo, so an unload/load cycle on its own silently
keeps running the old definition:

```bash
launchctl unload ~/Library/LaunchAgents/io.jamesjarvis.content-sync.plist
cp hosts/mac/io.jamesjarvis.content-sync.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/io.jamesjarvis.content-sync.plist
launchctl print gui/$(id -u)/io.jamesjarvis.content-sync | grep -A3 arguments
```

That last line is the check that matters: the arguments must list `jj-agent-bash`. If they show
the script alone, the stale plist is still loaded and the sync will keep failing with
`Operation not permitted`.

In the Syncthing GUI, share `~/development/jamesjarvis.io/content` as **Send Only**.

Do not open `~/development/jamesjarvis.io/content` as an Obsidian vault. It is a mirror, rewritten
by `rsync --delete` every minute, so edits made there are destroyed on the next sync. Edit
the iCloud vault instead.

`sync-icloud.sh` excludes `.stfolder`, `.stversions` and `.stignore` from the mirror. Syncthing
creates `.stfolder` in the folder root and the vault has no such file, so without those excludes
`rsync --delete` removes the marker on every run and Syncthing reports the folder as missing and
stops syncing. If that happens, `mkdir content/.stfolder` restores it.

### Raspberry Pi

Everything on the SSD, not the SD card.

1. Install [Tailscale](https://tailscale.com) on the Pi, MacBook and phone. This is how you reach
   the Pi's shell and the Syncthing web UI without exposing anything to the internet.
2. Clone this repo to `/srv/site/repo`, then `mise install`. The pins in `.mise.toml` resolve to
   arm64 builds.

   The clone is shallow and single-branch (`master`), so `git pull` fails with "Need to specify how to
   reconcile divergent branches" — the fetched commits share no visible ancestry with the local
   tip. Update it with fetch and reset instead, which is right for a deploy clone that never
   carries local changes:

   ```bash
   git fetch --depth 1 origin master && git reset --hard FETCH_HEAD
   ```

   `content/` and `resources/` are gitignored, so reset leaves both untouched.
3. Install Syncthing (`sudo apt install syncthing`, then
   `sudo systemctl enable --now syncthing@pi`) and accept the shared folder as **Receive Only**,
   pointed at `/srv/site/repo/content`. **Do the first 4 GB sync on the LAN.**

   Debian 12 ships Syncthing 1.19.2 against 2.x on the Mac. That pair is verified working, so
   there is no need to add the upstream apt repository.
4. Seed the image cache before the first build, so the Pi does not have to re-encode every photo:

   ```bash
   rsync -a ~/development/jamesjarvis.io/resources/ pi:/srv/site/repo/resources/
   ```

   A cold build resizes 355 large JPEGs and takes over an hour on ARM. After seeding, builds are
   incremental. This persistent cache is the main reason the Pi beats CI.
5. Write `/etc/site-deploy.env` from `hosts/site-deploy.env.example`, then
   `chown root:pi` and `chmod 640`. The Pi does not back anything up, so it needs only the
   Cloudflare keys.

   Group-readable rather than `600` on purpose. systemd reads `EnvironmentFile=` as root before
   dropping to `User=pi`, so the timer works either way, but running `build-deploy.sh` by hand as
   `pi` fails with a permission error on a root-only file. The `pi` user ends up holding the token
   in its process environment during a deploy regardless, so group read costs nothing.
6. Install `inotify-tools`, which the content watcher needs:

   ```bash
   sudo apt install inotify-tools
   ```

7. Install the units:

   ```bash
   sudo cp hosts/pi/*.service hosts/pi/*.timer /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable --now site-build.timer site-watch.service site-backup.timer
   ```

## Backups

Backups run on the **Mac**, not the Pi. The Mac is where everything flows through, and the mirror
at `~/development/jamesjarvis.io/content` is byte-identical to the vault while living outside
iCloud's protected storage — so the backup agent needs no Full Disk Access.

```bash
cp hosts/mac/io.jamesjarvis.content-backup.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/io.jamesjarvis.content-backup.plist
```

```bash
cp hosts/mac/io.jamesjarvis.content-backup-maintain.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/io.jamesjarvis.content-backup-maintain.plist
```

Credentials live in `~/.config/site-deploy.env`. Initialise the repository once with `restic init`
before the first run.

The nightly run does `backup` and `forget` only. `prune` and `check` download data from B2 and
cost money, so they run weekly instead via `backup.sh --maintain`, which is what the second agent
above is for. The password may be given as `RESTIC_PASSWORD`, or better as
`RESTIC_PASSWORD_COMMAND` reading from the macOS Keychain so it is not sitting in a file.

Because the backup reads the mirror rather than the vault, a broken `sync-icloud.sh` would mean
silently backing up stale content. `sync-icloud.sh` writes a `.last-sync` stamp on success and
`backup.sh` warns via ntfy if it is more than 24 hours old.

**Keep the restic password somewhere outside this machine.** Without it the backups cannot be
recovered.

## How quickly a change goes live

`site-watch.service` watches the synced content directory with recursive inotify and starts a
build once writes have been quiet for fifteen seconds. `site-build.timer` still runs every five
minutes as a fallback, which also covers pushes to the repo, since those change nothing locally
for inotify to see.

A systemd `.path` unit is not usable here. Path units are not recursive: a change to
`content/now/index.md` does not trigger a unit watching `content`, only a change to a direct child
does, and every post lives in a nested directory. This was tested rather than assumed.

End to end from saving on the Mac: up to sixty seconds for the iCloud mirror agent, a few seconds
for Syncthing, fifteen for the debounce, and about two and a half minutes to build and deploy.
Roughly four minutes worst case.

## Administration

| Want | Do |
|---|---|
| Shell on the Pi from anywhere | `ssh pi` over Tailscale |
| Is the Pi's content up to date? | Syncthing web UI over Tailscale |
| Build history and failures | `journalctl -u site-build` |
| Why didn't my post appear? | `tail ~/Library/Logs/content-sync.log` on the Mac |
| Force a publish | `scripts/build-deploy.sh --force` |
| Restore content | `restic restore latest --target /tmp/restore` (on the Mac) |
| Backup history | `tail ~/Library/Logs/content-backup.log`, or `restic snapshots` |

### Failure notifications

Build, deploy and backup failures push to your phone via [ntfy.sh](https://ntfy.sh). Successes are
silent, so any notification means something needs attention.

Set `NTFY_TOPIC` in the env file on each machine. **The topic name is not in this repository and
must not be**: this repo is public, and an ntfy.sh topic is unauthenticated, so anyone who knows
the name can both read and publish to it. It lives only in the env files and in the private
runbook note.

Subscribe with the ntfy app (iOS and Android), server `ntfy.sh`, using the topic from the env
file. Messages are cached for around twelve hours, so subscribing later still shows recent
alerts.

## Hosting

Cloudflare Pages, in Direct Upload mode — the Pi pushes builds with `wrangler pages deploy`, so
there is no Git integration to configure. DNS is already on Cloudflare.
