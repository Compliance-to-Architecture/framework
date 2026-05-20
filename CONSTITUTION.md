# Constitution — Compliance-to-Architecture Framework

This document is the LOCKED set of architectural commitments every
conforming implementation of the Compliance-to-Architecture Framework™
must satisfy. Amendments to this constitution require a major-version
bump of the framework spec and consensus among published implementers.

Apache-2.0. (c) 2026 Compliance-to-Architecture maintainers.

## Amendment 1 — 5-phase event lifecycle

Every state-changing event a conforming implementation produces MUST
carry one of the following canonical phase tags:

| Phase | Meaning |
|---|---|
| **upstream** | Change requested but not yet committed (intent declared). |
| **midstream** | Mutation in flight (engine running, deploy uploading, payment authorising). |
| **downstream** | Mutation committed (verdict written, deploy live, payment captured). |
| **propagation** | Downstream consumers notified (cache invalidated, webhook fired, customer emailed). |
| **compensating** | Failure / rollback (chargeback, deploy rolled back, drift remediated). |

Rationale: a deterministic auditor must be able to traverse the
causal chain of any single observable outcome by following its 5-phase
lineage backwards. Implementations that emit untyped events break the
chain.

## Amendment 2 — event-driven by spec

Indexing, reconciliation, evidence-pack writing, audit-trail emission,
log capture, doc rebuild, and every other state-changing flow MUST be
event-driven. Specifically:

1. **No primary cron triggers**. A workflow scheduled by cron alone is
   forbidden as a PRIMARY path. A cron MAY exist as a safety-net
   alongside an event-driven primary trigger; it MUST be documented as
   belt-and-suspenders.
2. **≤ 30 second end-to-end latency** from real-world event to first
   observable consumer (evidence pack written / audit-trail row
   appended / verdict posted / log line indexed).
