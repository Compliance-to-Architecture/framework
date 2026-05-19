# `@regunav/frameworks` — version manifest

This document records the version of the framework registry as a
content artefact, independent of the version of the npm package or
the repository tag.

## Current versions

| Axis              | Value      |
| ----------------- | ---------- |
| Schema version    | `1`        |
| Content version   | `0.1.0`    |
| Registry size     | 21 frameworks, 388 clauses, 283 controls, 349 questions, 79 crosswalk edges |

## What each axis means

### Schema version (`Framework.schemaVersion`)

The schema version is the integer stamped on every `Framework` module
under `packages/frameworks/src/*.ts`:

```ts
export const GDPR: Framework = {
  schemaVersion: 1,
  code: "GDPR",
  // ...
};
```

It tracks the **shape** of the framework registry. A bump implies a
breaking change to one or more of:

- the `Framework` type itself (`packages/types`)
- the `Clause`, `Control`, or `Question` types
- the `CrosswalkEdge` type
- the `EvidenceType` union
- the `RiskLevel` union
- the `FrameworkCode` union (adding codes is not a bump; removing or
  renaming one is)

Schema-version bumps are rare. They require a coordinated update of
`@regunav/types`, the registry modules, the conformance suite, and any
serialised / persisted data.

### Content version (registry-as-content)

The content version tracks **what's in** the registry — the clauses,
controls, questions, and crosswalks themselves — independent of the
shape. It follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
applied to content:

- **MAJOR** — a previously-published framework, clause, control,
  question, or crosswalk edge is **removed or renamed**, or has its
  semantic interpretation changed in a way that invalidates downstream
  evidence mappings.
- **MINOR** — a new framework, clause, control, question, or
  crosswalk edge is **added**, or an existing one is non-breakingly
  expanded (e.g. a clause description is enriched without changing its
  scope).
- **PATCH** — a typo / wording / rationale fix that does not change
  meaning.

Content-version bumps appear in `CHANGELOG.md` at the repo root, on the
same release cadence as the rest of the product. See
[`RELEASES.md`](../../RELEASES.md).

## v0.1.0 content summary

Released alongside the `v0.1.0` repository tag. First milestone with
all 21 frameworks fully populated.

### Frameworks (21)

`EU_AI_ACT`, `ISO_42001`, `ISO_27001`, `ISO_27701`, `GDPR`, `HIPAA`,
`SOC_2`, `SOC_1`, `PCI_DSS`, `NIST_AI_RMF`, `NIST_CSF`, `DORA`,
`CCPA`, `NIS2`, `EU_CRA`, `DPDP_INDIA`, `LGPD_BRAZIL`, `PIPL_CHINA`,
`APPI_JAPAN`, `PRIVACY_ACT_AU`, `UK_GDPR`.

Per-framework counts are in [`../../CHANGELOG.md`](../../CHANGELOG.md)
under the `0.1.0` entry.

### Crosswalk graph (79 edges)

Pair coverage:

- GDPR <-> UK GDPR
- GDPR <-> ISO/IEC 27701 (anchored on ISO 27701 Annex C)
- GDPR <-> ISO/IEC 27001:2022
- GDPR <-> NIS2
- GDPR <-> DORA
- GDPR <-> HIPAA
- GDPR <-> privacy family (LGPD, PIPL, APPI, DPDP, Privacy Act AU, CCPA)
- EU AI Act <-> ISO/IEC 42001
- EU AI Act <-> NIST AI RMF
- ISO/IEC 27001 <-> SOC 2
- NIST CSF <-> ISO/IEC 27001
- PCI DSS <-> ISO/IEC 27001

### Conformance

The registry passes all 16 invariants of
`packages/frameworks/test/conformance.test.mjs`. See the
`Framework conformance test suite` section of the root `CHANGELOG.md`
for the invariant list.

## How to consume the version

Programmatic consumers should:

1. **Check `Framework.schemaVersion` per framework** before assuming
   the shape of clauses / controls / questions. A mismatch with the
   shape your client was compiled against is a hard error.
2. **Treat the registry content as data**, not as code. Cache by
   content version. When the content version's MAJOR digit changes,
   re-fetch and re-map evidence anchors.
3. **Prefer `clauseRef` and `controlRef` strings** as stable
   identifiers. They are deliberately the natural-language citation
   (e.g. `Art. 32`, `Annex A.5`, `CC6`) and are unique within a
   framework (conformance invariants I6 and I8).

## History

| Version | Date       | Notes                                                       |
| ------- | ---------- | ----------------------------------------------------------- |
| 0.1.0   | 2026-05-16 | First populated release. 21 frameworks, 79 crosswalk edges. |
