---
title: "Challenges with scaling Redis"
date: 2025-04-30
tags: ["projects"]
lastmod: 2025-04-16
---

## What is Redis?

Redis (Remote Dictionary Server) is an open-source (ish) in-memory data structure store.
Since its inception in the late 2000's, it has grown from a simple key-value store, becoming quite popular in the NoSQL community, and venturing even further to support several methods of message queuing.

Focusing on its bread and butter though, Redis is quite simply a very efficient single threaded server capable of atomically storing and retrieving key-value pairs in memory.

i.e. Say you wanted to store a `Key: Value` pair such as `Hello: World`, you could call SET or MSET with a key of `Hello` and value of `World` (`SET Hello World EX 86400` to set a TTL of 1 day), and then at a later date call GET or MGET to retrieve the value `World` from the key `Hello` (`GET Hello`). Simples.

You also have the options of setting Time-to-live (TTL) lifetimes on each item, to expire each cached value after a certain duration, or you could rely on setting a redis `maxmemory` configuration parameter (via `CONFIG SET maxmemory 100mb`) to limit the overall memory usage, and hope on an approximated Least Recently Used (LRU) strategy to clean up the least valuable elements in your Redis DB.
For more information on how to tune key eviction, I'd recommend reading the [Key eviction docs](https://redis.io/docs/latest/develop/reference/eviction/#lfu-eviction), but this is not a specific pre-requisite for the persistency issue, as we can assume we are overriding different Values for the same Key.

The most valuable feature of Redis (in addition to its speed), by far, are its **Atomic Operations**.
Redis can guarantee that the effects of a given operation are performed correctly, regardless of other concurrent requests.
This is extremely beneficial for implementing patterns like distributed locks or counters without race conditions.

From personal experience, a single Redis node is perfectly capable of supporting tens of thousands of GET requests per second, if using a library that can manage connection pooling well (such as [Ruedis](https://pkg.go.dev/github.com/redis/rueidis)), and batching requests using MGET, this can be scaled to 100,000's of key:value lookups per second.

Scaling further than this will require horizontally scaling 

## Cache persistency options and why they are useful

If you recall, Redis is fundamentally an in-memmory data store.
This means that all key:value pairs are stored in the Redis server's Random Access Memory (RAM), primarily for super fast reads + writes.

However, one critical flaw of RAM, is that it is volatile storage, and in the event of any power outage, it gets reset back to the zero state (i.e. full data loss).
In some applications, this can be acceptable if you are using Redis as a nice-to-have performance boost for a relatively small dataset (i.e. caching user details for an app with less than 1m users), or if you expect short entry lifetimes and therefore volatile key:value pairs anyway (i.e. using Redis as an external API Throttler or De-bouncer to save cost or mitigate performance concerns).

To mitigate the chance of a data-loss event if your Redis instance is killed or restarts, you can employ one of the two Persistency strategies that Redis offers: Redis DB Snapshotting (RDB) and Append only file (AOF).

### Redis DB (RDB)

The core functionality of Redis is stored in various data structures, organised into logical "Databases", but fundamentally stored in memory.
Redis offers the ability to configure "snapshotting" of this data, where the entire contents of 

### Append only file (AOF)

## Where Redis fails

The problem with Redis (at least with my experience, albeit on version 6) is that Redis does not have any guardrails to guarantee that Redis will not OOMKill / end up with a stale persistent store.
Let me explain further.

/// TODO: talk about high write 

## Caveats and alternatives

For large datasets, there are common performance issues with both RBD and AOF strategies that can be mitigated:
- Use fast storage hardware (i.e. SSDs, or NVMe drives) for fast replay.
- For AOF, you can avoid frequent disk writes by relaxing the number of times `fsync` is called.
    The default is `appendfsync everysec` which flushes to disk once per second rather than for each new element.

Specifically if you tune your hardware provisioning with expected usage (i.e. Using kubernetes, and only provisioning a specific node or memory limit for the deployment at the expected size of the cache, or by provisioning a Persistent Volume Claim (PVC) at roughly 3x the size of the cache), then you are 

//// TODO:
Change to a slightly more generic entrypoint, and 

