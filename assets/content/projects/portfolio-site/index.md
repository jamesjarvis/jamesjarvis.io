---
type: project
date: "2019-02"
title: "🖥 Open Source Portfolio Website"
tech: ["Javascript", "React", "GraphQL"]
link: "https://jamesjarvis.io"
source: "https://github.com/jamesjarvis/jamesjarvis.io"
previewImage: "./jamesjarvisio.png"
---

This very site you are reading, is open source, under the A-GPL licence with all the source code hosted on [GitHub](https://github.com/jamesjarvis/jamesjarvis.io).
You may fork it and fill in your own data if you wish, which is surprisingly easy to do, all thanks to [Gatsby](https://www.gatsbyjs.org/)!

I created this with GatsbyJS as I wanted to have my own personal portfolio site which simply consumes data stored externally (though within the same repo), rather than hard coding everything, which I felt was the issue with many other portfolio sites.

Now, I wanted to have a personal site so I could have a place to publicise the work I have done in the past, what I am planning in the future, and my thoughts and ramblings (As well as just to have a place for my 'digital identity' where I can link together all of my online personas into a single place).

I am a little bit cheap however, so after spending \$30 on domain fees I didn't want to spend any more money on actually hosting it. Which brings me to some of my favourite pieces of tech: the free kind.

## How to host for no cost whatsoever.

Since we are already using GitHub as a way to host our source code (for free!), we might as well use the latest and greatest [GitHub Pages](https://pages.github.com) to host the page source files for free as well! (I know right!??).

Since we are making a [JAMStack](https://jamstack.org) site, all we have is front-end stuff which we just need to plonk in any old static web hosting provider. Other great examples are [Netlify](https://www.netlify.com), and even on [Zeit](https://zeit.co/now).

To build your site, I would recommend setting up a CI/CD integration using GitHub actions, and pointing this to deploy to whatever hosting service you use (GitHub pages is the easiest I feel as you only need to push changes to another branch/folder within your repo).

That is basically all you need to do.

I would recommend also putting your site behind [Cloudflare](https://www.cloudflare.com), as this can speed up access to your site due to the way they cache it on any of their CDN nodes - again, all for free!

If you get to the point where you would like a 'lil bit of backend with your site, say for sending contact information or retrieving particular information which is too client-side heavy, then go [Serverless](https://serverless.com)!

Serverless lambda hosting is extremely quick to set up, maintain, and cheap! Not to mention the fact that you can choose between Amazon, Azure or Google to host your functions, the whole world of data hungry tech corporations are just begging to let you run code with them. Again, for FREE\*(or super cheap).

If you are going to go down this whole rabbit hole, I'd recommend having a [little read first](https://github.com/DevProgress/onboarding/wiki/Using-Circle-CI-with-Github-Pages-for-Continuous-Delivery).

## Have fun

Check out the code on GitHub [https://github.com/jamesjarvis/jamesjarvis.io](https://github.com/jamesjarvis/jamesjarvis.io).

As mentioned before, feel free to fork it and change the content yourself.

The content is hosted in `assets/` and `src/pages/projects/`.

If you have any more questions, reach out to me!
