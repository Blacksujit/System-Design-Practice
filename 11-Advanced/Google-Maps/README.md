# Google Maps/Location Service - System Design

## Requirements

### Functional Requirements
- Display maps
- Search for locations
- Get directions (driving, walking, transit)
- Real-time traffic updates
- Street View

### Non-Functional Requirements
- Low latency (<200ms for directions)
- High availability
- Global coverage
- Real-time traffic data

## Capacity Estimation

- **Daily active users**: 1B+
- **Daily map requests**: 5B+
- **Daily direction requests**: 1B+
- **Map tile storage**: ~100TB

## High-Level Design

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Client      │────▶│  API Gateway    │────▶│  Load Balancer  │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                    ┌────────────────────────────────────┬┴───────────────────┐
                    │                                    │                    │
             ┌──────▼──────┐                    ┌───────▼───────┐    ┌───────▼──────┐
             │  Map Tile   │                    │   Routing     │    │   Traffic    │
             │   Service   │                    │    Service    │    │    Service   │
             └──────┬──────┘                    └───────┬───────┘    └──────┬───────┘
                    │                                    │                    │
             ┌──────▼──────┐                    ┌───────▼───────┐    ┌───────▼──────┐
             │     S3      │                    │   Graph DB    │    │   Kafka      │
             └─────────────┘                    └───────────────┘    └──────────────┘
```

## Map Tile Architecture

### Tile Coordinates
- Zoom levels: 0 (world) to 21 (building)
- Each zoom level has 4^z tiles
- Tile size: 256x256 pixels

### Tile Storage
```
s3://map-tiles/{zoom}/{x}/{y}.png
```

### Tile Serving
- CDN for popular tiles
- Lazy loading on client
- Pre-fetch adjacent tiles

## Routing Algorithm

### Dijkstra's Algorithm
- Find shortest path
- O(V²) or O(E log V) with priority queue
- Good for small graphs

### A* Algorithm
- Heuristic-guided search
- Faster than Dijkstra
- Uses estimated distance to goal

### Contraction Hierarchies
- Preprocess graph for fast queries
- Store shortcuts for highway travel
- Enable real-time routing

## Traffic Data Pipeline

```
GPS Data → Kafka → Traffic Service → Traffic Graph
                    │
                    ▼
              ┌─────────────┐
              │  Analytics  │
              └─────────────┘
```

## Database Schema

```sql
-- Map Tiles (S3 + CDN)
-- s3://map-tiles/{zoom}/{x}/{y}.png

-- Road Graph (Neo4j or custom)
CREATE NODE (Intersection {
    id BIGINT,
    lat DOUBLE,
    lon DOUBLE
})

CREATE RELATIONSHIP (Road {
    from_id BIGINT,
    to_id BIGINT,
    distance DOUBLE,
    speed_limit INT,
    road_type VARCHAR(20)
})

-- User Locations (Redis)
-- Key: user:{userId}
-- Value: {lat, lon, timestamp}
```

## Real-time Traffic

### Data Sources
- GPS from mobile devices
- Traffic sensors
- Incident reports
- Historical patterns

### Traffic Model
- Segment-based (road segments)
- Speed calculation: distance / time
- Congestion levels: free flow, light, moderate, heavy, gridlock

## Performance Optimizations

1. **Tile Caching**: CDN + local cache
2. **Graph Preprocessing**: Contraction hierarchies
3. **Lazy Loading**: Load tiles on demand
4. **Vector Tiles**: Smaller size, better compression

## Resources

- [Google Maps Platform](https://developers.google.com/maps)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [GraphHopper Routing Engine](https://www.graphhopper.com/)
- [System Design Interview - Alex Xu](https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF)
