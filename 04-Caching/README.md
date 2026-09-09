# Caching Strategies

## What is Caching?

Caching is storing frequently accessed data in a temporary storage layer to reduce latency and database load.

## Caching Patterns

### 1. Cache-Aside (Lazy Loading)
- Application checks cache first
- If miss, fetch from database
- Store result in cache

**Pros:**
- Only requested data is cached
- Cache failures don't affect database

**Cons:**
- Cold start (first request always hits DB)
- Cache stampede possible

### 2. Write-Through
- Write to cache and database simultaneously
- Cache always has fresh data

**Pros:**
- Strong consistency
- No cache misses after writes

**Cons:**
- Higher write latency
- May cache unused data

### 3. Write-Behind (Write-Back)
- Write to cache first
- Asynchronously write to database

**Pros:**
- High write performance
- Can batch database writes

**Cons:**
- Data loss risk on failure
- Complexity in implementation

### 4. Read-Through
- Cache layer handles database reads
- Application only talks to cache

**Pros:**
- Simplified application code
- Automatic cache population

**Cons:**
- Cache layer complexity
- First read still slow

## Cache Invalidation

### Time-based (TTL)
- Expire after fixed time
- Simple to implement
- May serve stale data

### Event-based
- Invalidate on data change
- More complex but accurate
- Requires event tracking

### Version-based
- Version cache entries
- Can rollback if needed
- More storage overhead

## Cache Topology

### Local Cache
- In-process cache (e.g., LRU)
- Very fast (nanoseconds)
- Not shared across instances

### Distributed Cache
- Separate cache service (e.g., Redis)
- Shared across instances
- Network latency (milliseconds)

### Multi-level Cache
- L1: Local cache
- L2: Distributed cache
- L3: Database

## Popular Cache Solutions

### Redis
- In-memory data structure store
- Supports strings, hashes, lists, sets
- Persistence options
- Pub/Sub messaging

### Memcached
- Simple key-value store
- Multi-threaded
- No persistence
- Great for simple caching

## Resources

- [Redis Documentation](https://redis.io/docs/)
- [Caching Patterns](https://martinfowler.com/)
- [High Performance Browser Networking](https://hpbn.co/)
- [Caching at Reddit](https://redditblog.com/2017/01/17/caching-at-reddit/)
