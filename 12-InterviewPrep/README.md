# System Design Interview Playbook

## The 4-Step Framework

Every system design interview should follow this structure:

### Step 1: Requirements (5 min)
- ✅ Ask clarifying questions
- ✅ Identify functional requirements
- ✅ Identify non-functional requirements
- ✅ Agree on scope
- ⚠️ DON'T jump to solution

### Step 2: Estimation (5 min)
- ✅ Calculate QPS, storage, bandwidth
- ✅ State assumptions clearly
- ✅ Use round numbers ($2^10 = 1K, 2^20 = 1M...)
- ⚠️ Don't over-optimize accuracy

### Step 3: High-Level Design (15 min)
- ✅ Draw main components
- ✅ Explain data flow
- ✅ Identify bottlenecks
- ✅ Discuss trade-offs
- ⚠️ Keep it simple initially

### Step 4: Deep Dive (15 min)
- ✅ Pick 1-2 areas the interviewer highlights
- ✅ Detail the chosen area
- ✅ Discuss scaling
- ✅ Mention failure modes
- ⚠️ Don't detail everything

## Communication Framework for Each Component

For every component you introduce, cover:
1. **What**: What it does
2. **Why**: Why you chose it
3. **Trade-offs**: What you gave up
4. **Alternatives**: What else you considered

## Interview Checklist

### Before the Design
- [ ] Clarify user count (1M vs 100M changes everything)
- [ ] Clarify read/write ratio
- [ ] Clarify consistency requirements
- [ ] Ask about data size
- [ ] Ask if latency matters

### During the Design
- [ ] Draw a clear diagram
- [ ] Label every component
- [ ] Show data flow arrows
- [ ] Mention the DB schema
- [ ] Identify the bottleneck
- [ ] Discuss the cache strategy

### What Interviewers Look For
1. **Structure**: Organized thinking, no random jumping
2. **Communication**: Clear explanations of concepts
3. **Trade-offs**: Ability to compare options
4. **Depth when needed**: Know when to go deep
5. **Breadth**: Know multiple solutions/patterns

## Top Interview Mistakes

### 1. Not Clarifying Requirements
❌ "Let me design Twitter" → jumps to feed
✅ "Who are the users? How many? What scale? Mobile or web?"

### 2. Not Estimating
❌ No numbers at all
✅ "100M DAU, 10% post daily = 10M posts/day → 115 QPS"

### 3. Overshadowing Details
❌ Perfecting edge cases instead of finishing the design
✅ Complete the design first, improve later

### 4. Ignoring Trade-offs
❌ "Use Kafka everywhere"
✅ "Kafka for async processing, but NO for request-response via SQS"

### 5. Not Mentioning Bottlenecks
❌ Design works for 1 user
✅ "The DB write is our bottleneck; here's how we shard"

### 6. Forgetting Failure Modes
❌ Single point of failure everywhere
✅ "If Redis fails, we fall back to DB with degraded response"

## Approaching Design Questions

### Pattern: "Design X for Y Users"
Common systems interviewers ask:
- Twitter, Facebook, Instagram → **Read-heavy feed systems**
- WhatsApp, Slack → **Real-time messaging**
- YouTube, Netflix → **Video streaming**
- Google Docs → **Collaboration + OT/CRDT**
- Uber, Lyft → **Location + matching**
- Amazon, eBay → **E-commerce + payments**
- Google Search → **Search + web crawler**

### Prioritization for Each Problem
1. **Data flow**: What is core? What's optional?
2. **Read-heavy**: Cache, CDN, read replicas
3. **Write-heavy**: Queues, async processing, sharding
4. **Real-time**: WebSockets, push infrastructure
5. **Consistency**: When can we be eventual?

## Estimation Cheat Sheet

```
1M requests/day = ~12 QPS
100M requests/day = ~1,200 QPS
200M requests/day = ~2,400 QPS

Storage for 1 item:
  Tweet text: 280 bytes
  User profile: 1KB
  Photo: 500KB
  Video (1hr): 1GB

Bandwidth:
  1M photos/day * 500KB = 500GB/day ≈ 5.7MB/s

Shard sizes:
  PostgreSQL: ~1TB practical limit
  Cassandra: ~1PB+ with cluster
  Redis: ~64GB per node (RAM limit)
```

## Quick Reference: Component Selection

### Database Selection
| Use Case | Choose | Why |
|----------|--------|-----|
| Transactions | PostgreSQL | ACID, mature |
| User profiles | PostgreSQL/MongoDB | Flexible schemas |
| Feeds | Cassandra | Write-heavy, time-series |
| Cache | Redis | Speed, data structures |
| Search | Elasticsearch | Full-text, filters |
| Analytics | ClickHouse/BigQuery | OLAP, aggregations |

### When to Use Queues
- ✅ Async jobs (email, notication)
- ✅ Decoupling services
- ✅ Load leveling
- ✅ Event streaming
- ❌ Request-response (latency)
- ❌ Sequential processing (ordering)

## The "Signal Words" That Change Designs

