# Notification System - System Design

## Requirements

### Functional Requirements
- Send push notifications, emails, SMS
- Support millions of users
- User notification preferences
- Priority notifications
- Delivery status tracking

### Non-Functional Requirements
- High availability
- Scalability
- Low latency for priority messages
- At-least-once delivery

## Capacity Estimation

- **Users**: 100M
- **Daily notifications**: 10 per user = 1B/day
- **QPS**: 1B / 86400 ≈ 12,000 QPS

## High-Level Design

```
                    ┌─────────────────┐
                    │   API Gateway   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Notification   │
                    │     Service     │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼───────┐    ┌───────▼───────┐    ┌───────▼───────┐
│  Push Service │    │  Email Service│    │   SMS Service │
└───────┬───────┘    └───────┬───────┘    └───────┬───────┘
        │                    │                    │
┌───────▼───────┐    ┌───────▼───────┐    ┌───────▼───────┐
│  Firebase/APN │    │   SendGrid    │    │  Twilio/SNS   │
└───────────────┘    └───────────────┘    └───────────────┘
```

## Database Schema

```sql
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type VARCHAR(20) NOT NULL, -- push, email, sms
    title VARCHAR(255),
    body TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, sent, delivered, failed
    priority VARCHAR(10) DEFAULT 'normal', -- low, normal, high, critical
    created_at TIMESTAMP DEFAULT NOW(),
    sent_at TIMESTAMP,
    metadata JSONB
);

CREATE TABLE user_preferences (
    user_id BIGINT PRIMARY KEY,
    push_enabled BOOLEAN DEFAULT TRUE,
    email_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT FALSE,
    quiet_hours_start TIME,
    quiet_hours_end TIME
);
```

## Message Queue Architecture

```
Notification Request → Kafka Topic → Consumer Groups
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
              ┌─────▼─────┐    ┌──────▼──────┐    ┌──────▼──────┐
              │Push Consumer│   │Email Consumer│   │ SMS Consumer│
              └───────────┘    └─────────────┘    └─────────────┘
```

## Priority Handling

### Critical Notifications
- Bypass queue, direct to provider
- Immediate retry on failure
- SMS as fallback

### High Priority
- Dedicated queue
- Higher consumer count
- Shorter retry delay

### Normal/Low Priority
- Standard queue
- Batch processing
- Retry with backoff

## Template System

```json
{
    "template_id": "order_confirmation",
    "channels": {
        "push": {
            "title": "Order Confirmed!",
            "body": "Your order #{{order_id}} has been confirmed."
        },
        "email": {
            "subject": "Order Confirmation",
            "template": "order_confirmation.html"
        }
    }
}
```

## Resources

- [OneSignal Documentation](https://documentation.onesignal.com/)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [SendGrid Documentation](https://docs.sendgrid.com/)
