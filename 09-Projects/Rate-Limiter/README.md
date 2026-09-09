# Rate Limiter - System Design

## Requirements

### Functional Requirements
- Limit requests per client/IP/user
- Different limits per endpoint
- Return proper HTTP 429 responses
- Support distributed systems

### Non-Functional Requirements
- Low latency (<1ms overhead)
- High accuracy
- Memory efficient
- Fault tolerant

## Rate Limiting Algorithms

### 1. Token Bucket
- Tokens added at fixed rate
- Request consumes token
- Burst friendly

```
Bucket size: 10 tokens
Refill rate: 2 tokens/second
Request: Consume 1 token
If no tokens: Reject with 429
```

### 2. Leaky Bucket
- Requests enter queue
- Processed at fixed rate
- Smooths traffic spikes

### 3. Fixed Window Counter
- Count requests in time window
- Simple to implement
- Edge case: 2x burst at window boundary

### 4. Sliding Window Log
- Store timestamp of each request
- Count requests in sliding window
- Memory intensive but accurate

### 5. Sliding Window Counter
- Hybrid of fixed window and log
- Weighted combination of current and previous window
- Good balance of accuracy and efficiency

## Distributed Rate Limiting

### Redis Implementation
```lua
-- Token Bucket in Redis
local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refill_rate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

local bucket = redis.call('HMGET', key, 'tokens', 'last_refill')
local tokens = tonumber(bucket[1]) or capacity
local last_refill = tonumber(bucket[2]) or now

-- Refill tokens
local elapsed = now - last_refill
local new_tokens = math.min(capacity, tokens + elapsed * refill_rate)

-- Try to consume
if new_tokens >= 1 then
    new_tokens = new_tokens - 1
    redis.call('HMSET', key, 'tokens', new_tokens, 'last_refill', now)
    redis.call('EXPIRE', key, math.ceil(capacity / refill_rate) * 2)
    return 1
else
    return 0
end
```

## API Design

```
Rate Limit Headers:
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200

HTTP 429 Response:
{
    "error": "rate_limit_exceeded",
    "message": "Too many requests",
    "retry_after": 30
}
```

## Implementation Strategy

### Application Level
- In-memory token bucket per instance
- Fast but not distributed

### Redis Level
- Centralized rate limiting
- Lua scripts for atomicity
- Redis Cluster for scaling

### Hybrid Approach
- Local cache for hot paths
- Redis for global limits
- Best of both worlds

## Resources

- [Cloudflare Rate Limiting](https://www.cloudflare.com/rate-limiting/)
- [Stripe Rate Limiting](https://stripe.com/docs/rate-limits)
- [System Design Interview - Alex Xu](https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF)
