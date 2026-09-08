# jamesjarvis.io

My personal site, at <https://jamesjarvis.io>. A static site built with [Hugo](https://gohugo.io),
inheriting the [Congo theme](https://github.com/jpanther/congo).

**This repository contains only the code**: layouts, assets, config, and the scripts that build and
deploy the site. The writing and photos live outside it.

For how the site is built, deployed and backed up, and how to set up the machines that do it, see
[DEPLOYMENT.md](DEPLOYMENT.md).

## Repository layout

| Path | What it holds |
|---|---|
| `config/_default/` | Hugo configuration, split by concern: site, params, menus, markup, languages, modules |
| `layouts/` | Overrides of the Congo theme. Anything here wins over the module's copy |
| `layouts/_markup/` | Render hooks — how images and links in Markdown become HTML |
| `assets/` | CSS, icons and images processed by Hugo's asset pipeline |
| `static/` | Files copied to the site root verbatim, without processing |
| `archetypes/posts/` | Front matter template for `hugo new content` |
| `scripts/` | Sync, build, deploy and backup scripts. Host-agnostic |
| `hosts/` | LaunchAgent plists, systemd units and the env file example |
| `content/` | **Gitignored.** Mirrored in from the vault. See below |
| `public/`, `resources/` | **Gitignored.** Build output and Hugo's image cache |

The theme is a Hugo module rather than a submodule, pinned in `go.mod`.

## Where the content lives

`content/` is gitignored and populated from outside the repository. There are three copies of the
content and only one of them matters.

| Copy | Role |
|---|---|
| `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/jamesjarvis.io-content` | **Canonical.** The only copy anyone should ever edit |
| `~/development/jamesjarvis.io/content` on the Mac | A mirror of the vault. Disposable |
| `/srv/site/repo/content` on the Pi | A copy of that mirror. Disposable |

Edit the vault with Obsidian, on the Mac or the phone. Both downstream copies are rebuilt from it
and can be deleted at any time without losing anything: delete the mirror and the next sync
recreates it, delete the Pi's copy and Syncthing refills it from the mirror.

The flow is one-way, so nothing downstream ever needs merging back. It is not immune to conflicts
though: if a downstream copy is modified locally, Syncthing writes a `.sync-conflict-` file rather
than silently discarding it. Hugo ignores those, so a conflict cannot break a build, but it does
mean something wrote where it should not have.

Content prior to the split remains in this repository's git history.

The full sync chain, and why Syncthing must never watch the iCloud folder directly, are in
[DEPLOYMENT.md](DEPLOYMENT.md).

## Writing

Create a post in the vault, not here:

```bash
hugo new content posts/your_post_here --contentDir "$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents/jamesjarvis.io-content"
```

Post directories are named `YYYY-MM-<name>` so they sort chronologically in the editor. The
directory name never reaches the URL: permalinks are `/posts/:year/:month/:slug/`, and the
archetype writes an explicit `slug` with the date prefix stripped. Setting the slug at creation is
what keeps a post's URL stable when its title changes.

Link between posts with a relative Markdown link ending in `.md`, which Obsidian can follow and
Hugo rewrites to the canonical permalink:

```markdown
[here](../2024-10-on-buying-a-house/index.md)
[a tag](../../tags/travel/_index.md)
```

Leaf pages resolve through `index.md`, sections and tags through `_index.md`. Use the `.md` form
rather than a bare directory: only `.md` links that fail to resolve produce a
`[CONGO] Can't resolve:` warning, so anything else breaks silently.

## Drafts and templates

`draft: true` in a post's front matter keeps it out of the build, as does a future `date`.

Obsidian templates are a different problem. They live inside the vault, the vault is `content/`,
and Obsidian's placeholder syntax is not valid YAML: a front matter line like
`date: {{date:YYYY-MM-DD}}` starts a flow mapping, so Hugo fails to parse the file and **aborts the
entire site build**, not just that page. A single template file takes the whole site down.

`ignoreFiles = ['_templates/']` in `config/_default/config.toml` makes Hugo skip the directory
before it parses anything, so templates can keep their raw placeholder syntax. Point Obsidian's
template folder at `_templates` and put them there.

They stay in the vault and the mirror, so restic still backs them up. They just never reach the
build.

## Running locally

```bash
mise install
scripts/sync-icloud.sh
hugo server
```

### Don't build while `hugo server` runs

`hugo server` continuously rewrites `public/` with a livereload script injected, and
`build-deploy.sh` builds into the same directory before uploading it. Running both at once can
publish a build carrying a livereload tag pointing at localhost. Stop the server first, or let the
Pi do the deploy.

## The footer timestamp

Hovering the author name in the footer shows when the site was last built.

The timestamp is deliberately not in the HTML. Rendering `now` into a page would change all 138
pages on every build, invalidating every cached page and making each deploy re-upload the whole
site. Instead the build writes a single `build.txt` at the root and a small script in
`layouts/_partials/footer.html` fetches it on idle. Two consecutive builds differ by that one
file and nothing else.

`layouts/_partials/footer.html` is a copy of the theme's, so it needs reconciling if Congo changes
its footer.

## Dependency pinning

Hugo is fussy about versions, so Go, Node and hugo-extended are pinned in `.mise.toml` with
[mise](https://mise.jdx.dev/getting-started.html). Every machine runs `mise install` and gets the
same toolchain.
