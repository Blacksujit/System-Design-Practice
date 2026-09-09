# Web Crawler - System Design

## Requirements

### Functional Requirements
- Crawl the entire web (billions of pages)
- Extract content (HTML → structured data)
- Handle dynamic pages (JS-rendered)
- Deduplicate identical content
- Respect `robots.txt`
- Prioritize important URLs
- Refresh content periodically

### Non-Functional Requirements
- Throughput: 50M pages/day minimum
- Politeness (1 request every 10-20s per host)
- Availability: 99.9%+ (crawl must be reliable)
- Scalability: add crawler nodes horizontally
- Robust to failures, retries, and network flakiness

## High-Level Design

```
┌──────────────┐
│ URL Frontier │   priorities + host queues (Redis/)
└──────┬───────┘
       │
┌──────▼───────┐
│ Crawler      │   fetch robots.txt, respect delays
│ Nodes        │
└──────┬───────┘
       │
┌──────▼───────┐
│ HTML Parser  │   extract links, text, metadata, canonical
└──────┬───────┘
       │
┌──────▼────────┐   ┌─────────────────┐
│ Link/Normalize│──▶│ URL Dedupe      │  (Bloom filter set)
└──────┬────────┘   └────────┬────────┘
       │                     │
┌──────▼────────┐   ┌────────▼─────────┐
│ Content Store │   │  URL Frontier    │  (re-enqueue new URLs)
│ (S3 / HDFS)   │   └──────────────────┘
└──────┬────────┘
       │
┌──────▼────────┐
│ Indexer       │ → Elasticsearch / search index
└───────────────┘
```

## Components in Detail

### 1. URL Frontier (Design is key)
```
Must support:
  - Prioritization: News > Snapshot ≈ Domain rank > Fresh (age)
  - Host politeness: per-host queue (limit fetch rate)
  - Avoid duplicate fetching
  - Handle redirects and URL canonicalization

Implementation:
  - Redis sorted sets: priority queues
  - Per-host quota via token buckets
  - Persistent frontier (survive restarts)
```

### 2. Fetching Node

```
Sequence per URL:
  1. Check robots.txt (cached per host, honor crawl-delay)
  2. Optional proxy pool (avoid IP bans)
  3. HTTP GET with timeouts (e.g., connect 10s, read 30s)
  4. Validate status (200ok, 301→follow redirect, 410→stop)
  5. Validate content-type (HTML, feed, image, PDF)
  6. Enforce size cap (e.g., max 2MB)
  7. Store raw + metadata (headers, timestamps, fetch result)
```

### 3. Parsing & Normalization

```
Parse:
  - Extract <link>, <a>, srcset, canonical, title, meta, og tags
  - Extract structured data (JSON-LD, microdata)
  - Text extraction (tags removed, whitespace normalized)
  - Detect language

Normalize URL:
  - Remove fragments (#), trailing slash, default ports
  - www vs non-www (choose canonical)
  - Case-normalize path, resolve relative to absolute
  - Strip tracking params (?utm_, &fbclid) unless required
```

### 4. Deduplication

```
Why: The web has massive duplication (shingles, boilerplates, CDNs, mirrors).

Approaches:
  - SimHash / MinHash for near-duplicate content
  - Content hash (SHA-256 of normalized text)
  - URL set (Bloom filter + Redis) to avoid refetching

Politeness + quality: keep one canonical, dedupe others.
```

### 5. Content Store

```
- Raw HTML + URL → object storage (S3/parquet, partitioned by crawled_date)
- Processed structs → columnar store
- Live index → Elasticsearch (title, text, URL, dates, language)
- Snapshot history for freshness/re-crawl comparisons
```

### 6. Politeness & Ethical Crawling

```
- Robots.txt: parse and honor per host
- Crawl-delay: min 1 request per N seconds per host (10-20s typical)
- Never hammer same host
- Throttle per country / IP segment to avoid bans
- Respect rate limits, optional listen to sitemaps (fast + sanctioned)
- Include Crawler identity in User-Agent
```

## Priority Handling (Popular vs Fresh)

```
Priority score = 
  0.8 * domain_rank (PageRank-like, recency-weighted)
  + 0.15 * link_popularity (incoming links)
  + 0.05 * freshness_boost (recently changed / breaking news)
```

Needs a priority queue scheduler (e.g., Kafka or Redis ZSET) with re-crawl cycles for high-value pages.

## Refresh Policy

```
- News sites: re-crawl every few minutes
- Blogs: hourly
- Static docs: daily
- Long-tail pages: weekly/monthly

Track last_crawled_at, content_hash, change detection.
```

## Scaling the Crawler

| Component | Scale method |
|-----------|--------------|
| Frontier | Shard by host-hash → distribute queues |
| Fetch nodes | Horizontal (stateless workers, pull from queue) |
| Parser | In-place on workers or separate pool |
| Dedup | Bloom filter in fast cache; periodic sync |
| Store | Object storage (S3) + partition by date |

```
Crawl rate = workers * req/min/worker
For 50M pages/day + 2-min cycle → ~35K requests/sec → ~1,400 workers.
```

## Failure Handling

| Failure | Mitigation |
|---------|-----------|
| Timeout / connection reset | Retry with exponential backoff (max 3) |
| HTTP 500/503 | Retry later (respect Retry-After header) |
| Encoding errors | Detect via charset, fallback to control stream |
| Throttled (429) | Back off per host, distribute across proxies |
| Crawler crash mid-batch | Frontier is durable; re-crawl from checkpoint |

## Interview Talking Points

1. **URL frontier is the heart**: prioritize + politeness + dedup
2. **Robots.txt first**: ethical crawl, low ban risk
3. **Bloom filter dedup**: memory-efficient, false positives acceptable
4. **Edge caching**: robots.txt cache per host
5. **Pipeline isolation**: fetch/parse/store/components scale independently
6. **Recency tracking**: change-rate adaptive re-fetch

## Resources

- [The Anatomy of a Large-Scale Hypertextual Web Search Engine (Google/Brin)](https://infolab.stanford.edu/~backrub/google.html)
- [W3C Robots.txt Spec](https://www.rfc-editor.org/rfc/rfc9309)
- [Scrapy (Python crawler framework)](https://scrapy.org/)
- [Apache Nutch (Hadoop-based crawler)](https://nutch.apache.org/)
- [Crawler design - MIT 6.824 / TJBot](https://pdos.csail.mit.edu/6.824/)