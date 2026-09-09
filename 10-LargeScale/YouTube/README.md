# YouTube/Video Streaming - System Design

## Requirements

### Functional Requirements
- Upload videos
- Watch videos
- Search videos
- Like, comment, subscribe
- Video recommendations

### Non-Functional Requirements
- High availability
- Low latency streaming
- Scalability (2B users)
- Global content delivery

## Capacity Estimation

- **Users**: 2B monthly active
- **Daily uploads**: 500 hours of video/minute = 720K hours/day
- **Daily views**: 5B views
- **Storage**: 720K hours * 1GB/hour = 720TB/day

## High-Level Design

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Client      │────▶│  API Gateway    │────▶│  Load Balancer  │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                    ┌────────────────────────────────────┬┴───────────────────┐
                    │                                    │                    │
             ┌──────▼──────┐                    ┌───────▼───────┐    ┌───────▼──────┐
             │Upload Service│                   │Stream Service │    │Search Service│
             └──────┬──────┘                    └───────┬───────┘    └──────┬───────┘
                    │                                    │                    │
             ┌──────▼──────┐                    ┌───────▼───────┐    ┌───────▼──────┐
             │     S3      │                    │     CDN       │    │ Elasticsearch│
             └─────────────┘                    └───────────────┘    └──────────────┘
```

## Video Upload Pipeline

```
1. Client requests pre-signed S3 URL
2. Upload video directly to S3
3. Trigger processing pipeline:
   a. Validate video format
   b. Generate thumbnail
   c. Extract metadata
   d. Transcode to multiple formats:
      - 240p, 360p, 480p, 720p, 1080p, 4K
   e. Generate HLS/DASH manifests
   f. Store in S3
4. Update video metadata in database
5. Notify subscribers
```

## Video Transcoding Architecture

```
Original Video → S3
        │
        ▼
┌───────────────┐
│Transcode Worker│
└───────┬───────┘
        │
   ┌────┼────┬────┬────┐
   │    │    │    │    │
   ▼    ▼    ▼    ▼    ▼
 240p 360p 480p 720p 1080p
   │    │    │    │    │
   └────┼────┴────┼────┘
        │         │
        ▼         ▼
   ┌─────────┐ ┌─────────┐
   │   S3    │ │  CDN    │
   └─────────┘ └─────────┘
```

## Adaptive Bitrate Streaming (ABR)

### HLS (HTTP Live Streaming)
- Apple standard
- Uses .m3u8 playlist
- Segment-based delivery

### DASH (Dynamic Adaptive Streaming)
- MPEG standard
- Uses .mpd manifest
- More flexible

### Client-side ABR
- Monitor bandwidth
- Switch quality dynamically
- Buffer management

## Database Schema

```sql
-- Videos Table (Cassandra)
CREATE TABLE videos (
    video_id UUID,
    user_id BIGINT,
    title TEXT,
    description TEXT,
    status VARCHAR(20), -- uploading, processing, ready, failed
    duration INT,
    thumbnail_url TEXT,
    created_at TIMESTAMP,
    view_count COUNTER,
    like_count COUNTER,
    PRIMARY KEY (user_id, created_at, video_id)
) WITH CLUSTERING ORDER BY (created_at DESC);

-- Video Formats Table
CREATE TABLE video_formats (
    video_id UUID,
    quality VARCHAR(10), -- 240p, 360p, etc.
    url TEXT,
    bitrate INT,
    PRIMARY KEY (video_id, quality)
);
```

## CDN Strategy

- Multi-CDN approach (CloudFront, Akamai, etc.)
- Regional edge caching
- Origin shielding
- Token-based authentication

## Recommendations System

```
1. Collaborative Filtering
   - Users who watched X also watched Y
   - Matrix factorization

2. Content-based Filtering
   - Video metadata similarity
   - Category, tags, description

3. Deep Learning
   - Watch history patterns
   - Engagement signals
```

## Resources

- [YouTube Architecture](https://highscalability.com/youtube-architecture/)
- [How Netflix Works](https://netflix.github.io/)
- [System Design Interview - Alex Xu](https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF)
