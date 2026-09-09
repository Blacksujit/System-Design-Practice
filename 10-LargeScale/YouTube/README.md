# YouTube / Video Streaming - System Design

## Requirements

### Functional Requirements
- Upload videos (intros, resolutions, various sizes)
- Stream videos (adaptive bitrate)
- Search, comments, likes
- Recommendations
- Channel subscriptions
- Live streaming (optional)

### Non-Functional Requirements
- Video delivery latency < 200ms (buffer start)
- Availability > 99.9%
- Scale: 1B+ users, 500hrs video uploaded every minute
- Bandwidth: massive - 1 video = many GB

## Capacity Estimation

- **DAU**: 1B (2B+ total)
- **Uploads**: 500 hours per minute uploaded
- **Storage**: 500hr/min * 60min * 24hr = 720K hours/day
- **Video size**: 1hr at 720p ≈ 500MB
- **New storage/day**: 720K * 500MB = 360TB/day
- **Data transfer**: 1B users * 20 videos/day * 25MB(5min) ≈ 500PB/day worst case

## High-Level Design

```
                          ┌───────────────────────────────┐
                          │          Video Frontend        │
                          │  Upload API  +  Streaming CDN  │
                          └───────┬───────────────┬────────┘
                                  │               │
                    ┌─────────────▼──┐   ┌────────▼─────────┐
                    │  Upload Service│   │  Stream/CDN       │
                    │  (S3 ingestion)│   │  (CloudFront)     │
                    └───────┬────────┘   └────────┬─────────┘
                            │                     │
              ┌─────────────▼─────────────────────▼──────────┐
              │             Object Storage (S3)                │
              └─────────────┬─────────────────────┬───────────┘
                            │                     │
              ┌─────────────▼────┐   ┌────────────▼───────────┐
              │ Transcode Pipeline│   │  Metadata DB           │
              │ (Lambda workers)  │   │  (Cassandra/Postgres)  │
              └─────────────┬────┘   └────────────┬───────────┘
                            │                     │
                     ┌──────▼──────┐       ┌──────▼──────┐
                     │  CDN cache  │       │  Search +   │
                     │  (edge)     │       │  Rec Service│
                     └─────────────┘       └─────────────┘
```

## Upload Pipeline

```
1. Client requests upload URL (pre-signed S3)
2. Client uploads original .mp4 → S3 raw bucket
3. S3 event → trigger video processing (Lambda/K8s)

4. Processing stages:
   a. Validation (metadata, virus scan, copyright check)
   b. Transcode to multiple qualities:
      360p / 480p / 720p / 1080p / 4K (HLS/DASH manifests)
   c. Generate thumbnails (3-4 thumbnails, at t=1s, 10s, 30s)
   d. Audio extraction (separate audio track)
   e. On-demand: ML content tag / auto-caption

   Output:
     HLS manifest (.m3u8) → lists .ts segments
     DASH (.mpd) → .mp4 segments
     All segments stored in formatted buckets
5. Update metadata DB (title, duration, dimensions, status)
6. Data available for streaming when 720p at least is ready
```

### Transcoding Systems

| System | Approach | Pros | Cons |
|--------|----------|------|------|
| Lambda | Serverless per job | scale on demand | cold starts, fragile long jobs |
| Batch (Elastic) | Server fleet | robust, K8s | cost, capacity planning |
| Spot instances | Cheap compute | low cost | preemption risk |

**Best practice**: Queue-based processing (SQS) + worker pool.

## Adaptive Bitrate Streaming (HLS)

```
Manifest (.m3u8)
  ├── video_360p/segment_00001.ts
  ├── video_360p/segment_00002.ts
  ├── video_720p/segment_00001.ts
  └── video_1080p/segment_00001.ts
```

**Client behavior**:
1. Client fetches master playlist
2. Estimates available bandwidth
3. Selects appropriate quality
4. Buffers ~30-60 seconds
5. Switches quality based on buffer/bandwidth

