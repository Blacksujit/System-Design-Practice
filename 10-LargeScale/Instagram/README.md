# Instagram/Photo Sharing - System Design

## Requirements

### Functional Requirements
- Upload photos/videos
- View feed (chronological or algorithmic)
- Follow users
- Like, comment on posts
- Stories feature
- Search users and hashtags

### Non-Functional Requirements
- High availability
- Low latency feed generation
- Scalability (1B+ users)
- Media storage efficiency

## Capacity Estimation

- **Users**: 1B monthly active
- **Daily uploads**: 100M photos
- **Storage**: 100M * 2MB = 200TB/day
- **Feed reads**: 500K QPS

## High-Level Design

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Client      │────▶│  API Gateway    │────▶│  Load Balancer  │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                    ┌────────────────────────────────────┬┴───────────────────┐
                    │                                    │                    │
             ┌──────▼──────┐                    ┌───────▼───────┐    ┌───────▼──────┐
             │ Upload Service│                   │  Feed Service │    │Search Service│
             └──────┬──────┘                    └───────┬───────┘    └──────┬───────┘
                    │                                    │                    │
             ┌──────▼──────┐                    ┌───────▼───────┐    ┌───────▼──────┐
             │     S3      │                    │    Redis      │    │ Elasticsearch│
             └─────────────┘                    └───────────────┘    └──────────────┘
```

## Media Upload Pipeline

```
1. Client requests pre-signed S3 URL
2. Upload directly to S3
3. Trigger Lambda for processing:
   a. Generate thumbnails (multiple sizes)
   b. Extract EXIF data
   c. Content moderation
   d. Update search index
4. Store metadata in database
5. Notify followers
```

## Image Storage Architecture

```
Original Image → S3 (Standard)
                     │
        ┌────────────┼────────────┐
        │            │            │
   ┌────▼────┐  ┌────▼────┐  ┌────▼────┐
   │Thumbnail│  │  Medium │  │  Large  │
   │ 150x150 │  │ 640x640 │  │1080x1080│
   └─────────┘  └─────────┘  └─────────┘
```

## Feed Generation

### Algorithmic Feed
- Based on user interactions
- Machine learning model
- Considers: recency, engagement, relationship

### Chronological Feed
- Simple timestamp ordering
- No computation needed
- Option for users to switch

## Database Schema

```sql
-- Posts Table (Cassandra)
CREATE TABLE posts (
    user_id BIGINT,
    post_id TIMEUUID,
    media_urls LIST<TEXT>,
    caption TEXT,
    location MAP<TEXT, TEXT>,
    created_at TIMESTAMP,
    like_count COUNTER,
    comment_count COUNTER,
    PRIMARY KEY (user_id, created_at, post_id)
) WITH CLUSTERING ORDER BY (created_at DESC);

-- User Follows
CREATE TABLE user_follows (
    user_id BIGINT,
    followee_id BIGINT,
    created_at TIMESTAMP,
    PRIMARY KEY (user_id, followee_id)
);

-- Comments Table
CREATE TABLE comments (
    post_id TIMEUUID,
    comment_id TIMEUUID,
    user_id BIGINT,
    content TEXT,
    created_at TIMESTAMP,
    PRIMARY KEY (post_id, created_at, comment_id)
) WITH CLUSTERING ORDER BY (created_at DESC);
```

## CDN Strategy

- Use CloudFront for media delivery
- Edge caching for popular content
- Regional distribution
- Token-based authentication for private content

## Resources

- [Instagram Architecture](https://www.instagram.com engineering/)
- [How Instagram Scales](https://medium.com/@buckhx/unwiedling-instagram-s-e4773fd31d2d)
- [System Design Interview - Alex Xu](https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF)
