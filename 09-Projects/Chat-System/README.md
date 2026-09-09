# Chat System - System Design

## Requirements

### Functional Requirements
- One-on-one and group chat (up to 1,000 members)
- Real-time message delivery
- Message history
- Presence (online/offline) status
- Read receipts
- Typing indicators
- Media sharing (images, files)
- Message search (optional)

### Non-Functional Requirements
- End-to-end latency < 100ms
- Availability > 99.9%
- Messages never lost (durable)
- Handle millions of concurrent connections
- Message ordering per conversation

## Capacity Estimation

- **MAU**: 100M
- **Concurrent connections**: 5M (5% of MAU)
- **Messages/day**: 5B (50 msgs/user/day)
- **Message size**: ~100 bytes text
- **Storage**: 5B/day * 100B = 500GB/day text + images + files

## High-Level Design

```
┌─────────┐  ┌─────────┐  ┌─────────┐
│ Client A│  │ Client B│  │ Client C│
└────┬────┘  └────┬────┘  └────┬────┘
     │            │            │
     └────────────┼────────────┘
                 │
      ┌──────────▼──────────┐     ┌───────────────┐
      │   Load Balancer     │     │  Session Store │
      │   (L4: TCP 443)     │     │   (Redis)      │
      └──────────┬──────────┘     └───────────────┘
                 │
      ┌──────────▼──────────┐
      │ WebSocket Gateway   │────▶ Broadcast
      │ (Chat Servers)      │
      └──────┬───────────┬──┘
             │           │
   ┌─────────▼────┐   ┌──▼────────────┐
   │  Presence    │   │  Message      │
   │  Service     │   │  Service      │
   │  (Redis)     │   │  (Cassandra)  │
   └──────────────┘   └───────────────┘
```

## WebSocket Server Flow

```
1. Client connects: wss://chat.example.com/ws?token=...
2. Gateway authenticates (validate JWT)
3. Gateway registers connection in Session Store
4. Gateway subscribes to conversation channels (Redis Pub/Sub)
5. Client sends: {type: "message", conv: "abc", text: "hello"}
6. Gateway:
   a. Appends to conversation feed (Cassandra / Kafka)
   b. Publishes to Redis channel `conv:abc`
   c. Subscribed instances deliver to connected clients
```

## Message Flow (Send → Receive)

```
Message → Enqueue to Kafka (durability, ordering per partition)
                ↓
   Partition by conversation_id (ordering)
                ↓
   Message State Store (Cassandra) - history
                ↓
   Publish to all chat servers via Redis Pub/Sub
                ↓
   Deliver to connected clients
                ↓
   If client offline → Push Notification + store offline
```

## Database Schema (Cassandra)

```sql
-- Message Table: partitioned by conversation, ordered by time
CREATE TABLE messages (
    message_id TIMEUUID,
    conversation_id UUID,
    sender_id BIGINT,
    type TEXT,            -- text, image, file
    body TEXT,
    metadata MAP<TEXT, TEXT>,
    sent_at TIMESTAMP,
    PRIMARY KEY (conversation_id, sent_at, message_id)
) WITH CLUSTERING ORDER BY (sent_at DESC);

-- Conversation Membership
CREATE TABLE conversation_members (
    conversation_id UUID,
    user_id BIGINT,
    joined_at TIMESTAMP,
    last_read_message UUID,
    PRIMARY KEY (conversation_id, user_id)
);
-- Secondary index on user_id for "my conversations"

-- User-Conversation Index (reverse lookup)
CREATE TABLE user_conversations (
    user_id BIGINT,
    conversation_id UUID,
    last_activity TIMESTAMP,
    PRIMARY KEY (user_id, last_activity)
) WITH CLUSTERING ORDER BY (last_activity DESC);

-- Unread Counts (fast counter)
CREATE TABLE unread_counts (
    user_id BIGINT,
    conversation_id UUID,
    unread_count COUNTER,
    PRIMARY KEY (user_id, conversation_id)
);
```

## Presence System (Redis)

```
Online status per user:
  SET user:{id}:status "online"
  SET user:{id}:last_seen <timestamp>
  
Connection registration:
  SADD presence:{userId} {socketId}
  
Broadcast on connect/disconnect:
  PUBLISH presence:events {"user": 123, "status": "online"}
```

### Presence Edge Cases
1. **Multi-device**: Track per device, aggregate
2. **Connection drop**: Heartbeat (ping every 30s)
3. **Status transitions**: Throttle broadcasts (debounce)

## Read Receipts

```
Read event: {type: "read", user: 123, conv: "abc", message_id: "xyz"}
→ Update last_read_message in Cassandra
→ Unread count = messages after last_read
→ Broadcast to other members
```

## Message Ordering

**Guarantee**: Messages in a conversation arrive in order.

Strategy: **Partition by conversation_id in Kafka**
- Kafka guarantees order per partition
- Message sequence number per conversation
- Client handles gap detection (missing seq)

## Message Deduplication

Client may retry on network failure → duplicate messages.

**Solution**: Client generates message_id (UUID);
Server dedupes using `conflict-free` set per conversation (e.g., store seen message_ids with TTL).

## Offline Experience

```
1. Client disconnects
2. Messages stored in Cassandra
3. Push notification sent (title + preview)
4. On reconnect:
   - Client requests messages after last_sync timestamp
   - Batch fetch recent messages
   - Update read receipts
```

## Scaling Strategy

| Component | Scale Method |
|-----------|-------------|
| Chat servers | Horizontal (stateless) |
| Connections | LB with sticky sessions / consistent hash of user_id |
| Kafka partitions | Increase with conversations |
| Cassandra | Shard/replicate by conversation_id |
| Redis | Cluster mode (presence + pub/sub) |
| Notifications | APNs/FCM pools |

## Interview Talking Points

1. **Why WebSocket over HTTP long-polling?**: Full-duplex, low overhead, real-time
2. **Why Kafka?**: Durable, ordered (per conversation), replayable
3. **Why Cassandra?**: Write-heavy, time-ordered, no schema rigidity
4. **500M+ users**: Multi-region; Kafka cross-region mirrors; conflict-free chat
5. **Group chat > 1,000**: Fan-out to topic/channel systems (massive like Discord)

## Advanced: Discord/Spaces Scale

- Channels vs conversations (many-to-many)
- Voice: WebRTC SFU (Selective Forwarding Unit)
- Moderation: canned bot, rate limiting, profanity filter, ML-based
- GDPR: delete user data on account deletion

## Resources

- [Socket.io Documentation](https://socket.io/docs/)
- [PubNub Chat Architecture](https://www.pubnub.com/solutions/chat/)
- [How Discord Scaled to Millions of Concurrent Users](https://discord.com/blog/how-discord-scales-storage-and-messages/)
- [Designing a Multipurpose Chat App](https://www.redis.com/blog/chat-message-architecture-redis/)