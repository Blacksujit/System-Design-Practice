# Google Docs/Real-time Collaboration - System Design

## Requirements

### Functional Requirements
- Create and edit documents
- Real-time collaboration (multiple users)
- Cursor presence and selection
- Version history
- Comments and suggestions
- Offline support

### Non-Functional Requirements
- Low latency (<100ms for edits)
- High availability
- Conflict resolution
- Scalability (millions of concurrent users)

## Capacity Estimation

- **Users**: 1B+ users
- **Concurrent editors per doc**: Up to 100
- **Edits per second**: 10K+ globally
- **Storage**: Documents + version history

## Core Concepts

### Operational Transformation (OT)
- Transform operations against concurrent operations
- Maintain consistency
- Server is source of truth

### Conflict-free Replicated Data Types (CRDTs)
- Mathematical approach to consistency
- Operations can be applied in any order
- No central server needed
- Used in modern implementations

## High-Level Design

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Client      │◀───▶│  WebSocket      │◀───▶│  Collaboration  │
│   (Browser)     │     │    Server       │     │    Service      │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                    ┌────────────────────────────────────┬┴───────────────────┐
                    │                                    │                    │
             ┌──────▼──────┐                    ┌───────▼───────┐    ┌───────▼──────┐
             │  Document   │                    │    Redis      │    │  PostgreSQL  │
             │   Storage   │                    │  (Presence)   │    │  (Documents) │
             └─────────────┘                    └───────────────┘    └──────────────┘
```

## OT vs CRDT Comparison

| Aspect | OT | CRDT |
|--------|-----|------|
| Consistency | Strong | Eventual |
| Complexity | High | Medium |
| Server dependency | Required | Optional |
| Used by | Google Docs | Figma, Apple Notes |

## Collaboration Flow

```
1. User A types character 'X'
2. Client sends operation: Insert(pos=5, char='X')
3. Server receives operation
4. Server transforms against pending operations
5. Server broadcasts transformed operation to all clients
6. Clients apply operation locally
7. Server persists document state
```

## Cursor Presence

```
Redis Hash:
user:{userId}:cursor = {
    "docId": "abc123",
    "position": 42,
    "selection": {"start": 40, "end": 42},
    "color": "#FF5733",
    "name": "User A"
}
```

## Database Schema

```sql
-- Documents Table
CREATE TABLE documents (
    id UUID PRIMARY KEY,
    title VARCHAR(255),
    owner_id BIGINT,
    content JSONB, -- Document content as JSON
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    version BIGINT DEFAULT 0
);

-- Document Versions (for history)
CREATE TABLE document_versions (
    id BIGSERIAL PRIMARY KEY,
    document_id UUID REFERENCES documents(id),
    version BIGINT,
    content JSONB,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Collaborators Table
CREATE TABLE collaborators (
    document_id UUID REFERENCES documents(id),
    user_id BIGINT,
    permission VARCHAR(20), -- owner, editor, viewer
    added_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (document_id, user_id)
);
```

## Offline Support

### Local Operations
- Queue operations locally
- Apply immediately for responsiveness
- Sync when reconnected

### Conflict Resolution
- Server transforms queued operations
- Client receives authoritative state
- Merge local changes

## Performance Optimizations

1. **Debouncing**: Batch rapid keystrokes
2. **Compression**: Delta compression for operations
3. **Partitioning**: Shard documents across servers
4. **Caching**: Cache frequently accessed documents

## Resources

- [Google Docs Architecture](https://drive.googleblog.com/)
- [Operational Transformation Paper](https://dl.acm.org/doi/10.1145/1058100.1058105)
- [CRDTs for Collaborative Editing](https://crdt.tech/)
- [Figma's Multiplayer Technology](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/)
