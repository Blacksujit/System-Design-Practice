# URL Shortener Deep Dive

## Complete Design Walkthrough

This document takes you through the full design of a URL shortener at scale.

## Requirements Analysis

### Functional Requirements
1. **Shorten URLs**: Accept long URL, return short code
2. **Redirect**: Route short URL to original
3. **Custom aliases**: Users choose their own codes
4. **Analytics**: Track clicks, referrers, locations
5. **Expiration**: Optional link expiry
6. **User accounts**: Manage links (optional)

### Non-Functional Requirements
1. **Availability > 99.9%**
2. **Redirect latency < 100ms**
3. **Scale**: 100M new URLs/day, 100B clicks/day
4. **No data loss**

## Scale Estimation

```
DAU: 100M
New URLs/day: 10M
URL lookups/day: 100M
QPS (lookup): 100M / 86400 ≈ 1,200 reads/sec → peak 3,000
QPS (create): 10M / 86400 ≈ 115 writes/sec → peak 300

Storage (5 years):
  10M new URLs/day × 365 × 5 = 18B URLs
  Each URL ~500 bytes = 9TB
  Plus indexes ≈ 15TB
```

## API Design

```http
# Create short URL
POST /api/shorten
{
  "url": "https://example.com/very/long/path",
  "custom_alias": "my-link",        // optional
  "expiry": "2025-12-31T00:00:00Z"  // optional
}
Response:
{
  "short_code": "abc123",
  "short_url": "https://short.ly/abc123",
  "expiry": "2025-12-31T00:00:00Z"
}

# Redirect
GET /abc123
Location: https://example.com/very/long/path
Status: 301 (permanent) or 302 (temporary)

# Get stats
GET /api/stats/abc123
{
  "clicks_24h": 342,
  "clicks_total": 15432,
  "top_referrers": [{"source": "twitter.com", "count": 8921}]
}
```

## Short Code Generation

### Option 1: Base62 Encoding
- Alphabet: `a-z A-Z 0-9` (62 chars)
- 7 chars: 62^7 ≈ 3.5 trillion URLs
- Generate unique ID → convert to Base62

```python
BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

def encode_base62(num):
    if num == 0:
        return BASE62[0]
    result = []
    while num > 0:
        num, rem = divmod(num, 62)
        result.append(BASE62[rem])
    return ''.join(reversed(result))

def decode_base62(code):
    return sum(BASE62.index(c) * (62 ** i) 
               for i, c in enumerate(reversed(code)))
```

### Option 2: Hash-based
- MD5/SHA256 → take first 6-8 chars
- Collision handling needed

### Option 3: Counter-based (Recommended)
```python
# Use a distributed unique ID service:
# 1. Unique ID via Redis INCR or Snowflake
# 2. Encode to Base62
id = get_unique_id()      # e.g., 124567890123
short_code = encode_base62(id)  # "abcd123"
```

## Database Schema

```sql
CREATE TABLE urls (
    id BIGSERIAL PRIMARY KEY,
    short_code VARCHAR(10) UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    user_id BIGINT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NULL,
    is_custom BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_short_code ON urls (short_code);
CREATE INDEX idx_user_id ON urls (user_id);
CREATE INDEX idx_expires_at ON urls (expires_at);

-- Click Analytics (separate table or time-series DB)
CREATE TABLE clicks (
    job_id BIGSERIAL PRIMARY KEY,
    short_code VARCHAR(10) NOT NULL,
    clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    referral TEXT,
    user_agent TEXT,
    ip_address INET
);
-- Consider partitioning by clicked_at
```

## Architecture Diagram

```
                   ┌─────────────────┐
                   │  DNS/CDN        │
                   │  (static)       │
                   └────────┬────────┘
                            │
                   ┌────────▼────────┐
                   │  Load Balancer  │
                   └────────┬────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
     ┌────────▼────────┐  ┌─▼────────────−┐  ┌─────────────┐
     │  API Servers    │  │ Read Replicas │  │  Write      │
     │  (stateless)    │  │ (PostgreSQL)  │  │  Master     │
     └────────┬────────┘  └──────┬───────┘  └──────┬──────┘
              │                  │                  │
              │        ┌─────────▼─────────┐       │
              │        │   Redis Cache    │       │
              │        └──────────────────┘       │
              │                                    │
              ▼                                    ▼
     ┌─────────────────┐                 ┌─────────────────┐
     │   Kafka Stream  │                 │  ID Generator  │
     │  (analytics)    │                 │  (Redis INCR)  │
     └─────────────────┘                 └─────────────────┘
```

## Caching Strategy

### Heat vs Cold URLs
- 20% of URLs receive 80% of traffic (Pareto)
- Cache hottest 20% in Redis

### Cache Flow
```python
def redirect(short_code):
    # 1. Try Redis
    url = redis.get(f"url:{short_code}")
    
    # 2. Cache miss → DB
    if url is None:
        url = db.query("SELECT original_url FROM urls WHERE short_code=%s", 
                       short_code)
        if url:
            # Cache with tiered TTL: 1h to 24h
            redis.setex(f"url:{short_code}", 3600, url)
    
    # 3. Hit rate target >90%
    return event_redirect(url)
```

### Cache Stampede Prevention
```python
# Use SET NX to prevent stampede
if redis.setnx(f"lock:{short_code}", "1", ex=5):
    url = db_query(...)  # only one query
    redis.set(f"url:{short_code}", url, ex=3600)
    redis.delete(f"lock:{short_code}")
```

## Analytics Pipeline

```
Client Redirect → App Server → Kafka (event) 
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
              ┌─────▼─────┐    ┌────▼─────┐    ┌────▼─────┐
              │ Click     │    │ Click    │    │ Raw Data │
              │ Counter   │    │ Counter  │    │   Lake   │
              │ (Redis)   │    │ Service  │    │  (S3)    │
              └─────┬─────┘    └────┬─────┘    └──────────┘
                    │               │
              ┌─────▼─────┐    ┌────▼─────┐
              │ Daily     │    │ Real-time│
              │ Aggregator│    │ Dashboard│
              └───────────┘    └──────────┘
```

## Failure Handling

### 1. Cache Down
- Falls through to DB
- Use circuit breaker (e.g., Hystrix)
- DB can handle base load

### 2. DB Down
- Cache serves hot URLs (temporary)
- Write queue builds up
- Failover to replica

### 3. ID Generator Down
- Redis INCR is redundant (master + replicas)
- Fallback: Snowflake algorithm
- Allocate ID ranges to apps (batching)

## Scaling Playbook

### At 1M URLs
- Single PostgreSQL + Redis
- 2 app servers

### At 100M URLs
- Shard by short_code hash
- Read replicas (3-5)
- Redis Cluster (2-3 nodes)

### At 10B URLs
- Global distribution
- Regional deployments
- Multi-master DB
- Edge CDN caching

## Interview Talking Points

1. **Why Base62?**: Efficient, URL-safe, compact
2. **Why counter over hash?**: No collisions
3. **301 vs 302**: 301 cacheable for SEO, 302 for analytics
4. **Cache hierarchy**: L1 client → L2 CDN → L3 Redis → DB
5. **Consistency**: Eventually consistent is fine
6. **DB choice**: PostgreSQL for transactional integrity, can shard later