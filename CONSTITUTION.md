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
