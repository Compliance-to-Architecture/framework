/**
 * @regunav/frameworks — multi-framework dictionary registry
 *   V1   : 13 frameworks (EU AI Act / ISO 42001/27001/27701 / GDPR / HIPAA /
 *          SOC 2 / SOC 1 / PCI DSS / NIST AI RMF / NIST CSF / DORA / CCPA)
 *   V1.5 : 8 sectoral + global authorities added (NIS2 / EU CRA / India DPDP /
 *          Brazil LGPD / China PIPL / Japan APPI / Australia Privacy Act /
 *          UK GDPR + DPA 2018)
 *
 * Apache-2.0. Copyright (c) 2026 Regunav Inc.
 */
import type { Framework, FrameworkCode } from "@regunav/types";

import { EU_AI_ACT } from "./eu-ai-act.js";
import { ISO_42001 } from "./iso-42001.js";
import { ISO_27001 } from "./iso-27001.js";
import { ISO_27701 } from "./iso-27701.js";
import { GDPR } from "./gdpr.js";
import { HIPAA } from "./hipaa.js";
import { SOC_2 } from "./soc-2.js";
import { SOC_1 } from "./soc-1.js";
import { PCI_DSS } from "./pci-dss.js";
import { NIST_AI_RMF } from "./nist-ai-rmf.js";
import { NIST_CSF } from "./nist-csf.js";
import { DORA } from "./dora.js";
import { CCPA } from "./ccpa.js";
import { NIS2 } from "./nis2.js";
import { EU_CRA } from "./eu-cra.js";
import { DPDP_INDIA } from "./dpdp-india.js";
import { LGPD_BRAZIL } from "./lgpd-brazil.js";
import { PIPL_CHINA } from "./pipl-china.js";
import { APPI_JAPAN } from "./appi-japan.js";
import { PRIVACY_ACT_AU } from "./privacy-act-au.js";
import { UK_GDPR } from "./uk-gdpr.js";
import { HF_MODEL_CARD } from "./hf-model-card.js";

export const FRAMEWORK_REGISTRY: Readonly<Record<FrameworkCode, Framework>> = {
  EU_AI_ACT,
  ISO_42001,
  ISO_27001,
  ISO_27701,
  GDPR,
  HIPAA,
  SOC_2,
  SOC_1,
  PCI_DSS,
  NIST_AI_RMF,
  NIST_CSF,
  DORA,
  CCPA,
  NIS2,
  EU_CRA,
  DPDP_INDIA,
  LGPD_BRAZIL,
  PIPL_CHINA,
  APPI_JAPAN,
  PRIVACY_ACT_AU,
  UK_GDPR,
  HF_MODEL_CARD,
};

export function getFramework(code: FrameworkCode): Framework {
  return FRAMEWORK_REGISTRY[code];
}

export function getAllFrameworks(): readonly Framework[] {
  return Object.values(FRAMEWORK_REGISTRY);
}

export function getFrameworkCodes(): readonly FrameworkCode[] {
  return Object.keys(FRAMEWORK_REGISTRY) as FrameworkCode[];
}

export type { Framework, FrameworkCode } from "@regunav/types";

export {
  CROSSWALKS,
  crosswalksFrom,
  crosswalksBetween,
  type CrosswalkEdge,
} from "./crosswalks.js";

// ─── HF Model Card crosswalks (Phase 13) ──────────────────────────────────
export {
  HF_CROSSWALK_EDGES,
  controlRefsForHfField,
  HF_CROSSWALK_STATS,
} from "./crosswalks-hf.js";
