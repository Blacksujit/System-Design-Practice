# System Design Study - TODO Tracker

## Overview
- **Start Date**: September 2026
- **Target Completion**: February 2027 (24 weeks)
- **Weekly Hours**: 10-15 hours recommended

---

## Phase 1: Fundamentals (Weeks 1-4)

### Week 1: System Design Basics
- [ ] Read: What is System Design?
- [ ] Read: Key Components of Distributed Systems
- [ ] Read: Scalability, Reliability, Availability, Maintainability
- [ ] Practice: Explain these concepts to someone else
- [ ] Notes: Create summary document
- [ ] Resources:
  - [ ] [System Design Primer (GitHub)](https://github.com/donnemartin/system-design-primer)
  - [ ] [ByteByteGo - System Design Fundamentals](https://bytebytego.com/courses/system-design-interview)
  - [ ] [MIT 6.824: Distributed Systems](https://pdos.csail.mit.edu/6.824/)

### Week 2: Networking & Protocols
- [ ] Read: OSI Model and TCP/IP
- [ ] Read: HTTP/HTTPS, WebSocket, gRPC
- [ ] Read: DNS, CDNs
- [ ] Practice: Diagram a typical web request flow
- [ ] Notes: Create networking cheat sheet
- [ ] Resources:
  - [ ] [Computer Networking: A Top-Down Approach](https://gaia.cs.umass.edu/kurose_ross/online_lectures.htm)
  - [ ] [Cloudflare Learning Center](https://www.cloudflare.com/learning/)
  - [ ] [MDN Web Docs - HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP)

### Week 3: Databases & Storage
- [ ] Read: SQL vs NoSQL
- [ ] Read: ACID Properties
- [ ] Read: Sharding, Replication, Partitioning
- [ ] Practice: Design schema for a simple app
- [ ] Notes: Database comparison chart
- [ ] Resources:
  - [ ] [Database Internals by Alex Petrov](https://www.oreilly.com/library/view/database-internals/9781492040347/)
  - [ ] [The PostgreSQL Documentation](https://www.postgresql.org/docs/)
  - [ ] [MongoDB University](https://university.mongodb.com/)

### Week 4: Caching Strategies
- [ ] Read: Cache-Aside, Write-Through, Write-Behind
- [ ] Read: Redis vs Memcached
- [ ] Read: Cache Invalidation Strategies
- [ ] Practice: Implement simple caching layer
- [ ] Notes: Caching patterns comparison
- [ ] Resources:
  - [ ] [Redis Documentation](https://redis.io/docs/)
  - [ ] [Caching Patterns - Martin Fowler](https://martinfowler.com/)
  - [ ] [High Performance Browser Networking](https://hpbnwhttp://smouset.com/)

---

## Phase 2: Core Concepts (Weeks 5-8)

### Week 5: Load Balancing & Proxies
- [ ] Read: Load Balancing Algorithms
- [ ] Read: L4 vs L7 Load Balancing
- [ ] Read: Reverse Proxy vs Forward Proxy
- [ ] Practice: Design load balancing for a web app
- [ ] Notes: Load balancer comparison
- [ ] Resources:
  - [ ] [Nginx Documentation](https://nginx.org/en/docs/)
  - [ ] [HAProxy Documentation](https://docs.haproxy.org/)
  - [ ] [AWS ELB Documentation](https://docs.aws.amazon.com/elasticloadbalancing/)

### Week 6: Message Queues & Streaming
- [ ] Read: Kafka vs RabbitMQ vs SQS
- [ ] Read: Pub/Sub vs Point-to-Point
- [ ] Read: Event Sourcing & CQRS
- [ ] Practice: Design notification system with queues
- [ ] Notes: Queue comparison chart
- [ ] Resources:
  - [ ] [Apache Kafka Documentation](https://kafka.apache.org/documentation/)
  - [ ] [RabbitMQ Tutorials](https://www.rabbitmq.com/getstarted.html)
  - [ ] [Designing Event-Driven Systems](https://www.confluent.io/designing-event-driven-systems/)

### Week 7: Consistent Hashing & Partitioning
- [ ] Read: Consistent Hashing Algorithm
- [ ] Read: Virtual Nodes
- [ ] Read: Range-based vs Hash-based Partitioning
- [ ] Practice: Implement consistent hashing
- [ ] Notes: Partitioning strategies
- [ ] Resources:
  - [ ] [Consistent Hashing - Wikipedia](https://en.wikipedia.org/wiki/Consistent_hashing)
  - [ ] [Dynamo Paper (Amazon)](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)
  - [ ] [MIT 6.824 Labs](https://pdos.csail.mit.edu/6.824/labs/)

### Week 8: CAP Theorem & Consistency
- [ ] Read: CAP Theorem Explained
- [ ] Read: Consistency Models
- [ ] Read: Consensus Algorithms (Raft, Paxos)
- [ ] Practice: Explain CAP with real examples
- [ ] Notes: Consistency models cheat sheet
- [ ] Resources:
  - [ ] [CAP Theorem - Brewer's Keynote](https://users.ece.cmu.edu/~adrian/731-sp04/readings/GL-cap.pdf)
  - [ ] [Raft Paper](https://raft.github.io/raft.pdf)
  - [ ] [Jepsen Consistency Tests](https://jepsen.io/)

---

## Phase 3: Design Patterns (Weeks 9-12)

### Week 9: URL Shortener
- [ ] Read: Requirements Gathering
- [ ] Read: High-Level Design
- [ ] Read: Database Schema Design
- [ ] Read: Algorithm for Short URL Generation
- [ ] Practice: Design complete system
- [ ] Implement: Basic URL shortener
- [ ] Notes: Design document template
- [ ] Resources:
  - [ ] [System Design Interview - Alex Xu](https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF)
  - [ ] [Grokking the System Design Interview](https://www.educative.io/courses/grokking-the-system-design-interview)

### Week 10: Rate Limiter
- [ ] Read: Token Bucket, Leaky Bucket, Sliding Window
- [ ] Read: Distributed Rate Limiting
- [ ] Practice: Implement token bucket algorithm
- [ ] Notes: Rate limiting algorithms
- [ ] Resources:
  - [ ] [Cloudflare Rate Limiting](https://www.cloudflare.com/rate-limiting/)
  - [ ] [Stripe Rate Limiting](https://stripe.com/docs/rate-limits)

### Week 11: Notification System
- [ ] Read: Push vs Pull Notifications
- [ ] Read: Multi-channel Delivery
- [ ] Read: Priority Queues
- [ ] Practice: Design notification system
- [ ] Notes: Notification patterns
- [ ] Resources:
  - [ ] [OneSignal Documentation](https://documentation.onesignal.com/)
  - [ ] [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)

### Week 12: Chat System
- [ ] Read: WebSocket Connections
- [ ] Read: Message Storage & Delivery
- [ ] Read: Online/Offline Status
- [ ] Practice: Design chat system
- [ ] Notes: Chat architecture patterns
- [ ] Resources:
  - [ ] [Socket.io Documentation](https://socket.io/docs/)
  - [ ] [PubNub Chat Architecture](https://www.pubnub.com/)

---

## Phase 4: Large-Scale Systems (Weeks 13-16)

### Week 13: URL Shortener Deep Dive
- [ ] Read: Scaling Considerations
- [ ] Read: Analytics & Metrics
- [ ] Read: API Design
- [ ] Practice: Complete design document
- [ ] Notes: Scalability patterns

### Week 14: Twitter/News Feed
- [ ] Read: Fanout-on-Read vs Fanout-on-Write
- [ ] Read: Timeline Generation
- [ ] Read: Social Graph Storage
- [ ] Practice: Design news feed system
- [ ] Notes: Feed generation strategies

### Week 15: Instagram/Photo Sharing
- [ ] Read: Image Storage & CDN
- [ ] Read: Feed Generation
- [ ] Read: Search & Discovery
- [ ] Practice: Design photo sharing app
- [ ] Notes: Media storage patterns

### Week 16: YouTube/Video Streaming
- [ ] Read: Video Upload Pipeline
- [ ] Read: Video Transcoding
- [ ] Read: Adaptive Bitrate Streaming
- [ ] Practice: Design video platform
- [ ] Notes: Video processing pipeline

---

## Phase 5: Advanced Topics (Weeks 17-20)

### Week 17: Design Twitter Clone
- [ ] Read: Full System Design
- [ ] Read: Trending Topics
- [ ] Read: Search Implementation
- [ ] Practice: Complete Twitter clone design
- [ ] Notes: Microservices architecture

### Week 18: Google Docs/Real-time Collaboration
- [ ] Read: Operational Transformation
- [ ] Read: CRDTs
- [ ] Read: Real-time Sync
- [ ] Practice: Design collaborative editor
- [ ] Notes: Conflict resolution patterns

### Week 19: Google Maps/Location Service
- [ ] Read: Geospatial Data Storage
- [ ] Read: Route Finding Algorithms
- [ ] Read: Tile Mapping
- [ ] Practice: Design location service
- [ ] Notes: Geospatial patterns

### Week 20: Web Crawler
- [ ] Read: Crawler Architecture
- [ ] Read: Politeness & Rate Limiting
- [ ] Read: URL Frontier
- [ ] Practice: Design web crawler
- [ ] Notes: Crawler patterns

---

## Phase 6: Interview Prep (Weeks 21-24)

### Week 21: Mock Interview Framework
- [ ] Read: Interview Structure (4-step process)
- [ ] Practice: Timed mock interviews
- [ ] Notes: Interview checklist
- [ ] Resources:
  - [ ] [Interviewing.io](https://interviewing.io/)
  - [ ] [Pramp - Mock Interviews](https://www.pramp.com/)

### Week 22: Common Mistakes & Solutions
- [ ] Read: Top 10 Mistakes
- [ ] Practice: Avoid common pitfalls
- [ ] Notes: Mistake checklist

### Week 23: Communication Techniques
- [ ] Read: Structured Communication
- [ ] Read: Clarifying Questions
- [ ] Read: Trade-off Analysis
- [ ] Practice: Explain designs clearly
- [ ] Notes: Communication templates

### Week 24: Final Review & Mock Interviews
- [ ] Review all notes
- [ ] Complete 2-3 mock interviews
- [ ] Identify weak areas
- [ ] Create final cheat sheet

---

## Progress Tracking

### Completed
- [ ] Phase 1: Fundamentals
- [ ] Phase 2: Core Concepts
- [ ] Phase 3: Design Patterns
- [ ] Phase 4: Large-Scale Systems
- [ ] Phase 5: Advanced Topics
- [ ] Phase 6: Interview Prep

### Notes
- Add your progress notes here
- Update weekly as you complete topics
