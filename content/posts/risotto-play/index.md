---
title: "🍲 Risotto Play"
date: 2020-04-20
tags: ["projects"]
summary: "Online playground for a useless programming language"
---

[Try it out here!](https://play.risotto.dev/)

Sometime back in 2018, a friend of mine started building his own programming language, "Risotto" [(GitHub link)](https://github.com/risotto/risotto) (although I wanted the name to be "Ravioli" so the syntax could be "Ravioli Ravioli, give me the formuoli" [(I know, I'm immature)](https://www.youtube.com/watch?v=z9r8Swai8_g&feature=youtu.be&t=32)).

Anywho, I've enjoyed using services such as [The Go Play Space](https://goplay.space/) and [Repl](https://repl.it/) in the past, and wanted to replicate this kind of environment (whilst paying 0 for hosting) for Risotto.

## The API

[Code](https://github.com/risotto/play)

This runs on [Kubesail](https://kubesail.com/) for easy K8s deployment (and the free tier), with the API written in Go, and spawning a process running the code passed to it.

In order to keep the API service performant, there's a little bit of IP addressed rate limiting, and runtime constraints, but overall the traffic is low enough that this hasn't come close to being an issue yet.

The API is designed so that if anyone wants, they can use it for their own purposes, which is highly encouraged (get Risotto out there!)

It is also covered with Unit Tests, and automatic CI/CD.

## The UI

[play.risotto.dev](https://play.risotto.dev)

[Code](https://github.com/risotto/play-ui)

This is hosted with [GitHub pages](https://pages.github.com/) for easy CI/CD and just fantastic performance.

Written in React (TypeScript flavour), it's fairly simple but is optimised for responsive design and even has a cute little "Share" feature, so you can share your creations with others.
