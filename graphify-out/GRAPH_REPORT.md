# Graph Report - Prompt_Wars_google  (2026-05-10)

## Corpus Check
- 46 files · ~17,592 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 35 nodes · 36 edges · 5 communities (4 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `db5b8665`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]

## God Nodes (most connected - your core abstractions)
1. `links` - 2 edges
2. `Nav()` - 2 edges
3. `router` - 2 edges
4. `saveTripRules` - 2 edges
5. `errors` - 2 edges
6. `id` - 2 edges
7. `POPULAR_DESTINATIONS` - 2 edges
8. `searchDestinations()` - 2 edges
9. `TripSummary` - 1 edges
10. `Props` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (5 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.28
Nodes (5): Props, ALIASES, DESTINATIONS, POPULAR_DESTINATIONS, searchDestinations()

### Community 1 - "Community 1"
Cohesion: 0.25
Nodes (4): BADGE, Props, PREFS, Props

### Community 2 - "Community 2"
Cohesion: 0.29
Nodes (4): Props, TripSummary, links, Nav()

### Community 3 - "Community 3"
Cohesion: 0.53
Nodes (4): errors, id, router, saveTripRules

## Knowledge Gaps
- **11 isolated node(s):** `TripSummary`, `Props`, `Props`, `chips`, `Props` (+6 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `TripSummary`, `Props`, `Props` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._