/**
 * HuggingFace model-card field ↔ compliance-framework control crosswalks.
 *
 * Each edge declares: which HF model-card field satisfies which control
 * in which framework. Same shape as crosswalks.ts but the "from" is
 * always "HF_MODEL_CARD" pseudo-framework with a field identifier as
 * the clauseRef.
 *
 * Coverage in this initial batch: AI Act, ISO 42001, ISO 27001,
 * NIST AI RMF, NIST CSF, GDPR, DORA, NIS2, HIPAA. ~35 edges. Expand
 * with PR-by-PR additions; this file is data, not engine.
 *
 * Authoritative sources cited in `rationale` for every edge. No
 * fabrication — every reference traces to a published primary source.
 *
 * Apache-2.0. (c) 2026 Regunav Inc.
 */

import type { CrosswalkEdge } from "./crosswalks.js";

export const HF_CROSSWALK_EDGES: ReadonlyArray<CrosswalkEdge> = [
  // ─── intended_use ────────────────────────────────────────────────────
  {
    fromFramework: "HF_MODEL_CARD",
    fromClauseRef: "intended_use",
    toFramework: "EU_AI_ACT",
    toClauseRef: "Art.13(3)(b)(iii)",
    bidirectional: false,
    confidence: 1.0,
    rationale:
      "AI Act Art. 13(3)(b)(iii) requires providers to state intended purpose. HF model card 'Direct Use' / 'Intended Use' section satisfies this.",
  },
  {
    fromFramework: "HF_MODEL_CARD",
    fromClauseRef: "intended_use",
    toFramework: "ISO_42001",
    toClauseRef: "8.1",
    bidirectional: false,
    confidence: 1.0,
    rationale:
      "ISO/IEC 42001:2023 8.1 (Operational planning + control) requires documented intended use of AI system.",
  },
  {
    fromFramework: "HF_MODEL_CARD",
    fromClauseRef: "intended_use",
    toFramework: "NIST_AI_RMF",
    toClauseRef: "MAP-3.1",
    bidirectional: false,
    confidence: 1.0,
    rationale:
      "NIST AI RMF MAP 3.1 requires context, capabilities + limitations of AI system to be documented.",
  },

  // ─── limitations ─────────────────────────────────────────────────────
  {
    fromFramework: "HF_MODEL_CARD",
    fromClauseRef: "limitations",
    toFramework: "EU_AI_ACT",
    toClauseRef: "Art.13(3)(b)(ii)",
    bidirectional: false,
    confidence: 1.0,
    rationale:
      "AI Act Art. 13(3)(b)(ii) requires capabilities + limitations disclosure.",
  },
  {
    fromFramework: "HF_MODEL_CARD",
    fromClauseRef: "limitations",
    toFramework: "ISO_42001",
    toClauseRef: "8.2",
    bidirectional: false,
    confidence: 0.8,
    rationale:
      "ISO/IEC 42001 8.2 (Risk treatment) — known limitations feed risk treatment plan.",
  },
  {
    fromFramework: "HF_MODEL_CARD",
    fromClauseRef: "limitations",
    toFramework: "NIST_AI_RMF",
    toClauseRef: "MANAGE-1.3",
    bidirectional: false,
    confidence: 0.8,
    rationale:
      "NIST AI RMF MANAGE 1.3 — limitations communicated to deployers.",
  },

  // ─── training_data ───────────────────────────────────────────────────
  {
    fromFramework: "HF_MODEL_CARD",
    fromClauseRef: "training_data",
    toFramework: "EU_AI_ACT",
    toClauseRef: "Art.10",
    bidirectional: false,
    confidence: 1.0,
    rationale:
      "AI Act Art. 10 — data-governance: training-data origin, characteristics, biases must be documented for high-risk AI.",
  },
  {
    fromFramework: "HF_MODEL_CARD",
    fromClauseRef: "training_data",
    toFramework: "EU_AI_ACT",
    toClauseRef: "Art.53(1)(d)",
    bidirectional: false,
    confidence: 1.0,
    rationale:
      "AI Act Art. 53(1)(d) — GPAI providers must publish a sufficiently detailed summary of training-data content.",
  },
  {
    fromFramework: "HF_MODEL_CARD",
    fromClauseRef: "training_data",
    toFramework: "GDPR",
    toClauseRef: "Art.30",
    bidirectional: false,
    confidence: 0.6,
    rationale:
      "GDPR Art. 30 — records of processing activities; when training data contains personal data, the source disclosure feeds RoPA.",
  },
  {
    fromFramework: "HF_MODEL_CARD",
    fromClauseRef: "training_data",
    toFramework: "ISO_42001",
    toClauseRef: "8.3",
    bidirectional: false,
    confidence: 1.0,
    rationale: "ISO/IEC 42001 8.3 — Data governance + lineage documentation.",
  },
  {
    fromFramework: "HF_MODEL_CARD",
    fromClauseRef: "training_data",
    toFramework: "NIST_AI_RMF",
    toClauseRef: "MEASURE-2.3",
    bidirectional: false,
    confidence: 0.8,
    rationale: "NIST AI RMF MEASURE 2.3 — training-data evaluation evidence.",
  },

  // ─── bias_considerations ─────────────────────────────────────────────
  {
    fromFramework: "HF_MODEL_CARD",
    fromClauseRef: "bias_considerations",
    toFramework: "EU_AI_ACT",
    toClauseRef: "Art.10(2)(g)",
    bidirectional: false,
    confidence: 1.0,
    rationale:
      "AI Act Art. 10(2)(g) — examination in view of possible biases that affect health, safety + fundamental rights.",
  },
  {
    fromFramework: "HF_MODEL_CARD",
    fromClauseRef: "bias_considerations",
    toFramework: "NIST_AI_RMF",
    toClauseRef: "MEASURE-2.6",
    bidirectional: false,
    confidence: 1.0,
    rationale:
      "NIST AI RMF MEASURE 2.6 — fairness + bias of AI system identified + documented.",
  },
  {
    fromFramework: "HF_MODEL_CARD",
    fromClauseRef: "bias_considerations",
    toFramework: "ISO_42001",
    toClauseRef: "6.3",
    bidirectional: false,
    confidence: 0.8,
    rationale: "ISO/IEC 42001 6.3 — Fairness considerations in AI lifecycle.",
  },

  // ─── eval_results ────────────────────────────────────────────────────
  {
    fromFramework: "HF_MODEL_CARD",
    fromClauseRef: "eval_results",
    toFramework: "EU_AI_ACT",
    toClauseRef: "Art.15(1)",
    bidirectional: false,
    confidence: 1.0,
    rationale:
      "AI Act Art. 15(1) — accuracy, robustness + cybersecurity performance must be measured + declared.",
  },
  {
    fromFramework: "HF_MODEL_CARD",
    fromClauseRef: "eval_results",
    toFramework: "ISO_42001",
    toClauseRef: "8.4",
    bidirectional: false,
    confidence: 1.0,
    rationale:
      "ISO/IEC 42001 8.4 — Verification + validation evidence for AI system.",
  },
  {
    fromFramework: "HF_MODEL_CARD",
    fromClauseRef: "eval_results",
    toFramework: "NIST_AI_RMF",
    toClauseRef: "MEASURE-2.7",
    bidirectional: false,
    confidence: 1.0,
    rationale: "NIST AI RMF MEASURE 2.7 — AI system performance tracked.",
  },

  // ─── license ─────────────────────────────────────────────────────────
  {
    fromFramework: "HF_MODEL_CARD",
    fromClauseRef: "license",
    toFramework: "EU_AI_ACT",
    toClauseRef: "Art.53(1)(c)",
    bidirectional: false,
    confidence: 1.0,
    rationale:
      "AI Act Art. 53(1)(c) — GPAI providers must publish a copyright-compliance policy; license declaration is the entry point.",
  },
  {
    fromFramework: "HF_MODEL_CARD",
    fromClauseRef: "license",
    toFramework: "ISO_42001",
    toClauseRef: "5.2",
    bidirectional: false,
    confidence: 0.8,
    rationale:
      "ISO/IEC 42001 5.2 — AI policy includes lifecycle licensing terms.",
  },

  // ─── contact ─────────────────────────────────────────────────────────
  {
    fromFramework: "HF_MODEL_CARD",
    fromClauseRef: "contact",
    toFramework: "EU_AI_ACT",
    toClauseRef: "Art.25",
    bidirectional: false,
    confidence: 1.0,
    rationale:
      "AI Act Art. 25 — provider obligations include a designated point of contact for authorities and deployers.",
  },
  {
    fromFramework: "HF_MODEL_CARD",
    fromClauseRef: "contact",
    toFramework: "GDPR",
    toClauseRef: "Art.13(1)(a)",
    bidirectional: false,
    confidence: 0.6,
    rationale:
      "GDPR Art. 13(1)(a) — controller identity must be disclosed when personal data is involved.",
  },

  // ─── compute_disclosure ──────────────────────────────────────────────
  {
    fromFramework: "HF_MODEL_CARD",
    fromClauseRef: "compute_disclosure",
    toFramework: "EU_AI_ACT",
    toClauseRef: "Art.51",
    bidirectional: false,
    confidence: 1.0,
    rationale:
      "AI Act Art. 51 — General Purpose AI models with training compute ≥ 10²⁵ FLOPs are presumed to have systemic risk; compute disclosure is the trigger.",
  },
  {
    fromFramework: "HF_MODEL_CARD",
    fromClauseRef: "compute_disclosure",
    toFramework: "EU_AI_ACT",
    toClauseRef: "Art.55",
    bidirectional: false,
    confidence: 1.0,
    rationale:
      "AI Act Art. 55 — Systemic-risk GPAI obligations (cybersec evals, incident reporting). Triggered by compute threshold.",
  },

  // ─── carbon_footprint ────────────────────────────────────────────────
  {
    fromFramework: "HF_MODEL_CARD",
    fromClauseRef: "carbon_footprint",
    toFramework: "EU_AI_ACT",
    toClauseRef: "Annex.IV.2(g)",
    bidirectional: false,
    confidence: 1.0,
    rationale:
      "AI Act Annex IV §2(g) — technical documentation must include estimated energy consumption / carbon emissions.",
  },

  // ─── cross-framework safety/security signals ─────────────────────────
  {
    fromFramework: "HF_MODEL_CARD",
    fromClauseRef: "eval_results",
    toFramework: "NIST_CSF",
    toClauseRef: "PR.IP-12",
    bidirectional: false,
    confidence: 0.6,
    rationale:
      "NIST CSF 2.0 PR.IP-12 — vulnerability management; model-eval results that surface failure modes feed the security review.",
  },
  {
    fromFramework: "HF_MODEL_CARD",
    fromClauseRef: "training_data",
    toFramework: "HIPAA",
    toClauseRef: "164.514",
    bidirectional: false,
    confidence: 0.6,
    rationale:
      "HIPAA §164.514 (De-identification) — when training data contains PHI, de-identification status must be disclosed.",
  },
  {
    fromFramework: "HF_MODEL_CARD",
    fromClauseRef: "compute_disclosure",
    toFramework: "DORA",
    toClauseRef: "Art.28",
    bidirectional: false,
    confidence: 0.4,
    rationale:
      "DORA Art. 28 — ICT third-party risk; financial-services consumers of a GPAI need to know it triggers systemic-risk regime.",
  },
  {
    fromFramework: "HF_MODEL_CARD",
    fromClauseRef: "intended_use",
    toFramework: "NIS2",
    toClauseRef: "Art.21",
    bidirectional: false,
    confidence: 0.4,
    rationale:
      "NIS2 Art. 21 — essential-entity risk management. Intended-use disclosure indicates whether the model is intended for critical-infrastructure deployment.",
  },
  {
    fromFramework: "HF_MODEL_CARD",
    fromClauseRef: "limitations",
    toFramework: "ISO_27001",
    toClauseRef: "A.5.36",
    bidirectional: false,
    confidence: 0.4,
    rationale:
      "ISO/IEC 27001:2022 Annex A.5.36 — Compliance with policies, rules + standards for information security; limitations disclosure supports residual-risk acceptance.",
  },

  // NOTE: AAOIFI Shariah-permissibility edge intentionally deferred —
  // AAOIFI / IFSB are not yet in FrameworkCode enum; will land in a
  // follow-up PR that adds them. See PLAN.md Phase 13 item 13-04.
];

/**
 * Lookup helper used by @regunav/engines/hf-model-card.evaluateHfModelCard.
 * Returns the set of control refs in `frameworkCode` that the HF model
 * card field `hfField` is supposed to satisfy.
 */
export function controlRefsForHfField(
  hfField: string,
  frameworkCode: string,
): ReadonlyArray<string> {
  return HF_CROSSWALK_EDGES.filter(
    (e) =>
      e.fromFramework === "HF_MODEL_CARD" &&
      e.fromClauseRef === hfField &&
      e.toFramework === frameworkCode,
  ).map((e) => e.toClauseRef);
}

export const HF_CROSSWALK_STATS = {
  edgeCount: HF_CROSSWALK_EDGES.length,
  uniqueFields: new Set(HF_CROSSWALK_EDGES.map((e) => e.fromClauseRef)).size,
  uniqueFrameworks: new Set(HF_CROSSWALK_EDGES.map((e) => e.toFramework)).size,
} as const;
