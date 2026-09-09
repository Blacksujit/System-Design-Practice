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

## Resources

- [System Design Interview - Alex Xu](https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF)
- [Pramp Free Mock Interviews](https://www.pramp.com/)
- [Interviewing.io](https://interviewing.io/)
- [ByteByteGo Interview Prep](https://bytebytego.com/)