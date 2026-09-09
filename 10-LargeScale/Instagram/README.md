# Instagram / Photo Sharing - System Design

## Requirements

### Functional Requirements
- Upload photos/videos
- Feed generation (follow users)
- Likes and comments
- Direct messages
- Stories (24-hour expiring content)
- Search (people, tags, locations)

### Non-Functional Requirements
- Feed load latency < 200ms
- Availability > 99.9%
- Media durability (never lose a photo)
- Read-heavy (10:1 read:write)
- Eventually consistent (feed)

## Capacity Estimation

- **DAU**: 500M active users
- **Photos/day**: 100M uploads
- **Feed reads/day**: 2B (4 posts/user/day)
- **Photo size**: 500KB avg (compressed)
- **Storage**: 100M * 500KB = 50TB/day new media
- **Feed QPS**: 2B/86400 ≈ 23K QPS reads

## High-Level Design

```
┌─────────┐
│  Client │
└────┬────┘
     │
┌────▼────┐   ┌────────────┐
│  CDN    │   │  LB        │
└────┬────┘   └─────┬──────┘
     │              │
     └──────┬───────┘
            │
   ┌────────▼────────┐
   │  API Gateway    │
   └───┬────────┬────┘
       │        │
┌──────▼───┐ ┌──▼──────────┐   ┌────────────┐
│ Photo    │ │ Feed        │   │  Media     │
│ Service  │ │ Service     │   │  Pipeline  │
└─────┬────┘ └────┬────────┘   └─────┬──────┘
      │           │                  │
┌─────▼─────┐ ┌───▼─────────┐  ┌────▼────────────────────┐
│ Cassandra │ │ Redis       │  │  Object Storage (S3)    │
│ (metadata)│ │ (timelines) │  │  + CDN at the edge      │
└───────────┘ └─────────────┘  └─────────────────────────┘
```

## Photo Upload Flow

```
1. Client requests pre-signed URL from API
2. Client uploads directly to S3 (no server bottleneck)
3. S3 triggers event → Media Pipeline
4. Pipeline:
   - Generate sizes (thumbnail, small, medium, large)
   - Apply compression (WebP/AVIF)
   - Store originals + processed
   - Extract EXIF, generate blurhash
5. Update metadata in Cassandra
6. Notify Feed Service (fan-out to followers)
```

### Media Pipeline Components
```
S3 Event → Lambda/Worker → 
  1. Transcode (thumbnail, various resolutions)
  2. Optimize (format + quality)
  3. Content Moderation (NSFW / image safety ML)
  4. Persist to final buckets
  5. CDN purge/invalidate old keys
```

## Feed Generation (Hybrid Fanout)

```
POST /photos { media_id }

    ↘ Log to own timeline
    ↘ Fan-out to follower timelines (Async via queue)

     Regular user (≤10K followers):
        ZADD timeline:{follower} now media_id   // pushed

     Celebrity (>10K followers):
        Store in celebrity feed (fanout-on-read)
        On feed request: merge pulls from celebs
```

### Feed Read
```
GET /feed?offset=0&limit=20

  1. Redis: ZREVRANGE timeline:{user} 0 19
  2. Handle pagination
  3. For recent celebrities: merge their feeds (capability)
  4. Fetch metadata + pre-signed media URLs
  5. Serve via API/CDN
```

## Database Schema

```sql
-- Media metadata (Cassandra)
CREATE TABLE media (
    media_id TIMEUUID,
    user_id BIGINT,
    type TEXT,           -- photo, video, reel
    caption TEXT,
    media_urls MAP<TEXT, TEXT>, -- {thumb, small, medium}
    dimensions MAP<TEXT, INT>,
    location MAP<TEXT, TEXT>,
    created_at TIMESTAMP,
    PRIMARY KEY (user_id, created_at, media_id)
);

-- Follows (Cassandra)
CREATE TABLE follows (
    user_id BIGINT,
    followee_id BIGINT,
    created_at TIMESTAMP,
    PRIMARY KEY (user_id, followee_id)
);

-- Likes (Cassandra - huge volume)
CREATE TABLE likes (
    media_id TIMEUUID,
    liker_id BIGINT,
    created_at TIMESTAMP,
    PRIMARY KEY (media_id, liker_id)
);

-- Comments (Cassandra)
CREATE TABLE comments (
    media_id TIMEUUID,
    comment_id UUID,
    commenter_id BIGINT,
    text TEXT,
    created_at TIMESTAMP,
    PRIMARY KEY (media_id, created_at, comment_id)
);

-- Stories (24h TTL)
CREATE TABLE stories (
    user_id BIGINT,
    story_id UUID,
    media_urls MAP<TEXT, TEXT>,
    expires_at TIMESTAMP,
    created_at TIMESTAMP,
    PRIMARY KEY (user_id, expires_at, story_id)
);
-- Cassandra TTL(expires_at) auto-deletes
```

## Caching Strategy

| Cache | What | TTL |
|-------|------|-----|
| Redis | Timeline (sorted sets) | 30min |
| Redis | User profile | 1hr |
| Redis | Media metadata | 5min |
| CDN | Media files | 30 days (long cache) |
| CDN | Pre-signed URLs | 60s |

**Note**: Media CDN caching is critical - 90% of feed bytes are images.

## Analytics & Scaling

### Sharding
- Shard by `user_id` for media/follows
- Shard by `media_id` for likes/comments
- `storage:writing content`

### Hot Users Problem
- Celebrity posting → thundering herd on followers' timelines
- Solution: cap fanout (only push top-N), else pull merge

## Search (Optional)

```
Metadata → Kafka → Elasticsearch index (users, tags, locations, captions)
Query → ES → Return user IDs → Join with media → Serve
```

## Interview Talking Points

1. **Why direct-to-S3 upload?** Removes bottleneck, scale-out
2. **Why Cassandra?** Write-heavy with time-ordered data
3. **Hybrid fanout**: push + pull, celebrity lists
4. **CDN-first**: static + media delivery
5. **Stories TTL**: automatic cleanup, no cron jobs
6. **Content moderation**: pipeline before publish

## Resources

- [Instagram Engineering](https://engineering.instagram.com/)
- [A Brief History of Scaling @lfeng (Instagram)](https://instagram-engineering.com/a-brief-history-of-scaling-instagram-3dd604e2a75b)
- [Designing Instagram - Educative](https://www.educative.io/courses/system-design-interview)
- [How Instagram Feeds Work](https://help.instagram.com/198700464370908)