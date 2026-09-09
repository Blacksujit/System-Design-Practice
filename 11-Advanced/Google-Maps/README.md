# Google Maps / Location Service - System Design

## Requirements

### Functional Requirements
- Display map (tiles, zoom levels)
- Location search (places, addresses)
- Turn-by-turn navigation (A → B, with intermediate waypoints)
- Real-time traffic overlay
- ETA estimation
- Live location sharing (optional)

### Non-Functional Requirements
- Map tile load < 100ms (CDN)
- Routing response < 1s
- Accuracy: 95%+ route correctness
- Availability: > 99.99% (maps are critical)
- Handle 1B+ users globally

## High-Level Design

```
┌─────────────┐
│   Client    │
└─────┬───────┘
      │
┌─────▼───────┐   ┌──────────────────┐
│  Edge / CDN │   │   Load Balancer  │
└─────────────┘   └────────┬─────────┘
                           │
              ┌────────────▼────────────┐
              │        API Gateway       │
              └────┬──────────┬─────────┘
                   │          │
        ┌──────────▼──┐   ┌───▼─────────┐   ┌───────────────────────┐
        │ Search/Geocode│  │  Routing   │   │   Map Tile Service    │
        └──────┬──────┘   │  Service   │   └───────────┬───────────┘
               │          └────┬───────┘               │
               │               │                       │
        ┌──────▼──────┐   ┌────▼────────────────────────▼─────────┐
        │ Geospatial  │   │        Geospatial Data Store          │
        │ DB (PostGIS)│   │  (R-tree / S2 / H3 / PostGIS)         │
        └─────────────┘   └───────────────────────────────────────┘
        ┌──────────────────────────────────────────────────────────┐
        │              Map Data + Graph (Road Network)             │
        │  (Osm db - stats, elevation, restrictions)              │
        └───────────────────────────────────────────────────────────┘
```

## Key Components

### 1. Map Rasterization (Tiles)

**Tiling System (XYZ)**
```
Level 0: whole world = 1 tile (256x256px)
Level 1: 2x2 = 4 tiles
Level N: 2^N x 2^N tiles

Global zoom 0→22; typical map shows zoom 10-18; indoor zoom 22

URL: /tiles/z/x/y.png
```

Optimization:
- Pre-render tiles offline (batch, using GPU or software)
- CDN-cache: `Cache-Control: public, max-age=1year` (unchanged tile)
- Vector tiles (simplified geometry) → smaller, client renders
- Overlay layers: traffic, terrain rendered separately, composited client-side

### 2. Geocoding / Location Search

```
Query "Eiffel Tower, Paris" → Geocoder → lat/lng, bounding box, place ID

Storage: 
  - Place database (PostGIS / Elasticsearch)
  - Syntax-based matching
  - Fuzziness: edits (Levenshtein), prefix, n-grams
  - Ranking: popularity, proximity, category
```

### 3. Routing / Turn-by-turn Navigation

**Graph representation**: Nodes = intersections, Edges = road segments.

**Algorithms**:
- Dijkstra (baseline, O(V^2))
- A* (heuristic → fast for point-to-point)
- Bidirectional A* (faster large maps)
- Contraction Hierarchies (precomputed shortcuts → production Google uses this)
- ALT (Landmarks)

Production choices:
```
Precompute Contraction Hierarchies per region (offline, large compute).
Runtime: bidirectional search on compressed graph → near-instant.

Transit / walking / cycling vary graph weights (speed, elevation, mode restrictions).
```

### Traffic Overlay & ETA

```
Live GPS traces → Kafka → Aggregator (5-min windows) → 
Average speed per road segment → publish to tile server + routing

ETA = sum(road length / current avg speed + historical pattern)
Historical pattern: day-of-week, hour-of-day (ML or lookup)
```

## Data Model

```sql
-- Places (PostGIS)
CREATE TABLE places (
    place_id BIGINT PRIMARY KEY,
    name TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    category VARCHAR(50),
    popular_level INT DEFAULT 0,
    geom GEOGRAPHY(POINT, 4326)  -- geospatial index
);
CREATE INDEX idx_places_geom ON places USING GIST(geom);

-- Road Network (graph)
CREATE TABLE roads (
    edge_id BIGINT PRIMARY KEY,
    start_node BIGINT,
    end_node BIGINT,
    length_m FLOAT,
    speed_limit_kmh FLOAT,
    road_class VARCHAR(20),   -- motorway, primary, residential
    allowed_modes TEXT[]      -- driving, walking, cycling
);
CREATE INDEX idx_roads_nodes ON roads (start_node, end_node);

-- Geohash / S2 cells for proximity lookup
```

## Proximity Queries

**Problem**: "Find 20 nearest coffee shops within 5km"

**Indexes**:
1. **R-tree** (PostGIS/PostgreSQL): spatial range query
2. **Geohash**: string prefix = geo region
3. **S2/H3**: hierarchical cells (Google uses S2, Uber uses H3)

```
SELECT * FROM places
WHERE ST_DWithin(geom, ST_MakePoint(-73.9,40.7)::geography, 5000)
ORDER BY ST_Distance(geom, ...) ASC LIMIT 20;
```

## Live Location Sharing

```
Client → WebSocket/HTTP POST location updates (every 5-10s) →
  Location Service → Redis (pub/sub per trip) → Other participants

Consent/permission: access token per shared trip, TTL expiring.
```

## Scaling & Failover

- Tiles: purely CDN cached; zero origin compute for hot tiles
- Search: Elasticsearch cluster scaled by region
- Routing: compute in regional clusters, cache routes (common origin/dest)
- Traffic: Kafka stream → regional aggregators
- Map data updates: nightly sync from OSM/Google; versioned tiles (cache invalidation via version string)

## Interview Talking Points

1. **Tiling = content addressable cache** — the whole system rests on predictable CDN caching
2. **Precomputation** (Contraction Hierarchies) makes routing fast at runtime
3. **Geospatial indexes** (R-tree / S2 / Geohash) power proximity
4. **Data pipeline** (GPS traces → traffic → ETA) drives dynamic value
5. **Multi-modal routing** needs per-mode graph weighting

## Resources

- [MIT: Geospatial Data Science](https://dsgeorgia.mit.edu/)
- [PostGIS Documentation](https://postgis.net/documentation/)
- [S2 Geometry Library (Google)](https://s2geometry.io/)
- [H3 (Uber)](https://h3geo.org/)
- [OSRM - Open Source Routing Machine](https://project-osrm.org/)