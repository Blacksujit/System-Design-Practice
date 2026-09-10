# 🎯 System Design Master Study Plan — START HERE

> **If you only read one file in this repo, read this one.**
> Everything else in this repo is study *material*. This file is the *strategy*: what to study, in what order, how much per day, where to practice, and how to get interview-ready.

---

## 1. The One-Number Goal

**You are interview-ready when you can, under time pressure, produce a complete high-level design for an unfamiliar system in 45 minutes — requirements → estimates → diagram → schema → scaling — while explaining every trade-off.**

That's it. 90% of candidates fail because they knew concepts but couldn't *produce a design on the spot*. This plan trains production.

---

## 2. How Much Time Per Day

| Situation | Daily time | Ready in |
|-----------|-----------|----------|
| **Full-time job hunting** (8h/day) | 5-6h focused | ~4 weeks |
| **Working + studying** (typical) | 2-3h + weekends | ~8-10 weeks |
| **Casual / no deadline** | 1h/day | ~12-16 weeks |

**Non-negotiable daily minimum**: 1 pomodoro-pair (2 × 45 min) on weekdays + 4h on weekends. Skipping days is what kills candidates.

---

## 3. The 3-Track System

Never study only concepts. Run all three tracks in parallel, every week:

```
┌─────────────────────────────────────────────────────────────────┐
│  TRACK A: LEARN      (concepts → 40% of time)                   │
│  Read repo modules in order. Write your own notes.              │
├─────────────────────────────────────────────────────────────────┤
│  TRACK B: PRACTICE   (design out loud → 45% of time)            │
│  Pick a problem, design it to a timer, ALWAYS out loud.         │
├─────────────────────────────────────────────────────────────────┤
│  TRACK C: MOCK       (realistic reps → 15% of time)             │
│  Live mock interviews with feedback. Starts Week 2, every week. │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. The 4-Phase Timeline (maps to repo structure)

### PHASE 1 — Foundations (Days 1–8)
**Learn:** every module in `01-Fundamentals` → `04-Caching`, in order.

| Day | Study (Track A) | Practice (Track B) | Mock (Track C) |
|-----|----------------|--------------------|----------------|
| 1 | Scaling, latency/throughput numbers (`01-Fundamentals/`) | Sketch a key-value store | — |
| 2 | DNS, TCP/UDP, HTTP/HTTPS, WebSocket, CDN (`02-Networking/`) | Design a static website → CDN flow | — |
| 3 | SQL vs NoSQL, ACID/BASE, indexing (`03-Databases/`) | Pick DB for a URL shortener, justify | — |
| 4 | Caching: cache-aside, TTL, invalidation (`04-Caching/`) | Draw cache layer for a read-heavy feed | — |
| 5 | **REVIEW + WRITE DOWN** all numbers from memory (estimation sheet below) | Mini-design: book catalog | — |
| 6 | **FIRST FULL DESIGN**: Design URL Shortener (`09-Projects/URL-Shortener/`) — READ it, then re-produce from memory out loud | Same problem, timer 45 min | — |
| 7 | Fix gaps from Day 6. Read `01-Fundamentals/` once more | Re-do design with improvements | — |
| 8 | Assessment quiz (write on paper, no looking): terms, trade-offs, numbers | Re-do design cold | **[BOOK FIRST MOCK for next week]** |

**Success checkpoint:** You can design URL Shortener out loud from scratch, with numbers, in 45 min.
**Fail?** Repeat Days 6-8 before moving on. Do NOT rush foundations.

---

### PHASE 2 — Core Concepts (Days 9–16)
**Learn:** `05-LoadBalancing` → `08-CAPTheorem`.

| Day | Study | Practice |
|-----|-------|----------|
| 9 | Load balancing: L4/L7, algorithms, health checks | Add LB layer to URL Shortener |
| 10 | Message queues: Kafka topic model, patterns | Design async order processing |
| 11 | Consistent hashing + partitioning | Draw ring for 5-node cache, add node |
| 12 | CAP + PACELC, consistency models, quorum | Classify 5 real DBs (Cassandra, Mongo, Spanner, Dynamo, Postgres) |
| 13 | **FULL DESIGN #2**: Rate Limiter (`09-Projects/Rate-Limiter/`) | Timer design out loud |
| 14 | **FULL DESIGN #3**: Chat System (`09-Projects/Chat-System/`) | Read, then reproduce cold |
| 15 | Write your own cheat-sheet combining Phases 1-2 | Re-design worst one from memory |
| 16 | Assessment + **MOCK #1** (live, with feedback) | Fix mock gaps same day |

**Mock #1 inputs:** read `12-InterviewPrep/README.md` (the 4-step framework) BEFORE the mock.

---

### PHASE 3 — Large-Scale Builds (Days 17–28)
**Learn & reproduce:** every project in `10-LargeScale/`.

| Day | Problem (all → read, then reproduce cold out loud) |
|-----|------------------------------------------------------|
| 17 | Twitter/News Feed (`10-LargeScale/Twitter-Feed/`) |
| 18 | Twitter/News Feed — second pass with numbers |
| 19 | **MOCK #2** on News Feed |
| 20 | Instagram/Photo Sharing (`10-LargeScale/Instagram/`) |
| 21 | Instagram — second pass |
| 22 | YouTube/Video Streaming (`10-LargeScale/YouTube/`) |
| 23 | **MOCK #3** on Instagram or YouTube |
| 24 | Rest day or re-do weakest |
| 25 | Notification System (`09-Projects/Notification-System/`) |
| 26 | Google Docs / real-time collab (`11-Advanced/Google-Docs/`) |
| 27 | Pick wildcard: Google Maps / Web Crawler (`11-Advanced/`) |
| 28 | **MOCK #4** (ask interviewer for a problem you haven't studied) |

---

### PHASE 4 — Polish & Mock Marathon (Days 29+)
- **2 full designs per day**, alternating studied + unseen problems.
- **2-3 mocks per week** (Pramp / interviewing.io — cheap or free). Always practice, debrief 15 min, fix one gap.
- One day/week: rehearse **estimation + schema-only speed drills** (5 min each).
- Last week: **only timed full designs** + review your cheat-sheet + interview-day playbook.

---

## 5. The Numbers You Must Memorize (estimation cheat sheet)

Print these. Recite daily until automatic:

```
Scales:  K=10³  M=10⁶  B=10⁹  T=10¹²

