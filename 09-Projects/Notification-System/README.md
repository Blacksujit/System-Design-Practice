# Notification System - System Design

## Requirements

### Functional Requirements
- Send push notifications, emails, SMS
- Support multiple channels (push, email, SMS, in-app)
- User preferences and opt-outs
- Delivery retries with backoff
- Rate limiting per user/channel
- Notification templates

### Non-Functional Requirements
- **At-least-once** delivery (no data loss)
- High availability (>99.9%)
- Scalability (100M+ notifications/day)
- Hard latency: push < 1min, email < 5min

## Capacity Estimation

- Notifications/day: 100M
- Push: 60%, Email: 30%, SMS: 10%
- Peak QPS: 100M/86400s ≈ 1,200 writes/sec → 3,000 with spikes
- Storage: 100M * 1KB = 100GB/day

## High-Level Design

```
┌──────────────────────────────────────────────────────────────┐
│                     Client Application                        │
│  (iOS Push / Android / Email Client / SMS / Web)              │
└────────────────────────────┬─────────────────────────────────┘
                             │
┌───────────────────────────▼─────────────────────────────────┐
│                 API Gateway (rate limited)                    │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                   Notification Service                       │
│  - Validate templates and preferences                       │
│  - Check rate limits                                        │
│  - Enqueue to message queue                                 │
└───────┬──────────────────────────────┬─────────────────────┘
        │                              │
┌───────▼─────────┐           ┌─────────▼──────────────────────┐
│     Kafka       │           │      Preference Service        │
│  (message queue)│           │  - user opt-ins, frequency     │
└───────┬─────────┘           └────────────────────────────────┘
        │
┌───────▼──────────────────────────────────────────┐
│         Channel Workers (separate per channel)    │
│  ┌─────────┐  ┌─────────┐  ┌───────────┐  ┌─────┐
│  │   Push  │  │  Email  │  │    SMS    │  │ ... │
│  │ Worker  │  │ Worker  │  │  Worker   │  │     │
│  └────┬────┘  └────┬────┘  └─────┬─────┘  └─────┘
│       │            │             │
└───────┼────────────┼─────────────┼──────────┘
        │            │             │
   ┌────▼────┐  ┌────▼────┐  ┌──────▼──────┐
   │ APNs    │  │ Ses/   │  │  Twilio/    │
   │ FCM     │  │ Postmark│  │  Amazon SNS │
   └─────────┘  └─────────┘  └─────────────┘
```

## Notification Flow

```
1. Client calls POST /notifications
   {
     "type": "push",
     "template": "welcome",
     "data": {"name": "Alice"},
     "target": {"user_id": 12345}
   }

2. Notification service:
   - Fetches user preferences
   - Checks rate limit
   - Renders template
   - Enqueues to Kafka topic

3. Channel worker consumes:
   - Push worker → APNs/FCM
   - Email worker → SES/SendGrid
   - SMS worker → Twilio

4. Track delivery status:
   - Update status in DB
   - Retry with exponential backoff
```

## Database Schema

```sql
-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    user_id BIGINT NOT NULL,
    notification_type VARCHAR(50),
    channel VARCHAR(20), -- push, email, sms
    template_id VARCHAR(100),
    data JSONB,
    status VARCHAR(20), -- pending, sent, delivered, failed
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partition by created_at (monthly)

-- User Preferences
CREATE TABLE notification_preferences (
    user_id BIGINT PRIMARY KEY,
    push_enabled BOOLEAN DEFAULT TRUE,
    email_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT FALSE,
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    max_per_hour INT DEFAULT 10
);

-- Templates
CREATE TABLE notification_templates (
    id VARCHAR(100) PRIMARY KEY,
    channel VARCHAR(20),
    subject TEXT,
    body TEXT,
    -- handle airnel variables, locale
    category VARCHAR(50)
);

-- Delivery Logs
CREATE TABLE notification_audit (
    notification_id UUID,
    attempt INT,
    provider VARCHAR(50),
    status VARCHAR(20),
    error TEXT,
    attempted_at TIMESTAMPTZ,
    PRIMARY KEY (notification_id, attempt)
);
```

## Key Design Decisions

### 1. Message Queue (Kafka)
**Why**:
- Decouple sending from processing
- Buffer traffic spikes
- Multiple consumers (channels)
- Retry capability

### 2. Per-channel Workers
**Why**:
- Isolate failures (email down doesn't block push)
- Independent scaling
- Provider-specific rate limits

### 3. Templates with Variables
**Why**:
- Consistent formatting
- Reusable + localized
- Dynamic content in fixed structure

### 4. Retry with Backoff
```
Attempt 1: 0s
Attempt 2: 30s
Attempt 3: 5min
Attempt 4: 30min
Attempt 5: 2hr
→ Dead Letter Queue after 5 attempts
```

## Reliability & Failure Handling

### Provider Down (APNs/SES/Twilio)
- Retry with backoff
- Route to alternate provider
- Dead letter queue for manual review

### Duplicate Delivery
- Send with idempotency key
- Providers support dedup (APNs)
- At-least-once is acceptable for notifications

### Rate Limited by Provider
- Per-provider token bucket
- Queue-based pacing
- Bulk operations to reduce calls

## Scaling Considerations

1. **Kafka partitions**: Shard by user_id hash
2. **Workers**: Autoscale by queue depth
3. **DB**: Partition by created_at
4. **Preference cache**: Redis for hot users
5. **Rate limiter**: Redis token bucket per user/channel

## Extensions to Discuss

1. **Scheduled notifications** (push in 3 hours)
2. **A/B testing templates**
3. **Analytics** (deliverability metrics)
4. **Multi-language support**
5. **Deduplication** (same notif can't be sent twice)

## Resources

- [OneSignal Documentation](https://documentation.onesignal.com/)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [APNs Overview](https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/APNSOverview.html)
- [Scott's Notification Architecture (Uber)](https://www.uber.com/blog/engineering/notification-service/)