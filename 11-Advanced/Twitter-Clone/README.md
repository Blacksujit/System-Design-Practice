# Twitter Clone - System Design

## Requirements

### Functional Requirements
- Post tweets (280 characters + media)
- Follow/unfollow users
- Home timeline (personalized feed)
- User profile
- Like, retweet, reply
- Trending topics
- Search

### Non-Functional Requirements
- <200ms latency for timeline
- Eventual consistency for feed
- High availability
- Handle celebrities (millions of followers)
- Autonomous scaling

## Capacity Estimation

- **Users**: 300M DAU (1.5B total)
- **Tweets/day**: 400M
- **Timeline reads**: 60K QPS peak
- **Followers**: Average 200 per user
- **Storage**: 400M * 280 bytes = 112GB/day text only

## Architecture Overview

```
Client → CDN → Load Balancer → API Gateway
                                     │
          ┌──────────────┬──────────┴────────────┐
          │              │                       │
    ┌─────▼─────┐  ┌─────▼─────┐          ┌─────▼─────┐
    │ Tweet     │  │ Timeline  │          │  User     │
    │ Service   │  │  Service  │          │  Service  │
    └─────┬─────┘  └─────┬─────┘          └─────┬─────┘
          │              │                      │
    ┌─────▼─────┐  ┌─────▼─────┐          ┌─────▼─────┐
    │ Cassandra │  │ Redis     │          │ Postgres  │
    │ (Tweets)  │  │(Feeds)    │          │ (Users)   │
    └───────────┘  └───────────┘          └───────────┘
```

## Tweet Service

### POST /api/tweets
1. Validate tweet content
2. Store in Cassandra
3. Distribute to follower feeds
4. Update search index

### GET /api/tweets/{id}
1. Check cache
2. Query Cassandra
3. Return tweet + metadata

## Timeline Service

### Fanout Strategy
- **Regular users** (<10K followers): Push to all followers
- **Celebrities** (>10K followers): Pull on-demand

```python
def post_tweet(tweet_id, user_id, followers):
    if len(followers) < 10000:
        # Fanout-on-write
        for follower in followers:
            redis.zadd(f"timeline:{follower}", 
                       {tweet_id: time.time()})
    else:
        # Fanout-on-read: store in celebrity feed
        redis.zadd(f"celebrity_feed:{user_id}",
                   {tweet_id: time.time()})
```

### Timeline Generation
```python
def get_timeline(user_id):
    timeline = redis.zrevrange(f"timeline:{user_id}", 0, 99)
    # If timeline empty, fallback to merge
    if not timeline:
        timeline = merge_following_feeds(user_id)
    return timeline
```

## Trending Topics Service

1. **Ingestion**: Stream tweets via Kafka
2. **Processing**: Extract hashtags/words
3. **Aggregation**: Count frequency per time window
4. **Ranking**: Rank by score (count + recency)
5. **Caching**: Cache top trends every minute

## Search Service

```
Tweets → Kafka → Index Pipeline → Elasticsearch
                                      │
                            ┌─────────▼─────────┐
                            │ Search Query API  │
                            └──────────────────┘
```

## Database Schema

```sql
-- Tweets (Cassandra)
CREATE KEYSPACE twitter;
CREATE TABLE tweets (
    tweet_id TIMEUUID,
    user_id BIGINT,
    content TEXT,
    media_urls LIST<TEXT>,
    like_count COUNTER,
    retweet_count COUNTER,
    reply_to TIMEUUID,
    created_at TIMESTAMP,
    PRIMARY KEY (user_id, created_at, tweet_id)
) WITH CLUSTERING ORDER BY (created_at DESC);

-- Follows
CREATE TABLE follows (
    user_id BIGINT,
    followee_id BIGINT,
    created_at TIMESTAMP,
    PRIMARY KEY (user_id, followee_id)
);
-- Secondary index for:"user_id", index:"followee_id" to get followers
```

## Media Storage

```
POST to Media Service → Get S3 pre-signed URL → Upload → Get permanent URL
```

## Key Interview Points

1. **Fanout analysis**: Why hybrid approach?
2. **Cache optimization**: Redis sorted sets for timelines
3. **Celebrity problem**: How to handle @BarackObama's tweets
4. **Consistency model**: Eventual consistency for feeds
5. **Search indexing**: Real-time vs batch indexing

## Resources

- [Twitter Architecture 2021](https://blog.twitter.com/engineering/en_us/topics/infrastructure/2021/deploying-team-18-0-twitter-moments)
- [Grokking System Design Interview](https://www.educative.io/courses/grokking-the-system-design-interview)
- [System Design Interview - Alex Xu](https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF)