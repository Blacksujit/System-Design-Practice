# Twitter/News Feed - System Design

## Requirements

### Functional Requirements
- Post tweets (text, images, videos)
- Follow/unfollow users
- View timeline (home feed)
- View user feed
- Like, retweet, reply

### Non-Functional Requirements
- Low latency feed generation (<200ms)
- High availability
- Scalability (500M users, 300K QPS)
- Eventual consistency acceptable

## Capacity Estimation

- **Users**: 500M daily active
- **Tweets**: 500M per day = ~6,000 QPS
- **Feed reads**: 300K QPS
- **Storage**: 500M * 280 chars * 2 bytes = ~280GB/day

## High-Level Design

```
                         ┌─────────────────┐
                         │   Load Balancer  │
                         └────────┬────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
       ┌──────▼──────┐    ┌──────▼──────┐    ┌───────▼──────┐
       │ Tweet Service│   │Feed Service │    │ User Service │
       └──────┬──────┘    └──────┬──────┘    └──────┬───────┘
              │                   │                   │
       ┌──────▼──────┐    ┌──────▼──────┐    ┌───────▼──────┐
       │  Cassandra  │    │    Redis    │    │  PostgreSQL  │
       └─────────────┘    └─────────────┘    └──────────────┘
```

## Feed Generation Strategies

### Fan-out on Write (Push Model)
- When user posts, push to all followers' feeds
- Fast reads, slow writes
- Good for users with few followers

### Fan-out on Read (Pull Model)
- When user requests feed, pull from followees
- Fast writes, slow reads
- Good for celebrity accounts

### Hybrid Approach (Recommended)
- Push for regular users (< 10K followers)
- Pull for celebrities (> 10K followers)
- Best of both worlds

## Feed Generation Flow

```
1. User opens app, requests feed
2. Feed Service checks Redis cache
3. Cache miss: Query fan-out service
4. Fan-out service merges:
   - Pre-computed feeds from regular users
   - Real-time pulls from celebrities
5. Sort by timestamp/algorithm
6. Cache result in Redis
7. Return to client
```

## Database Schema

```sql
-- Tweets Table (Cassandra)
CREATE TABLE tweets (
    tweet_id TIMEUUID,
    user_id BIGINT,
    content TEXT,
    media_urls LIST<TEXT>,
    created_at TIMESTAMP,
    like_count COUNTER,
    retweet_count COUNTER,
    PRIMARY KEY (user_id, created_at, tweet_id)
) WITH CLUSTERING ORDER BY (created_at DESC);

-- User Follows Table
CREATE TABLE user_follows (
    user_id BIGINT,
    followee_id BIGINT,
    created_at TIMESTAMP,
    PRIMARY KEY (user_id, followee_id)
);

-- Timeline Cache (Redis)
-- Key: timeline:{user_id}
-- Value: Sorted Set of tweet_ids
```

## Timeline Cache (Redis)

```
# Add tweet to user's timeline
ZADD timeline:{user_id} {timestamp} {tweet_id}

# Get timeline
ZREVRANGE timeline:{user_id} 0 99

# Remove old tweets
ZREMRANGEBYRANK timeline:{user_id} 0 -1001
```

## Scaling Considerations

1. **Database Sharding**: Shard by user_id
2. **Read Replicas**: For feed queries
3. **CDN**: For media content
4. **Rate Limiting**: Prevent abuse

## Resources

- [How Twitter Uses Redis to Scale](https://www.infoq.com/presentations/Twitter-Timeline-Scalability/)
- [Twitter System Design](https://www.educative.io/courses/grokking-the-system-design-interview)