Requests:
  1M req/day ≈ 12 QPS            100M req/day ≈ 1,200 QPS
  30K req/sec ≈ 2.6B/day         peak ≈ 2× average

Latency (read: millis):
  L1 cache ~0.5ns | RAM ~100ns | SSD ~0.1ms | HDD ~10ms
  Same DC network ~0.5ms | cross-zone ~1-2ms | cross-region ~100ms
  TLS handshake ~2xRTT  |  DNS ~1ms-100ms

Storage bytes:
  char=2B | int=4B | long=8B | tiny URL record≈500B
  tweet text≈280B | 1080p 1hr video≈1.5-4GB | photo≈500KB

Throughput:
  MySQL/PG: ~1K-10K writes/s, reads w/ replicas scale out
  Redis: ~100K ops/s single node
  Kafka: ~100K-1M msgs/s cluster
  1Gbps link ≈ 125MB/s

Retention:
  5 years × 180B URLs × 500B ≈ 90TB
  500hrs video/min × 60 × 24 ≈ 720K hrs/day new video
```

---

## 6. Where to Practice Frequently-Asked Questions

| Where | What | Cost | Use it for |
|-------|------|------|-----------|
| **[Pramp](https://www.pramp.com)** | Peer mock interviews (scheduled) | Free | Weekly Track C mocks — best free option |
| **[interviewing.io](https://interviewing.io)** | Anonymous mocks, real company interviews recorded | Freemium | Realistic pressure + watch recorded examples |
| **LeetCode System Design** (discuss tab, tagged questions) | Text-based design Q&A | Free/paid | Reading model answers + seeing common questions |
| **[Alex Xu's Grokking](https://www.educative.io/courses/grokking-the-system-design-interview)** | 16 guided problems | Paid | Golden sample answers AFTER you attempt yourself |
| **[ByteByteGo](https://bytebytego.com)** | Diagrams/animated course + mock service | Paid | Visuals + mock interviews with feedback |
| **this repo / PRACTICE.md** | 16 prioritized problems w/ difficulty | Free | Your daily Track B rotation |
| YouTube: **Gaurav Sen, ByteByteGo, codeKarle** | Walkthroughs | Free | Watch ONE per problem AFTER your attempt (not before) |

**Golden rule:** Never read/watch a solution before attempting the design yourself for 30+ min. Attempt → struggle → compare → note the delta. That delta is where you improve.

---

## 7. Frequently Asked Questions — Priority Bank (do these in order)

| # | Problem | Priority | Difficulty | Study in repo |
|---|---------|----------|-----------|---------------|
| 1 | **URL Shortener** | MUST | Easy | `09-Projects/URL-Shortener/` |
| 2 | **Rate Limiter** | MUST | Easy | `09-Projects/Rate-Limiter/` |
| 3 | **News Feed (Twitter)** | MUST | Medium | `10-LargeScale/Twitter-Feed/` |
| 4 | **Chat / WhatsApp / Slack** | MUST | Medium | `09-Projects/Chat-System/` |
| 5 | **Instagram / Photo Sharing** | MUST | Medium | `10-LargeScale/Instagram/` |
| 6 | **Notification System** | HIGH | Medium | `09-Projects/Notification-System/` |
| 7 | **YouTube / Video Streaming** | HIGH | Hard | `10-LargeScale/YouTube/` |
| 8 | **Google Docs / Collab** | HIGH | Hard | `11-Advanced/Google-Docs/` |
| 9 | **Uber / Lyft (matching)** | MED | Hard | analogy: `11-Advanced/Google-Maps/` |
| 10 | **Google Maps / geospatial** | MED | Hard | `11-Advanced/Google-Maps/` |
| 11 | **E-commerce / Amazon** | HIGH | Hard | design your own (see PRACTICE.md) |
| 12 | **Web Crawler** | MED | Hard | `11-Advanced/Web-Crawler/` |
| 13 | **Google Search** | MED | Hard | PRACTICE.md #15 |
| 14 | **Distributed Lock** | LOW | Hard | PRACTICE.md #16 |
| 15 | **Typeahead / Autocomplete** | MED | Medium | PRACTICE.md #14 |
| 16 | **Leaderboard** | LOW | Medium | PRACTICE.md |

**Why is the "MUST" set #1-5?** They're asked at 70%+ of companies, and they teach every pattern you need (read-heavy feed, write-heavy streaming, real-time, media pipeline). Master #1-5 cold and you can *learn* any of the others live in the room.

---

## 8. The Mock Interview Cadence (non-negotiable)

```
Week 1  : — 
Week 2  : MOCK #1 (URL Shortener or Rate Limiter)
Week 3  : MOCK #2 (News Feed)
Week 4  : MOCK #3 (unseen problem — pick it yourself)
Week 5+ : 2-3 mocks per week, mix seen/unseen
Week 6+ : Same. YES, even before you "feel ready."
```

**Why this early?** Mocks surface *process* problems (rambling, no numbers, skipping requirements) that reading never reveals. You can't fix what you never see.

---

## 9. Interview-Day Playbook

### 24–48 hours before
- Rehearse **2 full designs** out loud; one studied, one new.
- Re-read `12-InterviewPrep/README.md` framework.
- Print numbers sheet + your cheat-sheet.

### Night before
- **No new topics.** Sleep >7h. (A well-rested D-average beats a sleep-deprived A+.)
- Lay out clothes + water. Confirm time/link/recorder.

### Morning of
- Light review only (cheat-sheet, 1 warm-up design).
- Coffee/water, brain food, brisk 10-min walk if tense.

### During (the 45-min flow)
```
00:00–05  Requirements: ask 4-6 clarifying Qs. WRITE them down. Agree scope.
05:10     Estimation: 3-5 measures (QPS, storage, latency). State assumptions.
10:25     High-level: diagram main boxes + arrows + data flow. Keep simple.
25:40     Deep dive: bottleneck, cache, schema, failure modes. Explain trade-offs.
40:45     Summary: recap design + 2 improvements you'd make if you had time.
```

### Red flags that kill candidate (avoid)
| Red flag | Fix |
|----------|-----|
| Design without clarifying scope | Always ask: users? reads vs writes? consistency? |
| No numbers anywhere | Estimations = proof of seniority |
| One-word answers, no trade-offs | Say "X gives A but costs B; alternative is C" |
| Silent 5+ min | Talk constantly, even to think out loud |
| Building the whole thing at once | 4-step framework, one box at a time |
| Ignoring failure modes | Every component: "if this dies, what happens?" |
| Over-engineering first pass | Simple + scaling plan, not a monolith of every idea |

---

## 10. Progress Tracker (tick as you go)

```
FOUNDATIONS
[ ] Day 1-2  Scaling + networking        [ ] Day 3-4  DB + caching
[ ] Day 5    Numbers memorized          [ ] Day 6-8  URL Shortener cold, 45 min

