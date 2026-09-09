# Chat System - System Design

## Requirements

### Functional Requirements
- 1-on-1 messaging
- Group chat
- Online/offline status
- Message history
- Read receipts
- File sharing

### Non-Functional Requirements
- Real-time messaging
- High availability
- Message ordering
- Scalability (millions of users)
- Data durability

## Capacity Estimation

- **Users**: 50M daily active
- **Messages**: 40 messages/user/day = 2B/day
- **QPS**: 2B / 86400 ≈ 23,000 QPS
- **Storage**: 2B * 100 bytes = 200GB/day

## High-Level Design

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│    Load     │────▶│ WebSocket   │
│  (Mobile/   │◀────│  Balancer   │◀────│   Server    │
│   Web)      │     └─────────────┘     └──────┬──────┘
└─────────────┘                                │
                                        ┌──────▼──────┐
                                        │  Chat Service│
                                        └──────┬──────┘
                                               │
                    ┌──────────────────────────┼──────────────────────────┐
                    │                          │                          │
             ┌──────▼──────┐           ┌───────▼───────┐          ┌──────▼──────┐
             │   Message   │           │    User       │          │   Presence  │
             │   Storage   │           │   Service     │          │   Service   │
             └──────┬──────┘           └───────┬───────┘          └─────────────┘
                    │                          │
             ┌──────▼──────┐           ┌───────▼───────┐
             │  Cassandra  │           │    Redis      │
             └─────────────┘           └───────────────┘
```

## WebSocket Connection Management

### Connection Flow
1. Client connects to WebSocket server
2. Authenticate via JWT token
3. Register connection in Presence service
4. Start receiving messages

### Heartbeat Mechanism
```
Client → Server: Ping (every 30s)
Server → Client: Pong
If no pong in 60s: Disconnect
```

## Message Flow (1-on-1)

```
1. User A sends message
2. WebSocket Server receives message
3. Message stored in Cassandra
4. Check if User B online
   - Online: Push via WebSocket
   - Offline: Store in notification queue
5. Send delivery receipt to User A
```

## Database Schema

```sql
-- Messages Table (Cassandra)
CREATE TABLE messages (
    chat_id UUID,
    message_id TIMEUUID,
    sender_id BIGINT,
    content TEXT,
    content_type VARCHAR(20),
    created_at TIMESTAMP,
    PRIMARY KEY (chat_id, message_id)
) WITH CLUSTERING ORDER BY (message_id DESC);

-- Chat Members Table
CREATE TABLE chat_members (
    chat_id UUID,
    user_id BIGINT,
    joined_at TIMESTAMP,
    PRIMARY KEY (chat_id, user_id)
);

-- User Chats Table
CREATE TABLE user_chats (
    user_id BIGINT,
    chat_id UUID,
    last_message_at TIMESTAMP,
    PRIMARY KEY (user_id, last_message_at)
) WITH CLUSTERING ORDER BY (last_message_at DESC);
```

## Message Ordering

### Single Chat
- Use server timestamp
- Sequence number per chat
- Cassandra TimeUUID for ordering

### Group Chat
- Causal ordering with vector clocks
- Per-partition ordering
- Conflict resolution for concurrent messages

## Group Chat Design

### Fan-out on Send
- Write message to all member inboxes
- Fast reads, slow writes
- Good for small groups

### Fan-out on Read
- Store message once
- Query at read time
- Good for large groups

## File Sharing

```
1. Client requests upload URL from Chat Service
2. Chat Service returns pre-signed S3 URL
3. Client uploads directly to S3
4. Client sends message with file URL
5. Recipients download from S3/CDN
```

## Resources

- [Socket.io Documentation](https://socket.io/docs/)
- [PubNub Chat Architecture](https://www.pubnub.com/)
- [How Discord Stores Billions of Messages](https://blog.discord.com/how-discord-stores-billions-of-messages-7fa6ec7ee4c7)
