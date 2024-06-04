---
title: "📦 IPFS Web Hosting"
date: 2020-05-02
tags: ["projects"]
summary: "I thought IPFS was supposed to be permament..."
---

2020 has been defined by The Lockdown [(yay?)](https://www.bbc.co.uk/news/uk-52084517).
From March to July (and perhaps again, if the [(potential)](https://www.bbc.co.uk/news/uk-53159918) second wave is to come), basically everything shut down and we were all forced to spend time with family, and do nothing.

Well, around this time I was thinking "what are the problems humanity will face in the next 100 years?", and at some point I will write a little post outlining my daft ideas.

But during this, I came across the [IPFS](https://ipfs.io) project, and I'm astonished at the idea of solving a problem that does not yet exist.

## What is IPFS

Their goal is to create a distributed web protocol that can help distribute content to where it is most requested.
Ideally, this aims to prevent issues of enormous latencies that may arise from traditional centralised services, if humanity becomes interplanetary.

An example being, if you are living on mars, and the twitter servers are still hosted on earth, who would want to browse twitter if it took [13 minutes](https://blogs.esa.int/mex/2012/08/05/time-delay-between-mars-and-earth/) between opening twitter and each tweet starting to load?

Exactly, [ain't nobody got time for that](https://www.youtube.com/watch?v=zGxwbhkDjZM).
IPFS is basically a mix between a conventional file system, and torrents.
The basic idea is that if an IPFS node requests a file (using a content-addressable hash), then that node automatically starts serving that file to other nodes requesting it.
The benefit could be that if for example a video were to go viral, rather than the central server being absolutely hammered with requests, each person would essentially be downloading it off their neighbour, greatly reducing network congestion.

Now, I am certainly not the first to do this, and a great write up can be found [here](https://withblue.ink/2019/03/20/hugo-and-ipfs-how-this-blog-works-and-scales.html).

Long story short, I set up a little [Go-IPFS](https://github.com/ipfs/go-ipfs) node on my Raspberry Pi, and uploaded a copy of my site to [this probably out of date mirror](https://ipfs.jamesjarvis.io).

Now, more detail:

## GatsbyJS sucks with IPFS

This website is (currently) built with GatsbyJS, [as outlined here]({{<ref "posts/portfolio-site">}}).

Only thing is, GatsbyJS does not support relative links by default.
Sure, you can enable [gatsby-plugin-ipfs](https://www.gatsbyjs.org/packages/gatsby-plugin-ipfs/) to try and fix the relative urls problem, but it is not compatible with most other plugins.

As a result, Gatsby on IPFS does not work with manifests, sitemaps, or the most important gatsby-image integration.

So sure, if you browse the mirror on a normal browser, then it will work fine, since IPFS content is being forwarded through the [cloudflare gateway](https://www.cloudflare.com/distributed-web-gateway/) the url is being formatted with the normal domain, and all the links work fine.

However, if you browse the mirror on a browser with integrated IPFS (as it should do), then stuff like images and some other content will not load correctly.

## The future

I spent a few hours on this problem, and honestly I just gave up.

Perhaps in the future Gatsby will update to include relative URLs by default, but if you are absolutely desparate to host your content through IPFS, then I would recommend a different static site generator, such as [Hugo](https://gohugo.io).

If you are looking at a potentially commercially viable implementation of IPFS, I would recommend you check out [Filecoin](https://filecoin.io).

I know, I know "not another cryptocurrency", but this one is designed to pay people to host their content on IPFS, and in the future could potentially take on the big cloud providers?
