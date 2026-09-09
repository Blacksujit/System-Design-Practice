# Web Crawler - System Design

## Requirements

### Functional Requirements
- Crawl billions of web pages
- Extract links and content
- Respect robots.txt
- Handle duplicate URLs
- Politeness (rate limiting)

### Non-Functional Requirements
- Scalability (billions of pages)
- Fault tolerance
- Distributed crawling
- Content freshness

## Capacity Estimation

- **Pages to crawl**: 1 billion pages
- **Page size**: 500KB average
- **Total storage**: 500TB
- **Crawl rate**: 1000 pages/second = 86M pages/day

## High-Level Design

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Seed URLs     │────▶│  URL Frontier   │────▶│  Crawler Worker │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                    ┌────────────────────────────────────┬┴───────────────────┐
                    │                                    │                    │
             ┌──────▼──────┐                    ┌───────▼───────┐    ┌───────▼──────┐
             │   Content   │                    │    DNS        │    │   Robots.txt │
             │   Parser    │                    │   Resolver    │    │   Checker    │
             └──────┬──────┘                    └───────────────┘    └──────────────┘
                    │
             ┌──────▼──────┐
             │  Document   │
             │   Storage   │
             └─────────────┘
```

## URL Frontier

Priority queue of URLs to crawl.

### Components
1. **Priority Controller**: Rank URLs by importance
2. **DNS Resolver**: Cache DNS lookups
3. **Robots.txt Parser**: Respect crawl rules
4. **Politeness Controller**: Rate limit per domain

### Priority Rules
- Homepage before subpages
- Fresh content over stale
- Important domains first
- Recently updated pages

## Crawl Flow

```
1. Pop URL from frontier
2. Check robots.txt cache
3. If allowed, resolve DNS
4. Fetch page content
5. Parse HTML, extract:
   - Links
   - Content
   - Metadata
6. Store content
7. Add new URLs to frontier
8. Mark URL as visited
```

## Politeness

### Rate Limiting
- Max requests per domain per second
- Random delay between requests
- Respect crawl-delay directive

### Implementation
```python
class PolitenessController:
    def __init__(self):
        self.domain_last_access = {}
        self.min_delay = 1  # seconds
    
    def can_fetch(self, domain):
        last = self.domain_last_access.get(domain, 0)
        if time.time() - last >= self.min_delay:
            return True
        return False
    
    def mark_accessed(self, domain):
        self.domain_last_access[domain] = time.time()
```

## Duplicate Detection

### URL Deduplication
- Bloom filter for URL seen set
- Low memory footprint
- False positives acceptable

### Content Deduplication
- SimHash for near-duplicate detection
- Store content fingerprints
- Compare fingerprints before storage

## Database Schema

```sql
-- URLs Table (Cassandra)
CREATE TABLE urls (
    url_hash BIGINT PRIMARY KEY,
    url TEXT,
    domain VARCHAR(255),
    first_seen TIMESTAMP,
    last_crawled TIMESTAMP,
    crawl_count INT,
    priority INT
);

-- Pages Table
CREATE TABLE pages (
    url_hash BIGINT PRIMARY KEY,
    content TEXT,
    links LIST<TEXT>,
    metadata MAP<TEXT, TEXT>,
    crawled_at TIMESTAMP
);

-- Domain Politeness Table
CREATE TABLE domain_politeness (
    domain VARCHAR(255) PRIMARY KEY,
    robots_txt TEXT,
    crawl_delay INT,
    last_access TIMESTAMP
);
```

## Distributed Architecture

### Coordinator
- Assigns work to crawlers
- Monitors crawler health
- Handles failover

### Crawlers
- Fetch and parse pages
- Report back to coordinator
- Run in parallel

### Storage
- Store crawled content
- Index for search
- Deduplication

## Resources

- [Web Crawler Architecture](https://en.wikipedia.org/wiki/Web_crawler)
- [Nutch Crawler](https://nutch.apache.org/)
- [Scrapy Framework](https://scrapy.org/)
- [System Design Interview - Alex Xu](https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF)
