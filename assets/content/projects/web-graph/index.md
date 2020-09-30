---
type: project
date: "2020-09"
title: "⠪ Graphing the Internet"
tech: ["Raspberry Pi", "Go"]
# link: "https://youtu.be/DiBl9JMlBUI"
# previewImage: "./garden-screenshot.jpg"
---

Once upon a time I was looking at my website, and I realised that I tend to link to a lot of random sites within each post I write.

I thought it would be interesting to find out all of the sites that I link to, and see if I could categorise them.

Unfortunately, I never really got around to figuring out the whole categorisation thing (like what do you even do? Manually classify them? Do some kind of NLP on the page title? [These guys](http://data.webarchive.org.uk/opendata/ukwa.ds.1/classification/) have attempted it previously but even that dataset only contains ~27k URL's and seems fairly limited to UK sites).

This then got me thinking about what kind of sites *link to me*.
This would be a **backlink checker**, that for some reason I had never heard of or thought about before.

I knew that Google, the NSA and many others regularly crawl the internet in order to improve their search products - [cloudflare explains it well](https://www.cloudflare.com/learning/bots/what-is-a-web-crawler/) - and I roughly knew that the more linked to your site was, the more popular it would be in search rankings.

However I didn't know how to find your individual backlinks - I just assumed it was some secretly guarded knowledge due to the sheer amount of effort required to find these backlinks.

Of course, me being me I didn't bother googling "uh how do i found out who links to my site on the interwebs pls", I just thought it would be easier to build a crawler myself 🤦‍♂️.

If you want to find out your own backlinks from an actual SEO service, skip to [Part 2](#Part-2:-Actual-SEO-services-for-finding-your-own-backlinks)

## Part 1: Building a link spider

I attempted and revisited this several times (to improve performance, mainly), but it basically started because I was heading to [the middle of nowhere](https://en.wikipedia.org/wiki/Wales) for a family holiday and I wanted to leave my laptop back at home doing some crawling while I couldn't hear the fans.

Originally, I thought I would just write the crawler from scratch (it's not hard to do tbf), but then I stumbled across [Colly](http://go-colly.org/) that looked like it could speed up development for me.

My original version just used a basic colly set up, with a simple postgresql db set up to record pages visited, and links from page to page.
Simple enough, and took an hour or so to code, so I left it running the evening before we left to see how far it could go.

Well, when I came back 4 days later I found that the fans had stopped, and discovered that the process had killed itself after scraping only 1.5 million links over 36 hours (averaging only ~12 links per second).

I couldn't see an obvious reason why it would have crapped itself, so I had a deeper look using go's fantastic inbuilt [pprof](https://pkg.go.dev/net/http/pprof) tool for delving into the internal stats of any go app.

What I had found out was that the crawler had likely ran out of memory, but most surprising to me was that colly's crawlers seemed to just spawn another process for each `a[href]` element found, causing them to spawn hundreds of goroutines every second.

This is a bit daft, so the first improvement I made was to switch to colly's [queue mode](http://go-colly.org/docs/examples/queue/), as that seemed to handle colly's goroutine obsession.

Secondly, let's focus on that paltry 12 links/second.
The first improvement I could think of was just [*spawning more processes*](https://youtu.be/uNy_MLr8mXA), but the new bottleneck became the way that I was pushing data to postgresql.

Previously, I was just creating a new insert transaction every time a new link was found, that was hammering my db with well over 2000 transactions per second and likely being the reason why all of these goroutines were hanging around for so long.

So, I moved to **batching**, by creating *n* database workers, I could happily push as much data into them through some go channels, and then I could consume up to *x* links at a time from these channels, and whack those in the database in one go.

Obviously, this introduces a whole bunch of fun async issues, such as potential duplicates and foreign key constraints (this can be solved by reorganising the db structure), and to that I say *fuck it*; `ON CONFLICT DO NOTHING`, turning a blind eye to those issues I should probably engineer out of this.

The only thing I did kinda care about was removing duplicates from being added to the channel, since if I was going to add 5000 links, with 4000 of those potential duplicates, it would seriously slow down any transaction.

For this, I just used a simple [LRU Cache](https://www.interviewcake.com/concept/java/lru-cache) called [golang-lru](https://github.com/hashicorp/golang-lru) to filter out some of the most common URLs.

In the current iteration (that I'm not going to bother improving for the foreseeable future and you can critique [here](https://github.com/jamesjarvis/web-graph)), I managed to collect ~ TODO links in TODO days.

## Part 2: Actual SEO services for finding your own backlinks

Ok, that handcrafted web crawler might have been cool and all, but the max I could get before crashing my PC was only a few million links, at a pathetic 100 links/second.

This pales to the big leagues, who [according to ahrefs](https://ahrefs.com/big-data) have approximately a *fuck ton* more resources than I do for this kind of stuff.
Some things you just have to leave to the professionals...

So heres the list of all the free\* backlink checkers if you are ever curious about your own SEO performance:

- [Ahrefs](https://ahrefs.com/backlink-checker)