When interviewer says | It means
---------------------|---------
"Like Twitter" | read-heavy, feed generation
"at scale" | horizontal scaling, sharding
"real-time" | WebSocket, push
"billions" | aggressive caching, tiered storage
"eventually" | eventual consistency is OK
"exactly once" | idempotency, transactions
"globally" | multi-region, edge, CDN
"hot" content | cache, CDN, priority queues

## Where to Practice (ranked by value for money)

| Platform | What you get | Cost | Best use |
|----------|-------------|------|----------|
| **[Pramp](https://www.pramp.com)** | Scheduled peer mock interviews | Free | #1 free option — book 2-3/week, alternate roles |
| **[interviewing.io](https://interviewing.io)** | Anonymous live mocks; recorded real company sessions | Freemium | Pressure reps + learn by watching recorded passes |
| **LeetCode (System Design tag)** | Text designs + community answers | Paid | See what "model" answers look like; read AFTER self-attempt |
| **[Grokking SD Interview](https://www.educative.io/courses/grokking-the-system-design-interview)** | 16 guided problems | Paid | Reference solutions after your attempt |
| **[ByteByteGo](https://bytebytego.com/)** | Diagrams, course, mock + assessment | Paid | Visual memory aids + structured mocks |
| **YouTube (Gaurav Sen / ByteByteGo / codeKarle)** | Full walkthroughs | Free | Watch AFTER attempting — never before |

**The rule that decides outcomes:** practice *producing* designs, not *recognizing* them. Every session is: pick problem → 30 min out loud → compare → fix one gap.

## Frequently Asked Questions — Bank (work top→bottom)

> Full difficulty tiers, extensions, and alternate takes are in `../PRACTICE.md`. Master the MUST set (#1-5) cold — they cover 70%+ of interview questions and every core pattern.

| # | Problem | Priority | Difficulty | Study here |
|---|---------|----------|-----------|------------|
| 1 | URL Shortener | 🔥 MUST | Easy | `../09-Projects/URL-Shortener/` |
| 2 | Rate Limiter | 🔥 MUST | Easy | `../09-Projects/Rate-Limiter/` |
| 3 | News Feed (Twitter/FB) | 🔥 MUST | Medium | `../10-LargeScale/Twitter-Feed/` |
| 4 | Chat / WhatsApp / Slack | 🔥 MUST | Medium | `../09-Projects/Chat-System/` |
| 5 | Instagram / Photo Sharing | 🔥 MUST | Medium | `../10-LargeScale/Instagram/` |
| 6 | Notification System | High | Medium | `../09-Projects/Notification-System/` |
| 7 | YouTube / Video Streaming | High | Hard | `../10-LargeScale/YouTube/` |
| 8 | Google Docs / Collab | High | Hard | `../11-Advanced/Google-Docs/` |
| 9 | Google Maps / geospatial | Med | Hard | `../11-Advanced/Google-Maps/` |
| 10 | Web Crawler | Med | Hard | `../11-Advanced/Web-Crawler/` |
| 11 | E-commerce / Amazon | High | Hard | See PRACTICE.md #12 |
| 12 | Uber / Lyft matching | Med | Hard | See PRACTICE.md #10 |
| 13 | Google Search | Med | Hard | See PRACTICE.md #15 |
| 14 | Typeahead / Autocomplete | Med | Medium | See PRACTICE.md #14 |
| 15 | Distributed Lock | Low | Hard | See PRACTICE.md #16 |
| 16 | Leaderboard | Low | Medium | See PRACTICE.md |

## Practice Routine (proven weekly loop)

**Daily (45-60 min):**
1. 15 min: Requirements + estimates drift on a 3×3 note
2. 25 min: Design one problem out loud (voice-memo it)
3. 5 min: Self-scoring on the 5 interview axes

**Weekly (2-3h):**
- 2 mocks (Pramp / interviewing.io)
- 1 problem re-done cold (no notes)
- 1 "wildcard" unseen problem
- Debrief each: write down exactly 1 fix per mock

## The 5 interview axes (score yourself 1-5 each session)

1. **Requirements** — did I clarify scope? (users, reads/writes, consistency)
2. **Estimation** — did I produce numbers? (QPS, storage, latency)
3. **Architecture** — clear diagram, labeled, simple first
4. **Trade-offs** — did I say what I gave up and alternatives?
5. **Failure handling** — did I design for outage?

## Interview-Day Checklist (rehearse the night before)

- [ ] 4-step flow timing internalized (5/5/15/15/5 min framework)
- [ ] Numbers sheet in head (recite cold)
- [ ] Cheat-sheet one-pager at hand
- [ ] 2 warm-up designs already rehearsed
- [ ] Voice-crisp: talk continuous, use "X gives A, costs B, alternative C"

## Resources

- [Master Study Plan (start here)](../MASTER-PLAN.md)
- [System Design Interview - Alex Xu](https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF)
- [Pramp Free Mock Interviews](https://www.pramp.com/)
- [Interviewing.io](https://interviewing.io/)
- [ByteByteGo Interview Prep](https://bytebytego.com/)
- [Grokking the System Design Interview](https://www.educative.io/courses/grokking-the-system-design-interview)