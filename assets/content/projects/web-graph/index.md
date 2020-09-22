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



## Part 2: Actual SEO services for finding your own backlinks

Ok, that handcrafted web crawler might have been cool and all, but the max I could get before crashing my PC was only a few million links, at a pathetic 100 links/second.

This pales to the big leagues, who [according to ahrefs](https://ahrefs.com/big-data) have approximately a *fuck ton* more resources than I do for this kind of stuff.
Some things you just have to leave to the professionals...

So heres the list of all the free\* backlink checkers if you are ever curious about your own SEO performance:

- [Ahrefs](https://ahrefs.com/backlink-checker)
