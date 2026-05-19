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
