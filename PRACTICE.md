# Practice Problems (Interview Prep)

## Beginner Practice (Weeks 1-8)

### Problem 1: Design a URL Shortener
**Key Concepts**: Hashing, storage, caching, redirects, Base62

**Requirements**:
- Shorten long URLs
- Handle 100M URLs/day
- Click analytics
- Custom aliases

**Iterate On**:
- [ ] Requirements clarification
- [ ] Traffic estimation
- [ ] High-level diagram
- [ ] Database schema
- [ ] Cache strategy
- [ ] Scaling plan

### Problem 2: Design a Rate Limiter
**Key Concepts**: Algorithms (token bucket, sliding window), Redis, distributed systems

**Requirements**:
- Limit requests per IP/user
- Handle distributed servers
- Different limits per API
- Graceful 429 responses

### Problem 3: Design a Load Balancer
**Key Concepts**: L4 vs L7, health checks, session affinity

**Requirements**:
- Distribute traffic
- Handle server failures
- Support HTTP + HTTPS
- Stickiness for sessions

### Problem 4: Design a Distributed Cache
**Key Concepts**: Consistent hashing, LRU/LFU, TTL, replication

**Requirements**:
- High throughput reads
- Cache invalidation
- Node add/remove
- Handle cache stampede

## Intermediate Practice (Weeks 9-16)

### Problem 5: Design a Chat Messaging App (WhatsApp/Slack)
**Key Concepts**: WebSockets, presence, message ordering, offline support

**Requirements**:
- One-on-one and group chat
- Message delivery (real-time)
- Read receipts
- Media sharing
- Offline message queue

**Extend With**:
- Group chat (50 vs 1000 members)
- Video/audio calls
- Message encryption

### Problem 6: Design a News Feed (Twitter/Facebook)
**Key Concepts**: Fan-out, timelines, social graph, caching

**Requirements**:
- Post content (text, images, video)
- Follow/unfollow
- Personalized timeline
- Like/comment/share
- Trending topics

**Extend With**:
- Ad insertion
- User engagement algorithms
- Search within feed

### Problem 7: Design a Video Platform (YouTube)
**Key Concepts**: Media pipeline, transcoding, CDN, adaptive bitrate

**Requirements**:
- Video upload
- Video streaming
- Recommended videos
- Search
- Comments/likes

**Extend With**:
- Live streaming
- Video editing in browser
- Monetization

### Problem 8: Design Instagram (Photo Sharing)
**Key Concepts**: Image storage, CDN, feed, caching

**Requirements**:
- Upload photos
- Filters
- Feed with images
- Follow system
- Likes/comments

**Extend With**:
- Stories (24hr)
- Reels (short video)
- Direct messages

## Advanced Practice (Weeks 17-24)

### Problem 9: Design Google Docs
**Key Concepts**: OT, CRDTs, WebSockets, version control

**Requirements**:
- Multiple concurrent editors
- Real-time
- Offline support
- Version history
- Comments

### Problem 10: Design Uber/Lyft
**Key Concepts**: Geospatial, matching, real-time, load balancing

**Requirements**:
- Driver/rider locations
- Ride matching
- Fare calculation
- Navigation routing
- Surge pricing

**Trade-offs To Discuss**:
- Real-time location updates (frequency?)
- Driver allocation (greedy vs global optimization?)
- Consistency of ride status

### Problem 11: Design Google Maps
**Key Concepts**: Geospatial indexing, tiling, routing algorithms

**Requirements**:
- Map rendering (tiles)
- Location search
- Directions + navigation
- Traffic + live data

### Problem 12: Design E-commerce (Amazon)
**Key Concepts**: Transactions, inventory, payments, idempotency

**Requirements**:
- Product catalog
- Shopping cart
- Order placement
- Payments
- Order tracking
- Recommendations

**Key Concerns**: Distributed transactions, inventory consistency, payment idempotency

### Problem 13: Design a Web Crawler (Google)
**Key Concepts**: URL frontier, politeness, deduplication, distributed processing

**Requirements**:
- Crawl entire web
- Respect robots.txt
- Handle dynamic content
- Deduplicate
- Prioritize URLs

### Problem 14: Design a Notification System
**Key Concepts**: Push/pull, multi-channel, queues

**Requirements**:
- Multiple channels: push, SMS, email
- User preferences
- Delivery retries
- Zero message loss

### Problem 15: Design a Search Engine (Google)
**Key Concepts**: Indexing, query processing, ranking

**Requirements**:
- Crawl web
- Index documents
- Search queries
- Ranking
- Autocomplete

### Problem 16: Design a Distributed Lock
**Key Concepts**: Redlock, Zookeeper, consensus

**Requirements**:
- Acquire/release locks
- Lock expiration
- Fault tolerance
- Deadlock prevention

## Cheat Sheet: Quick Design Templates

### Read-Heavy System (Twitter, Instagram)
```
Client → CDN → LB → App Servers → Cache → DB (Read Replicas)
                                     ↑
                               Write Master → Async Jobs → Analytics
```

### Write-Heavy System (Logging, Analytics)
```
Clients → Ingestion API → Kafka → Stream Processor → Storage
                                  ↓
                            Consumers (multiple)
```

### Real-time System (Chat, Notifications)
```
Client (WebSocket) ↔ WS Server ↔ Message Brokers
                              ↓
                          Persistence (offline)
                          Pub/Sub (presence)
```

### Media System (YouTube, Netflix)
```
Upload → Storage → Transcoding Pipeline → CDN
                          ↓
                    Adaptive Streaming
```

## Practice Routine

### Weekly Practice (1 hour)
- [ ] 15 min: Requirements + estimation
- [ ] 25 min: Full high-level design (talking out loud)
- [ ] 10 min: Identify 2 bottlenecks, propose fixes
- [ ] 10 min: Self-review against checklist

### Bi-Weekly Mock (2 hours)
- [ ] Full 45-min mock interview
- [ ] Feedback review
- [ ] Update notes with mistakes
- [ ] Retry weak problem after 1 week

## Resources

- [Pramp - Free mock interviews](https://www.pramp.com/)
- [LeetCode System Design](https://leetcode.com/discuss/interview-question/system-design)
- [Grokking System Design](https://www.educative.io/courses/grokking-the-system-design-interview)
- [Gaurav Sen's System Design Series](https://www.youtube.com/@gkcs)