---
type: project
date: "2020-10"
title: "⠪ Mapping the Internet (?)"
tech: ["Go"]
source: "https://github.com/jamesjarvis/web-graph"
# link: "https://youtu.be/DiBl9JMlBUI"
previewImage: "./jamesjarvis-backlinks-query.png"
---

Once upon a time I was looking at my website, and I realised that I tend to link to a lot of random sites within each post I write.

I thought it would be interesting to find out all of the sites that I link to, and see if I could categorise them.

Unfortunately, I never really got around to figuring out the whole categorisation thing (like what do you even do? Manually classify them? Do some kind of NLP on the page title? [These guys](http://data.webarchive.org.uk/opendata/ukwa.ds.1/classification/) have attempted it previously but even that dataset only contains ~27k URL's and seems fairly limited to UK sites).

This then got me thinking about what kind of sites _link to me_.
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

I couldn't see an obvious reason why it would have crapped itself, so I had a deeper look using go's fantastic inbuilt [pprof](https://pkg.go.dev/net/http/pprof) tool for delving into the internal stats of a running go app.

What I had found out was that the crawler had likely ran out of memory, but most surprising to me was that colly's crawlers seemed to just spawn another process for each `a[href]` element found, causing them to spawn hundreds of goroutines _every second_.

This is a bit daft, so the first improvement I made was to switch to colly's [queue mode](http://go-colly.org/docs/examples/queue/), as that seemed to handle colly's goroutine obsession, and allowed me to sacrifice scraping certainty (since any links found beyond the queue limit are just discarded) for runtime certainty.

Secondly, let's focus on that paltry 12 links/second.
The first improvement I could think of was just [_spawning more processes_](https://youtu.be/uNy_MLr8mXA), but the new bottleneck became the way that I was pushing data to postgresql.

Previously, I was just creating a new insert transaction every time a new link was found, that was hammering my db with well over 2000 transactions per second and likely being the reason why all of these goroutines were hanging around for so long.

So, I moved to **batching**, by creating _n_ database workers, I could happily push as much data into them through some go channels, and then I could consume up to _x_ links at a time from these channels, and whack those in the database in one go.

```go
// Worker is the worker process for the link batcher
// This is straight up nicked from https://blog.drkaka.com/batch-get-from-golangs-buffered-channel-9638573f0c6e
func (lb *LinkBatcher) Worker(endSignal chan bool) {
  // We want it to die on the endSignal, but otherwise keep looping
  for {
    select {
    case <-endSignal:
      // Die on endSignal received
      return
    default:
      var links []*Link
      // Now I'm typing this blog, I realise there is a potential deadlock here,
      // whereby the endSignal may not be received while we wait for the next link
      // oh well, turns out we never use an endSignal in an infinite scrape anyway ¯\_(ツ)_/¯
      links = append(links, <-lb.bufChan)
      remains := lb.maxBatch

      // Here we use a go label to break out of the repetition loop if there are no more links
      // in the channel, otherwise it will naturally break once the max batch size is reached.
    Remaining:
      for i := 0; i < remains; i++ {
        select {
        case link := <-lb.bufChan:
          links = append(links, link)
        default:
          break Remaining
        }
      }

      // Then we just whack those links into a database batch insert function.
      err = lb.s.BatchAddLinks(links)
      if err != nil {
        log.Printf("Batch adding links failed!: %e", err)
      }
    }
  }
}
```

Obviously, this introduces a whole bunch of fun async issues, such as potential duplicates and foreign key constraints (this can be solved by reorganising the db structure), and to that I say _fuck it_; `ON CONFLICT DO NOTHING`, turning a blind eye to those issues I should probably engineer out of this.

The only thing I did kinda care about was removing duplicates from being added to the channel, since if I was going to add 5000 links, with 4000 of those potential duplicates, it would seriously slow down any transaction.

For this, I just used a simple [LRU Cache](https://www.interviewcake.com/concept/java/lru-cache) called [golang-lru](https://github.com/hashicorp/golang-lru) to filter out some of the most common URLs.

In the current iteration (that I'm not going to bother improving for the foreseeable future and you can critique [here](https://github.com/jamesjarvis/web-graph)), I managed to collect ~ 50 million links between ~ 9 million pages in ~ 3 days.

That's a happy 16x improvement upon my initial attempt, but I am unfortunately starting to hit the limits of my 7 year old laptop (running the `COUNT(*)` query just to get those numbers took several minutes with nothing else running...)

If I can be fully bothered, I may write another post exploring the data, or leave it running a couple weeks and upload a csv file of the links found, but for now I'll leave you with a couple interesting things I found:

1. Wikipedia is a crawler's best friend, with the #1 number of pages found.

Top 5 for reference:

| host               | num_pages |
| ------------------ | --------- |
| "en.wikipedia.org" | 2375201   |
| "twitter.com"      | 533493    |
| "web.archive.org"  | 464023    |
| "artuk.org"        | 394299    |
| "t.co"             | 258350    |

2. I only managed to find a total of 5 external backlinks to <jamesjarvis.io> pages through this crawler, all of which I also link to within my own website, so I guess I would have had to run the crawler a LOT longer in order to organically find any proper backlinks.

3. Regrettably, I am unable to draw any further conclusions, since my old ass laptop ran out of storage before completing this simple query for finding the top 5 backlinked sites:

```SQL
SELECT url, COUNT(from_page_id) AS num_backlinks
FROM links_visited
INNER JOIN pages_visited
ON links_visited.to_page_id = pages_visited.page_id
GROUP BY url
ORDER BY num_backlinks DESC
LIMIT 5
```

(No, really, apparently running this query took up 10GB+ of temporary storage on the database and since my laptop is filled with 200GB of "other", it just died.)

\#GetJamesADecentDevMachine2021

In the future, I would like to continue with the original "mapping the internet" goal, and see if it would be possible to generate an image of the internet link graph?
Although certainly not with this laptop...

## Part 2: Actual SEO services for finding your own backlinks

Ok, that handcrafted web crawler might have been cool and all, but the max I could get before crashing my PC was only a few million links, at a pathetic 100 links/second.

This pales to the big leagues, who [according to ahrefs](https://ahrefs.com/big-data) have approximately a _fuck ton_ more resources than I do for this kind of stuff.
Some things you just have to leave to the professionals...

So heres the list of all the free\* backlink checkers if you are ever curious about your own SEO performance:

- [Ahrefs](https://ahrefs.com/backlink-checker) - seems to have the largest trough of data at their disposal.
- [NeilPatel](https://neilpatel.com/backlinks/) - I've started using this tool now and it seems pretty cool. Might be a good game to increase your backlinks overtime.
- [SmallSEOTools](https://smallseotools.com/backlink-checker/) - This one got some slightly weird results for me, so idk how good it is.
- [SEOReviewTools](https://www.seoreviewtools.com/valuable-backlinks-checker/) - This one was kinda interesting, as it showed uses of static assets from my site. So if you want to see why one of your images is getting 1000+ views and your posts aren't, this could help.
- [TheHoth](https://www.thehoth.com/backlinks-checker/) - Wants an email, not a fan of that.
- [SiteChecker](https://sitechecker.pro/backlinks-checker/) - Limits results so whilst you can see a count of backlinks, you can't see more than 20 of the actual referring urls.
