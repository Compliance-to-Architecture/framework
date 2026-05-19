<div align="center">

# Compliance-to-Architecture / framework

**The Compliance-to-Architecture Framework™ — open spec + 25 framework dictionaries + crosswalks.**

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0) [![Status](https://img.shields.io/badge/status-public%20OSS-brightgreen.svg)](#) [![Spec](https://img.shields.io/badge/spec-v0.1-orange.svg)](#) [![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#) [![Frameworks](https://img.shields.io/badge/frameworks-25-success.svg)](#) [![Apache-2.0](https://img.shields.io/badge/Apache-2.0-blue.svg)](LICENSE)

</div>

---

## Frameworks shipped

EU AI Act · ISO/IEC 42001 · ISO/IEC 27001 · ISO/IEC 27701 · GDPR · UK GDPR · HIPAA · SOC 2 · SOC 1 · PCI DSS · NIST AI RMF · NIST CSF · DORA · NIS2 · EU CRA · CCPA · LGPD (Brazil) · DPDP (India) · PIPL (China) · APPI (Japan) · Privacy Act (AU) · HF model-card.

## What `src/` contains

Each `src/<framework>.ts` exports a typed Framework object with `clauses`, `controls`, `questions`, and `referenceUrl` to the regulator-published source.

## What `src/crosswalks.ts` contains

Typed edges between control IDs across frameworks. Adding a new framework is one PR — point your control IDs at the matching peers.

## Compile targets

Policy-as-code compile targets: **Cerbos**, **OPA / Rego**, **AWS Cedar**. Each control resolves to a policy snippet referenced from the catalogue.

---

## Sibling repos

| Repo | What |
| --- | --- |
| [`framework`](https://github.com/Compliance-to-Architecture/framework) | 25 framework dictionaries + crosswalks + policy-as-code compile targets |
| [`ontology`](https://github.com/Compliance-to-Architecture/ontology) | JSON-LD ontology + schemas + IaC examples |
| [`sector-packs`](https://github.com/Compliance-to-Architecture/sector-packs) | Maritime / legal / oil-and-gas vertical bundles |
| [`dictionaries`](https://github.com/Compliance-to-Architecture/dictionaries) | Canonical taxonomies (8 JSON dictionaries) |
| [`playbooks`](https://github.com/Compliance-to-Architecture/playbooks) | Skill files + worked examples |

## Provenance

Maintained by Regunav Inc. Apache-2.0 contributions welcome — by contributing you agree your contribution is Apache-2.0.

[![Site](https://img.shields.io/badge/compliancetoarchitecture.com-→-1F6FEB.svg)](https://compliancetoarchitecture.com)