3. **The contract is verifiable by registry**. Implementations MUST
   publish an event registry declaring every source's primary trigger,
   fallback trigger, max-latency budget, 5-phase phases emitted, and
   compliance status (compliant / in-flight / violation). The
   canonical taxonomy of event-driven source categories is published
   in the public `dictionaries` repository:
   [`dictionaries/event-driven.json`](https://github.com/Compliance-to-Architecture/dictionaries/blob/main/dictionaries/event-driven.json).

Documentation, indexing, reconciliation and verdict pipelines are
**in scope**. Polling an upstream source that supports push (webhook /
event subscription) violates this amendment.

## Amendment 3 — patent-safe + open

The framework spec, ontology, sector packs, dictionaries, and
reference implementations under this org ship under **Apache-2.0**
with its accompanying patent grant. Trademarks
(Compliance-to-Architecture Framework™, Code Constitution™, ReguNav™)
are not licensed by the open licence — see
[`TRADEMARKS.md`](https://github.com/Compliance-to-Architecture/.github/blob/main/TRADEMARKS.md).

## Amendment 4 — Single-implementation mandate

Every named capability in a conforming implementation of the
Compliance-to-Architecture Framework™ has **exactly ONE canonical
implementation**. A second implementation of an existing named
capability is a §0 competing-systems violation.

A conforming implementation MUST publish:

1. **A manifest** mapping every named capability to its canonical
   implementation path. The manifest is version-controlled,
   machine-readable (JSON, YAML, or TOML), and lives in the
   implementation's source tree.
2. **A drift gate** that runs on every change to the source tree and
   fails when:
   - the canonical implementation referenced in the manifest does not
     exist, **or**
   - a forbidden-pattern regex declared by the manifest matches code
     outside the canonical implementation's directory (with explicitly
     allowed-callers exempt), **or**
   - a new symbol exists with the same capability id as an existing
     entry.

A "named capability" is a unit of behavior with a stable kebab-cased
identifier (`auth.pdp`, `audit.worm_chain`, `comms.outbound_rail`), a
single semantic responsibility, a documented contract (typed inputs +
outputs + side-effects), and at least one inbound consumer. Pre-
capability code (experimental, single-use, internal) is exempt until
promoted.

Manifest shape (minimum):

```json
{
  "_meta": {
    "framework_version": "x.y.z",
    "constitution_amendment": 4
  },
  "capabilities": [
    {
      "id": "auth.pdp",
      "title": "Policy Decision Point",
      "rationale": "one sentence — why duplication would be unsafe",
      "canonical_path": "path/to/impl",
      "canonical_export": "exportedSymbol",
      "forbidden_patterns": ["regex1"],
      "allowed_callers": ["glob1"]
    }
  ]
}
```

Rationale: pre-amendment, conforming implementations could (and did)
ship multiple implementations of the same capability — two hash-chain
serializers, two outbound email rails, two tenant-key resolvers, two
SAML verifiers, two sub-processor lists. Every additional
implementation creates audit-trail ambiguity ("which one signed this
event?"), procurement-review failure ("which one is the source of
truth?"), and regulator-review failure under DORA Art. 28 + EU AI Act
Art. 12 (technical documentation must be unambiguous). The rule is
not "don't write code twice"; it is that the framework requires a
single named capability to have a single source of truth, and that
the implementation can prove it.

Removal of a capability requires the absorbing capability's manifest
entry updated to reflect the new scope, an Architecture Decision
Record in the implementation's source tree documenting the
consolidation, and no remaining importers of the deleted symbol
(proven by type-check or equivalent).

Amendment 4 stacks on top of Amendments 1 and 2. Every event in the
5-phase lifecycle is emitted by **the** canonical emitter for that
event family; the event-driven contract (Amendment 2) is satisfied by
**the** canonical event-engine implementation; alternative
event-engines are forbidden.

Reference implementation: the ReguNav + Code Constitution monorepo
ships the first conforming implementation under `docs/constitution/
40-CANONICAL-IMPLEMENTATIONS.md`, with the canonical manifest at
`packages/manifests/src/canonical-implementations.json` and the drift
gate at `scripts/ci/check-canonical-implementations.mjs`. Other
implementations are encouraged to mirror this structure although the
spec only requires that the manifest exists and the gate enforces it.

## Amendment 5 — Zero-deviation mandate

The default state of a conforming implementation's deviation registry
(`DEVIATIONS.md` in the implementation's source tree) is **zero active
deviations**. Any active deviation from a canonical implementation
(Amendment 4) or any §0 mandate is itself a §0 violation.

A "deviation" is a temporary, sunset-bound exception that MAY only be
added when all of the following are true:

1. The PR cannot proceed without breaking a §0 gate.
2. The break is unavoidable for a legal, regulatory, or platform-level
   reason — never "I haven't finished refactoring."
3. Two named maintainers (per the implementation's `MAINTAINERS.md`)
   sign off on the PR.
4. A sunset date is committed in the same PR (max +90 days from merge).
5. The entry references a tracked closure issue with a closure plan.

A conforming implementation MUST publish:

- The deviation registry file (`DEVIATIONS.md` at the source-tree
  root), with a clearly delimited `## Active deviations` section.
- A drift gate that runs on every change to the registry or the
  capability manifest, and fails the build when the active-deviation
  section contains any content other than the literal placeholder
  `(none — last cleared YYYY-MM-DD)` UNLESS every entry conforms to
  the five conditions above.
- A `## Historical deviations` table that retains every closed
  deviation as a closed-debt audit trail.

Rationale: Amendment 4 forbids competing systems by construction.
Amendment 5 closes the back-door — a developer can no longer ship a
"temporary" duplicate with a TODO comment intending to refactor it
later. Either the duplicate violates Amendment 4 and the canonical
gate blocks it, or it satisfies the five conditions of Amendment 5
and is a tracked, sunset, two-maintainer-approved exception that the
regulator can read in the audit trail.

Reference implementation: the ReguNav + Code Constitution monorepo
ships `DEVIATIONS.md` at the repo root, the constitution at
`docs/constitution/41-ZERO-DEVIATION-MANDATE.md`, the drift gate at
`scripts/ci/check-zero-deviations.mjs`, and the CI workflow at
`.github/workflows/zero-deviation-alive.yml`.

## Amendment 6 — Coherent-integration mandate

Every named component in a conforming implementation MUST integrate
with the rest of the system through **bidirectional canonical
references** — registry → component AND component → registry — and the
integration MUST be verified by a CI gate at every merge.

A "named component" is any of: engine, agent, rail, schema, manifest,
dictionary, registry, endpoint, policy, middleware, gate, worker, or
canonical implementation (Amendment 4). A surface that exists on disk
but is not referenced by any manifest, registry, event-family
declaration, or gate is a §0 violation.

**The system is one unit, not a federation of islands.**

A conforming implementation MUST publish gates that enforce at least
three classes of bidirectional integration:

1. **No dead gates** — every CI gate script under
   `scripts/ci/check-*` MUST be invoked by at least one workflow.
2. **No orphan manifests** — every machine-readable manifest MUST be
   both imported by at least one source file AND read by at least one
   CI gate. A manifest with no importer is unused; a manifest with no
   gate is unenforced.
3. **No false-green workflows** — every CI workflow MUST do exactly
   one real thing: invoke a gate, build, typecheck, test, deploy, or
   route a webhook. A workflow that adds a green checkmark without
   verifying anything is forbidden.

Rationale: prior to Amendment 6, conforming implementations had three
categories of silent islands:

- workers without manifest entries (deployed via wrangler but absent
  from the resource manifest, so state-reconciliation had nothing to
  diff against),
- rails without PDP coverage (mounted but missing from the path-to-
  resource map, so the policy decision point silently allowed
  unauthorised access on null resource kind),
- duplicated registries (sub-processor lists, JWT verifiers, outbound
  email templates) that drifted across surfaces.

Amendment 4 (single-implementation mandate) forbids duplication.
Amendment 5 (zero-deviation mandate) forbids silent debt. Amendment 6
forbids the broader pattern: a component that exists but is not part
of the system. Together the three amendments make "this is one
coherent unit" provable at every merge, not asserted in marketing copy.

Reference implementation: the ReguNav + Code Constitution monorepo
ships `docs/constitution/42-COHERENT-INTEGRATION-MANDATE.md`, the
meta-gate at `scripts/ci/check-coherent-integration.mjs`, and the CI
workflow at `.github/workflows/integration-coherence-alive.yml`.

## Amendment 7 — Platform meta-index (generated)

A conforming implementation MUST publish a **platform meta-index**: a
single GENERATED artefact that catalogs every named surface in the
system. The meta-index does not own data — it indexes the per-domain
canonical sources that do. Each entry is a pointer of the form
`{ kind, name, path, declared_in, depends_on }` where `declared_in[]`
cites the per-domain manifest or source file that owns the truth.

The meta-index MUST be:

1. **Generated**, never hand-edited. The conforming implementation
   ships a build script that aggregates the per-domain sources into
   the meta-index. The output filename SHOULD follow a
   `*.generated.json` convention so it is observably non-canonical.
2. **Strictly a projection.** Each entry's content beyond `kind`,
   `name`, `path`, `declared_in`, `depends_on` is forbidden. The
   meta-index never duplicates declarations.
3. **Enforced by a bijection gate** that runs on every PR and push and
   fails when:
   - the committed meta-index disagrees with a fresh build (drift),
   - any entry's `path` points at a file that does not exist,
   - any on-disk surface is missing from the meta-index, or
   - any `depends_on` reference points at an entry not in the index.

Rationale: a hand-maintained mega-manifest would become the
fragmentation it tries to solve — two facts about the same surface in
two files would violate Amendment 4 (single implementation). The
generated-projection contract is the only safe shape: per-domain
manifests own their truth; the meta-index is a deterministic view;
the bijection gate enforces both directions.

Composition: Amendment 7 stacks on top of Amendments 4, 5, and 6.
Amendment 4 forbids duplicate implementations. Amendment 5 forbids
silent debt. Amendment 6 forbids dead gates / orphan manifests /
false-green workflows. Amendment 7 makes the full system inspectable
as one unit — every component is named, every name traces back to its
canonical declaration, and every declaration projects into the index.

Reference implementation: the ReguNav + Code Constitution monorepo
ships `docs/constitution/43-PLATFORM-META-INDEX.md`, the generator at
`scripts/build/build-platform-meta-index.mjs`, the output at
`packages/manifests/src/platform-meta-index.generated.json` (354
entries across 23 kinds at first run), the schema at
`packages/manifests/src/platform-meta-index.schema.json`, the gate at
`scripts/ci/check-platform-meta-index.mjs`, and the workflow at
`.github/workflows/integration-coherence-alive.yml`.

## Amendment 8 — Constitution engine (pluggable hazard rules)

A conforming implementation MUST publish a **first-class library**
that encodes constitutional hazards as **pluggable rules** and exposes
them as a callable engine. Distinct from per-amendment structural
drift gates (which forbid declared facts on disk), the engine covers
**latent pattern hazards** — code that compiles + lints clean but
breaks at runtime under specific input shapes.

The engine MUST:

1. Live as a typed library, not a one-off script. Each rule is its
   own file under a rules registry; the registry is introspectable
   (consumers can list every rule + its severity + its motivating
   incident).
2. Expose a single call surface: `checkContent(filename, content) →
   Violation[]` that runs every applicable rule.
3. Be wired into a CI gate that runs on every PR + push and fails
   the build on any **blocker** severity. **Serious** and
   **nice-to-have** severities are advisory but must be reported.
4. Be composable — invokable programmatically by other agents,
   IDE plugins, pre-commit hooks. The same code that runs in CI
   runs at the developer's keyboard if they wire it.

Each rule MUST carry:

- a stable `rule_id`,
- a `severity` (`blocker` / `serious` / `nice-to-have`),
- an `amendment_ref` (which constitutional rule or incident it
  encodes),
- a comment in the source explaining the incident or anti-pattern
  that motivated the rule.

Adding a rule is the canonical response to a production incident:
once a hazard pattern has been identified, it becomes a permanent
mechanical check, not a tribal memory.

Composition: Amendments 4 (single impl), 5 (zero-deviation), 6
(coherent integration), 7 (meta-index) cover STRUCTURAL hazards.
Amendment 8 covers LATENT PATTERN hazards. Together the eight
amendments make the platform self-defending — incidents do not
recur because they become rules.

Reference implementation: the ReguNav + Code Constitution monorepo
ships `packages/constitution-engine/` as a first-class workspace
package with three seed rules (shell-injection-via-template-
expansion, workflow-expression-in-run-block, hardcoded-secret-
shaped-string), the gate at `scripts/ci/check-constitution-engine.mjs`,
the workflow at `.github/workflows/integration-coherence-alive.yml`,
and the locked rule at `docs/constitution/44-CONSTITUTION-ENGINE.md`.
First run: 0 blockers across 1,022 files.

## Amendment 9 — Autonomous failure loop (push-primary)

A conforming implementation MUST close the failure loop AUTOMATICALLY,
on the fly, without a human in the critical path. Specifically:

1. **Push primary.** Every workflow failure MUST emit a push event
   (repository_dispatch or equivalent webhook) carrying a self-
   contained payload that a subscribed LLM agent can act on without
   a pull roundtrip. The payload includes: workflow metadata,
   commit message + changed files, failed steps, recent logs.
2. **Pull secondary.** A read endpoint MAY exist for an already-
   active agent to fetch unbounded context, but **polling for new
   failures is forbidden** as the primary mechanism. Polling
   violates Amendment 2 (event-driven by spec, ≤30s latency).
3. **Persistent record.** The same failure context MUST be appended
   to an audit branch (e.g. `errors/`) for retrospective review by
   regulators, auditors, or later agent runs.
4. **Latency budget ≤60s** from failure detection to dispatch
   emission. Within Amendment 2's overall ≤30s for the primary
   event-driven contract; the extra 30s allows log-collection.
5. **Behind → ahead conversion.** Push is necessary but not
   sufficient. Even perfect push is post-facto: a completion event
   can only fire after the failure. There are two error horizons —
   a KNOWN bad pattern is caught *ahead* by a pre-merge gate (it
   never lands); a NOVEL pattern is caught *fast-behind* by this
   loop (it happens once). The loop MUST convert behind → ahead:
   the failure digest MUST propose a new static rule (Amendment 8)
   so the novel class is caught pre-merge thereafter. Every novel
   failure happens exactly once; a recurrence is a §0 violation
   meaning the conversion step was skipped.

**Surfacing failures to a human via email or GitHub issues is not
sufficient.** A non-developer operator cannot read 100 issues a day.
The constitution requires the system itself to wake up a subscribed
agent to read and act. Issues remain as an audit trail for humans
who want to review what happened — they are not the action channel.

Composition: Amendment 4 forbids duplicate implementations.
Amendment 5 forbids silent debt. Amendment 6 forbids dead gates.
Amendment 7 generates the inventory. Amendment 8 catches latent
pattern hazards before merge. Amendment 9 closes the loop on what
escapes — every failure becomes a push to an agent, every
recurrence becomes a new Amendment 8 rule, every audit demand
returns a complete history from the errors branch.

Reference implementation: the ReguNav + Code Constitution monorepo
ships `.github/workflows/error-collector.yml` (the push emitter), an
`/errors` branch for the persistent record, `/v1/constitution/failures`
on the Constitution Gateway as the secondary pull surface, and
`.github/workflows/autonomous-fix-agent.yml` as the subscribed-agent
template (invokes anthropics/claude-code-action@v1). Locked rule at
`docs/constitution/45-AUTONOMOUS-FAILURE-LOOP.md`.

## Future amendments

Amendments require:
1. A pull request to this file with the proposed text
2. Review by at least two named maintainers
3. A 14-day RFC window on the [issues](https://github.com/Compliance-to-Architecture/framework/issues) tracker
4. A major-version bump of the framework spec once accepted

Implementations MAY ship ahead of accepted amendments under their own
versioning, but cannot claim conformance to the framework until the
amendment is merged.

## Provenance

This constitution is the locked subset of architectural commitments
the framework spec assumes. It is intentionally short: every line
forbids a specific class of bug that has cost real customers real
money in real audits. The full rationale per amendment lives in the
[`framework`](https://github.com/Compliance-to-Architecture/framework)
repository's commit history and the [`ontology`](https://github.com/Compliance-to-Architecture/ontology) repo's
[`METHODOLOGY.md`](https://github.com/Compliance-to-Architecture/ontology/blob/main/METHODOLOGY.md).