**Why segment-based?** This is how Netflix/YouTube avoid down/up loading whole video. Users can jump to ranges; recovery from network blips is graceful.

## Streaming (CDN)

```
Video segments stored across:
  - Hot videos (top 1%): CDN edge cache
  - Popular: region caches
  - Long tail: origin S3 → CDN on demand

CDN caching policy:
  - Cache-Control: public, max-age=60s (manifest)
  - Segments: immutable (versioned), cache long
  - Purge on delete/deny
```

## Database Schema

```sql
-- Video Metadata (PostgreSQL/Cassandra)
CREATE TABLE videos (
    video_id UUID PRIMARY KEY,
    channel_id BIGINT,
    title VARCHAR(255),
    description TEXT,
    duration INT,           -- seconds
    s3_bucket TEXT,
    manifest_path TEXT,     -- main HLS playlist
    thumbnails JSONB,
    dimensions INT,          -- height px
    status VARCHAR(20),      -- uploading, processing, ready, failed
    view_count BIGINT DEFAULT 0,
    like_count BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ
);

-- Channel
CREATE TABLE channels (
    channel_id BIGINT PRIMARY KEY,
    owner_user_id BIGINT,
    name VARCHAR(255),
    subscriber_count BIGINT,
    created_at TIMESTAMPTZ
);

-- View events (write-heavy)
CREATE TABLE view_events (
    video_id UUID,
    user_id BIGINT,
    duration_watched INT,
    played_at TIMESTAMPTZ,
    -- partitioned by date
    PRIMARY KEY (video_id, played_at)
);

-- Comments (embedded or separate service)
CREATE TABLE comments (
    video_id UUID,
    comment_id UUID,
    user_id BIGINT,
    text TEXT,
    created_at TIMESTAMPTZ,
    PRIMARY KEY (video_id, created_at, comment_id)
);
```

## View Counting

```
Increment → Redis counter (per video)
Periodic flush → DB
Real-time gauge: Redis counter gets
Cross-check/filter: dedupe by user, event log
```

## Search & Recommendations

Search:
```
Video title/description/channel → Kafka → Elasticsearch index
Query → ES → Return video IDs → Join metadata → Serve
```

Recommendations:
```
View history → Kafka stream → ML service
Collaborative filtering / content similarity
Candidates → Candidate pool (Redis) → Rank → Top N
```

## Live Streaming (Optional)

```
Streamer → Ingest (RTMP) → Transcoder (low latency) → CDN → Viewers (HLS/LL-HLS)

Ingest: dedicated server per streamer, bitrate capped
Transcoding: real-time per-segment
Latency targets: Live < 1s (WebRTC), Standard < 20s (HLS)
```
Note: This is why Twitch has a "channel ingest server" — per-streamer routes.

## Failure Handling

| Failure | Mitigation |
|---------|-----------|
| Transcode fails | Retry 3x → Notify uploader, keep raw in S3 |
| CDN down on one region | DNS failover to fallback CDN edge |
| Storage bucket corrupt | Versioned S3 uploads, checksums, replicate across AZ |
| DB spike on new upload | Geotargeted DB read replicas + queues |

## Interview Talking Points

1. **Pre-signed S3 upload**: no bottleneck at upload time
2. **Async transcoding**: queue-driven pipeline, notify when ready
3. **HLS/DASH segmentation**: adaptive quality over unpredictable networks
4. **CDN-first**: edge caching, near-zero bandwidth to origin for popular content
5. **Write-heavy counting**: Redis counters → flush to DB
6. **Long-tail cost**: origin on-demand + warm popular buckets

## Resources

- [YouTube Engineering Blog](https://blog.youtube/inside-youtube/)
- [Netflix's Video Encoding and Delivery](https://netflixtechblog.com/)
- [Awesome HLS](https://github.com/videojs/http-streaming)
- [HTTP Live Streaming Spec (RFC 8216)](https://datatracker.ietf.org/doc/html/rfc8216)
- [Designing YouTube - Grokking](https://www.educative.io/courses/grokking-the-system-design-interview)