CORE CONCEPTS
[ ] Day 9-10 LB + queues                [ ] Day 11-12 hashing + CAP/PACELC
[ ] Day 13   Rate Limiter cold          [ ] Day 14   Chat System cold
[ ] Day 15   cheat-sheet written        [ ] Day 16   MOCK #1 done + gaps fixed

LARGE-SCALE
[ ] Day 17-18 News Feed cold            [ ] Day 19   MOCK #2 (News Feed)
[ ] Day 20-21 Instagram cold            [ ] Day 22-23 YouTube + MOCK #3
[ ] Day 25   Notification System        [ ] Day 26-27 Docs / Maps / Crawler
[ ] Day 28   MOCK #4 (unseen problem)

POLISH
[ ] 2 designs/day routine running       [ ] 2-3 mocks/week sustained
[ ] Estimation + schema speed drills    [ ] Interview-day playbook rehearsed
[ ] Got the offer 🎉
```

---

## 11. One-Week-Before-Interview Checklist

- [ ] You can produce **5 of the 7 MUST/HIGH problems** cold in 45 min
- [ ] Numbers sheet automatic (recite without looking)
- [ ] At least **4 live mocks** completed (2+ with external feedback)
- [ ] Cheat-sheet fits on one page and you used it in mocks
- [ ] You know the 4-step framework by heart and use it every time
- [ ] You practice out loud daily (voice memo your 2 daily designs)

---

## 12. Final Truth

> Reading this repo makes you *informed*. Designing out loud to a timer, getting mocked, and fixing gaps makes you *hired*. **Track B and C are the plan.** Everything else is fuel.

Good luck. Start with Day 1. Tomorrow.
---

## 13. Support This Plan

This course is free and open source. If this plan helped you land an offer, the best way to say thanks (and keep it free) is to [**buy the premium edition on Gumroad**](https://nirmalsujit.gumroad.com/l/system-design-mastery) � \ one-time, lifetime updates, same content. Every sale funds more free content.

