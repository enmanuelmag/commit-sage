# Graph Report - .  (2026-06-08)

## Corpus Check
- Corpus is ~5,180 words - fits in a single context window. You may not need a graph.

## Summary
- 96 nodes · 126 edges · 10 communities (7 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_API & Core Services|API & Core Services]]
- [[_COMMUNITY_Provider Factory|Provider Factory]]
- [[_COMMUNITY_Prompt Building|Prompt Building]]
- [[_COMMUNITY_Configuration|Configuration]]
- [[_COMMUNITY_Ollama Provider|Ollama Provider]]
- [[_COMMUNITY_Anthropic Provider|Anthropic Provider]]
- [[_COMMUNITY_OpenAI Provider|OpenAI Provider]]

## God Nodes (most connected - your core abstractions)
1. `ProviderConfig` - 6 edges
2. `Ollama` - 5 edges
3. `AnthropicProvider` - 5 edges
4. `OpenAI` - 5 edges
5. `IProvider` - 5 edges
6. `PromptBuilder` - 3 edges
7. `ApiType` - 2 edges
8. `CommitSageConfig` - 2 edges
9. `Status` - 2 edges
10. `StatusType` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (10 total, 3 thin omitted)

### Community 0 - "API & Core Services"
Cohesion: 0.04
Nodes (50): API, ApiKey, APIState, ApiUrl, AvatarQuery, AvatarQueryCommit, Branch, BranchProtection (+42 more)

### Community 1 - "Provider Factory"
Cohesion: 0.42
Nodes (4): ProviderFactory, IProvider, ApiType, ProviderConfig

### Community 2 - "Prompt Building"
Cohesion: 0.22
Nodes (6): PromptBuilder, Change, ChangeWithDiff, Repository, Status, StatusType

### Community 3 - "Configuration"
Cohesion: 0.29
Nodes (3): getConfig(), CommitSageConfig, GitExtension

## Knowledge Gaps
- **50 isolated node(s):** `ApiUrl`, `ModelId`, `ApiKey`, `MaxDiffSize`, `Token` (+45 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Ollama` connect `Ollama Provider` to `Provider Factory`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `AnthropicProvider` connect `Anthropic Provider` to `Provider Factory`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `OpenAI` connect `OpenAI Provider` to `Provider Factory`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **What connects `ApiUrl`, `ModelId`, `ApiKey` to the rest of the system?**
  _50 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `API & Core Services` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._