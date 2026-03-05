---
name: nest-backend-performance-refactor-oop
description: Senior-level backend engineering workflow focused on NestJS and TypeScript. Use when working on API/backend services that need architecture improvements, OOP-oriented refactoring, maintainability upgrades, and performance optimization (latency, throughput, memory, database/query efficiency). Trigger for requests about redesigning modules, improving service boundaries, reducing technical debt, profiling bottlenecks, or turning messy NestJS code into production-grade patterns.
---

# NestJS Senior Backend Workflow

Use this skill to deliver pragmatic, production-focused backend changes.

## Core approach

- Clarify business-critical path first before touching structure.
- Preserve behavior before optimizing; add safeguards before refactor.
- Prefer explicit module boundaries and dependency direction.
- Keep OOP focused on cohesion, not inheritance depth.
- Optimize based on measured bottlenecks, not assumptions.

## Default execution flow

1. Map current behavior
- Identify hot paths: endpoints with highest load, slowest latency, or highest error impact.
- Trace request flow: controller -> use case/service -> domain logic -> repository/external IO.
- Note current coupling points, duplicated logic, and transaction boundaries.

2. Define target shape
- Split by responsibility: transport layer, application/service layer, domain policy layer, infrastructure layer.
- Extract interfaces at boundaries (repositories, gateways, external clients).
- Keep DTOs/API contracts at boundaries; avoid leaking ORM entities across layers.

3. Refactor safely
- Apply small, reversible changes in sequence.
- Keep signatures stable where possible; isolate breaking changes.
- Remove dead code and duplicated branches after behavior parity is confirmed.

4. Improve performance
- Measure first: endpoint timing, query count/time, cache hit rate, memory hotspots.
- Prioritize high-impact fixes:
  - N+1 query elimination and index-friendly query patterns
  - Batch/parallel IO where safe
  - Caching for read-heavy paths with explicit invalidation rules
  - Payload trimming and serialization cost reduction
  - Async/offloading for non-critical side effects
- Re-measure and compare against baseline.

5. Lock quality
- Add/adjust tests closest to changed behavior (unit + integration/e2e as needed).
- Validate error handling, timeouts, retries, and transactional integrity.
- Document tradeoffs and follow-up items.

## NestJS + TypeScript standards

- Use dependency injection with clear provider contracts.
- Keep controllers thin; place orchestration in application services/use-cases.
- Keep domain rules in cohesive classes/functions that are framework-light.
- Prefer composition over inheritance.
- Use strict TypeScript types; avoid `any` and implicit nullable behavior.
- Use explicit result/error models when complex failure paths exist.

## OOP refactoring heuristics

- High cohesion: each class should own one business capability.
- Low coupling: depend on abstractions at boundaries.
- Encapsulate invariants inside domain objects/services.
- Replace long procedural services with smaller collaborators.
- Introduce patterns only when they reduce complexity in this codebase.

## Performance checklist

- Database: query plans, indexes, pagination strategy, transaction scope.
- App runtime: event loop blocking work, unnecessary serialization, memory churn.
- Network: downstream timeout budgets, retry policy, circuit-breaker/backoff.
- Caching: correctness, TTL strategy, invalidation ownership.
- Observability: logs, metrics, trace spans added where bottlenecks were fixed.

## Output contract for responses

When using this skill, structure output as:

1. Current risk/bottleneck summary
2. Proposed design/refactor plan
3. Concrete code-level changes
4. Performance impact expectation and validation method
5. Remaining risks and next actions

## CTO-level code review prompt

Use this prompt when the user asks for code review:

```text
Act as a CTO-level backend reviewer with 10+ years of NestJS and TypeScript experience.
Review this code for production-readiness with strict focus on:
1) Performance and bottlenecks (latency, throughput, memory, DB query patterns, N+1, serialization overhead)
2) Availability and resilience (timeouts, retries, circuit breaking, graceful degradation, single points of failure)
3) Scalability (horizontal scaling behavior, cache strategy, idempotency, concurrency safety)
4) Architecture and OOP quality (module boundaries, dependency direction, cohesion/coupling, abstraction quality)
5) Operational excellence (observability, alertability, rollback safety, blast radius)
6) Security and reliability basics (input validation, auth boundaries, error leakage, transaction integrity)

Output format:
- Findings first, ordered by severity (Critical/High/Medium/Low)
- For each finding: risk, evidence, impact, and exact fix recommendation
- Include missing tests and validation metrics
- End with: Top 3 priorities to execute this week
```
