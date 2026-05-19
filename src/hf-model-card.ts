/**
 * @regunav/frameworks/hf-model-card — pseudo-framework entry for the
 * HuggingFace Model Card spec.
 *
 * This isn't a regulatory framework in the AAOIFI / ISO / NIST sense —
 * it's a documentation spec maintained by HuggingFace. We register it
 * as a Framework so it can appear as the `fromFramework` in crosswalk
 * edges (HF model card field → real-framework control), keeping the
 * crosswalk graph homogeneous.
 *
 * Clauses = the 9 canonical fields from
 * @regunav/engines/hf-model-card HF_REQUIRED_FIELDS. Controls + questions
 * intentionally empty — the engine handles the rest.
 *
 * Apache-2.0. (c) 2026 Regunav Inc.
 */

import type { Framework } from "@regunav/types";

export const HF_MODEL_CARD: Framework = {
  code: "HF_MODEL_CARD",
  name: "HuggingFace Model Card",
  version: "2024.04",
  description:
    "HuggingFace Model Card specification — the conventional README.md + YAML frontmatter fields used to describe a model on the HF Hub. Used as the source side of crosswalk edges that map model-card fields to compliance-framework controls (AI Act Art. 13, ISO 42001 8.1, NIST AI RMF MAP-3.1, etc.).",
  jurisdiction: ["GLOBAL"],
  referenceUrl: "https://huggingface.co/docs/hub/model-cards",
  schemaVersion: 1,
  clauses: [
    {
      clauseRef: "intended_use",
      title: "Direct / Intended Use",
      description:
        "Section describing what the model is intended to be used for.",
      mandatory: true,
    },
    {
      clauseRef: "limitations",
      title: "Limitations and Risks",
      description:
        "Section describing known limitations, failure modes, and risks.",
      mandatory: true,
    },
    {
      clauseRef: "training_data",
      title: "Training Data",
      description:
        "Section describing the data the model was trained on, including sources and licensing.",
      mandatory: true,
    },
    {
      clauseRef: "bias_considerations",
      title: "Bias, Risks, and Ethical Considerations",
      description:
        "Section discussing biases identified in the training data or model outputs.",
      mandatory: true,
    },
    {
      clauseRef: "eval_results",
      title: "Evaluation Results",
      description:
        "Section reporting benchmark / evaluation metrics for the model.",
      mandatory: true,
    },
    {
      clauseRef: "license",
      title: "License",
      description:
        "License declaration in YAML frontmatter (`license:` key) or a markdown License section.",
      mandatory: true,
    },
    {
      clauseRef: "contact",
      title: "Contact / Authors",
      description:
        "Section identifying responsible parties for the model.",
      mandatory: true,
    },
    {
      clauseRef: "compute_disclosure",
      title: "Training Compute Disclosure",
      description:
        "Section disclosing training compute (FLOPs, GPU-hours) — relevant to AI Act GPAI threshold.",
      mandatory: true,
    },
    {
      clauseRef: "carbon_footprint",
      title: "Carbon Footprint",
      description:
        "Section disclosing CO2-equivalent emissions — AI Act Annex IV §2(g).",
      mandatory: true,
    },
  ],
  controls: [],
  questions: [],
};
