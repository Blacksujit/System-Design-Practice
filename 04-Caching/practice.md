# Caching - Practice Problems

## Problem 1: Design a Distributed Cache
**Requirements:**
- Support millions of keys
- High availability
- Consistent hashing
- Cache invalidation

**Questions to Ask:**
- What data types to support?
- What consistency requirements?
- What eviction policy?

## Problem 2: Design a CDN Cache
**Requirements:**
- Cache static content globally
- Reduce origin server load
- Handle cache invalidation

**Questions to Ask:**
- What content to cache?
- What TTL strategy?
- How to handle purging?

## Problem 3: Design a Database Query Cache
**Requirements:**
- Cache frequent queries
- Invalidate on data changes
- Support complex queries

**Questions to Ask:**
- What query patterns?
- What consistency level?
- What cache size?

## Problem 4: Design a Session Store
**Requirements:**
- Store user sessions
- High availability
- Fast access
- Auto-expiration

**Questions to Ask:**
- What session data?
- What expiration time?
- What security requirements?

## Problem 5: Design a Rate Limiter Cache
**Requirements:**
- Track request counts
- Support sliding window
- Distributed across servers

**Questions to Ask:**
- What time window?
- What granularity?
- What consistency needs?
