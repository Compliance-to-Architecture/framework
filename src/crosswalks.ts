import type { FrameworkCode } from "@regunav/types";

/**
 * Cross-framework crosswalk edges.
 *
 * Each edge declares that the FROM clause and the TO clause address the
 * same underlying control objective, with a confidence score:
 *
 *   1.0  — verbatim equivalent / one clause is a direct restatement
 *   0.8  — substantive equivalent / same objective, different wording
 *   0.6  — substantial overlap / one is a proper subset of the other
 *   0.4  — partial overlap / both touch the topic but differ materially
 *
 * Edges are intended to support:
 *   - "if I've evidenced GDPR Art. 32, what does that buy me elsewhere?"
 *   - control-pack synthesis across multi-framework certifications
 *   - the implicit-coverage inference in graph-engine
 *
 * Edges are STRUCTURAL references, not legal advice. Two clauses may
 * have the same objective yet differ on prescriptive detail (e.g.,
 * GDPR Art. 32 vs ISO 27001 A.5.10). The crosswalk is a starting point
 * for an auditor's evidence-mapping exercise, not a substitute for it.
 * See packages/ontology/LEGAL_DISCLAIMER.md.
 *
 * Sources for the published mappings:
 *   - ISO/IEC 27701:2019 Annex C (GDPR → 27701 → 27001)
 *   - ISO/IEC 27001:2022 + ISO/IEC 27017 + ISO/IEC 27018 control mappings
 *   - NIST CSF 2.0 informative references
 *   - NIST AI RMF 1.0 crosswalk to ISO/IEC 42001
 *   - EU AI Act + ISO/IEC 42001 alignment notes (JTC1/SC42 reports)
 *   - UK ICO "International data transfers" + post-Brexit UK-GDPR-vs-EU-GDPR analysis
 *   - SOC 2 ↔ ISO 27001 published crosswalks (AICPA + ISO)
 */

export interface CrosswalkEdge {
  readonly fromFramework: FrameworkCode;
  readonly fromClauseRef: string;
  readonly toFramework: FrameworkCode;
  readonly toClauseRef: string;
  /**
   * If true, the mapping is symmetric — evidencing either clause is
   * presumed to evidence the other. If false, the FROM clause is a
   * subset of (or implies) the TO clause but not vice versa.
   */
  readonly bidirectional: boolean;
  readonly confidence: number;
  readonly rationale: string;
}

// ─── GDPR ↔ UK GDPR ─────────────────────────────────────────────────────────
// The UK_GDPR module is a *delta* module — it captures the UK-specific
// divergences (ICO procedures, IDTA, DPA 2018, ICO codes), not the verbatim
// retention of EU GDPR Arts 5/6/7/32. Crosswalks therefore use the explicit
// UK GDPR clauseRefs that exist in the module.

const GDPR_UK_GDPR: readonly CrosswalkEdge[] = [
  { fromFramework: "GDPR", fromClauseRef: "Art. 5",  toFramework: "UK_GDPR", toClauseRef: "Records mgmt + accountability (UK GDPR Art. 5(2) + DPA 2018)", bidirectional: true,  confidence: 1.0, rationale: "UK GDPR Art. 5 is a verbatim retention of EU GDPR Art. 5 (principles); accountability under Art. 5(2) is supplemented by DPA 2018 records-management duties." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 33", toFramework: "UK_GDPR", toClauseRef: "UK GDPR Art. 33", bidirectional: true,  confidence: 1.0, rationale: "Notification of personal-data breach to the supervisory authority — UK ICO substituted." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 35", toFramework: "UK_GDPR", toClauseRef: "UK GDPR Art. 35", bidirectional: true,  confidence: 1.0, rationale: "DPIA obligation identical; UK ICO's mandatory-DPIA list applies." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 44", toFramework: "UK_GDPR", toClauseRef: "UK GDPR Art. 46", bidirectional: false, confidence: 0.6, rationale: "International transfers — UK uses IDTA / addendum to EU SCCs and UK-specific adequacy regulations; structurally aligned but transfer instruments differ." },
];

// ─── GDPR ↔ ISO/IEC 27701 ──────────────────────────────────────────────────
// ISO 27701 Annex C provides the authoritative mapping. Selected high-impact
// pairs below; the full Annex C table is the canonical reference.

const GDPR_ISO_27701: readonly CrosswalkEdge[] = [
  { fromFramework: "GDPR", fromClauseRef: "Art. 5",  toFramework: "ISO_27701", toClauseRef: "Cl. 5.2",  bidirectional: true,  confidence: 0.8, rationale: "ISO 27701 7.2.1 'identify and document purpose' instantiates GDPR Art. 5(1)(b) purpose limitation + Art. 5(1)(a) lawfulness." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 6",  toFramework: "ISO_27701", toClauseRef: "Cl. 5.3",  bidirectional: true,  confidence: 0.8, rationale: "ISO 27701 7.2.2 'identify lawful basis' = GDPR Art. 6 lawful basis identification." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 7",  toFramework: "ISO_27701", toClauseRef: "Cl. 5.4",  bidirectional: true,  confidence: 0.8, rationale: "ISO 27701 7.2.3 'determine when and how consent is to be obtained' = GDPR Art. 7 consent conditions." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 30", toFramework: "ISO_27701", toClauseRef: "Cl. 5.7",  bidirectional: true,  confidence: 0.8, rationale: "ISO 27701 7.2.8 'records related to processing PII' = GDPR Art. 30 records of processing activities." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 32", toFramework: "ISO_27701", toClauseRef: "Cl. 6",    bidirectional: true,  confidence: 0.8, rationale: "ISO 27701 extends ISO 27001 Annex A controls — Art. 32 'appropriate technical and organisational measures' maps to the full Annex A as augmented by 27701 (the Annex C explicit mapping)." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 33", toFramework: "ISO_27701", toClauseRef: "Cl. 6", bidirectional: true, confidence: 0.6, rationale: "ISO 27701 augments ISO 27001 A.16.1.4 'assessment of and decision on information security events' with PII-breach-notification triggers per Art. 33." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 35", toFramework: "ISO_27701", toClauseRef: "Cl. 5.5",  bidirectional: true,  confidence: 0.8, rationale: "ISO 27701 7.2.5 'PII protection impact assessment' = GDPR Art. 35 DPIA." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 37", toFramework: "ISO_27701", toClauseRef: "Cl. 6", bidirectional: true, confidence: 0.8, rationale: "ISO 27701 6.3.1.1 'a person or persons responsible for privacy' = GDPR Art. 37 DPO designation." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 44", toFramework: "ISO_27701", toClauseRef: "Cl. 7",    bidirectional: true,  confidence: 0.8, rationale: "ISO 27701 7.5 'PII sharing, transfer, and disclosure' = GDPR Chapter V cross-border transfer regime." },
];

// ─── GDPR ↔ ISO/IEC 27001 ──────────────────────────────────────────────────
// 27001 covers technical+organisational security; the GDPR Art. 32 mapping is
// the canonical anchor. 27001:2022 Annex A renumbering reflected.

const GDPR_ISO_27001: readonly CrosswalkEdge[] = [
  { fromFramework: "GDPR", fromClauseRef: "Art. 32", toFramework: "ISO_27001", toClauseRef: "Annex A.5",   bidirectional: false, confidence: 0.6, rationale: "Information-security policies — required organisational control supporting GDPR's 'appropriate measures' under Art. 32." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 32", toFramework: "ISO_27001", toClauseRef: "Annex A.5",  bidirectional: false, confidence: 0.8, rationale: "Acceptable use of information and other associated assets — directly supports Art. 32 measures against unauthorised use." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 32", toFramework: "ISO_27001", toClauseRef: "Annex A.5",  bidirectional: false, confidence: 0.8, rationale: "Access control — directly evidences Art. 32(1)(b) 'ongoing confidentiality, integrity, availability'." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 32", toFramework: "ISO_27001", toClauseRef: "Annex A.5",  bidirectional: false, confidence: 0.6, rationale: "Privacy and protection of PII — explicit privacy-protection control added in 27001:2022." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 32", toFramework: "ISO_27001", toClauseRef: "Annex A.8",  bidirectional: false, confidence: 0.8, rationale: "Use of cryptography — evidences Art. 32(1)(a) 'pseudonymisation and encryption of personal data'." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 33", toFramework: "ISO_27001", toClauseRef: "Annex A.5",  bidirectional: false, confidence: 0.8, rationale: "Information security incident management planning + preparation — operational backbone for Art. 33 notification." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 33", toFramework: "ISO_27001", toClauseRef: "Annex A.5",  bidirectional: false, confidence: 0.8, rationale: "Assessment and decision on information security events — feeds the 72-hour notification clock." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 25", toFramework: "ISO_27001", toClauseRef: "Annex A.8",  bidirectional: false, confidence: 0.6, rationale: "Secure development life cycle — provides the SDLC discipline that Art. 25 'data protection by design and by default' assumes." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 28", toFramework: "ISO_27001", toClauseRef: "Annex A.5",  bidirectional: false, confidence: 0.8, rationale: "Information security in supplier relationships — supports Art. 28 processor agreement + due-diligence obligations." },
];

// ─── GDPR ↔ NIS2 ───────────────────────────────────────────────────────────

const GDPR_NIS2: readonly CrosswalkEdge[] = [
  { fromFramework: "GDPR", fromClauseRef: "Art. 32", toFramework: "NIS2", toClauseRef: "Art. 21", bidirectional: false, confidence: 0.6, rationale: "NIS2 Art. 21 cybersecurity-risk-management measures overlap with GDPR Art. 32 — but NIS2 applies to network + information systems availability irrespective of personal data." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 33", toFramework: "NIS2", toClauseRef: "Art. 23", bidirectional: false, confidence: 0.6, rationale: "NIS2 Art. 23 incident-notification (24h early warning / 72h notification / 1-month final report) timing-aligned with but distinct from GDPR Art. 33; the same incident may trigger both." },
];

// ─── GDPR ↔ DORA ───────────────────────────────────────────────────────────

const GDPR_DORA: readonly CrosswalkEdge[] = [
  { fromFramework: "GDPR", fromClauseRef: "Art. 32", toFramework: "DORA", toClauseRef: "Art. 9",  bidirectional: false, confidence: 0.6, rationale: "DORA Art. 9 ICT systems, protocols and tools — finance-sector-specific elaboration of Art. 32 security measures." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 32", toFramework: "DORA", toClauseRef: "Art. 11", bidirectional: false, confidence: 0.6, rationale: "DORA Art. 11 response and recovery — ICT business continuity supports GDPR Art. 32(1)(c) availability + integrity restoration." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 28", toFramework: "DORA", toClauseRef: "Art. 28", bidirectional: false, confidence: 0.8, rationale: "DORA Art. 28 + 30 third-party ICT-service provider risk + contractual arrangements — financial-sector-specific elaboration of GDPR Art. 28 processor due-diligence." },
];

// ─── GDPR ↔ HIPAA ──────────────────────────────────────────────────────────

const GDPR_HIPAA: readonly CrosswalkEdge[] = [
  { fromFramework: "GDPR", fromClauseRef: "Art. 9",  toFramework: "HIPAA", toClauseRef: "§164.502", bidirectional: false, confidence: 0.6, rationale: "Health-data special-category protection — GDPR Art. 9 + HIPAA Privacy Rule §164.502 use-and-disclosure restrictions on PHI overlap; HIPAA additionally requires authorization for non-TPO uses." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 32", toFramework: "HIPAA", toClauseRef: "§164.308", bidirectional: false, confidence: 0.6, rationale: "Security Rule Administrative Safeguards — overlap with GDPR Art. 32 'appropriate technical and organisational measures' for health data." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 32", toFramework: "HIPAA", toClauseRef: "§164.312", bidirectional: false, confidence: 0.6, rationale: "Security Rule Technical Safeguards — overlap with GDPR Art. 32 encryption + access-control measures." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 33", toFramework: "HIPAA", toClauseRef: "§164.404", bidirectional: false, confidence: 0.6, rationale: "Breach-notification — HIPAA Breach Notification Rule §164.404 (individuals) + §164.408 (HHS) overlaps with GDPR Art. 33 + 34 but timing differs (60 days vs 72 hours)." },
];

// ─── GDPR ↔ LGPD / DPDP / PIPL / APPI / Privacy-Act-AU / CCPA ──────────────

const GDPR_PRIVACY_FAMILY: readonly CrosswalkEdge[] = [
  // GDPR ↔ LGPD (Brazil)
  { fromFramework: "GDPR", fromClauseRef: "Art. 5",  toFramework: "LGPD_BRAZIL",   toClauseRef: "Art. 6",  bidirectional: true,  confidence: 0.8, rationale: "LGPD Art. 6 processing principles — substantive equivalent of GDPR Art. 5, with 'good faith' as an additional principle." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 6",  toFramework: "LGPD_BRAZIL",   toClauseRef: "Art. 7",  bidirectional: true,  confidence: 0.8, rationale: "LGPD Art. 7 lawful bases — ten bases (vs GDPR's six); GDPR Art. 6 list is fully covered." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 32", toFramework: "LGPD_BRAZIL",   toClauseRef: "Art. 46-49", bidirectional: true,  confidence: 0.8, rationale: "LGPD Art. 46 security measures — substantive equivalent of GDPR Art. 32." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 33", toFramework: "LGPD_BRAZIL",   toClauseRef: "Art. 48", bidirectional: false, confidence: 0.6, rationale: "LGPD Art. 48 ANPD notification of security incidents — overlaps but no fixed 72-hour clock; 'reasonable time' standard." },
  // GDPR ↔ DPDP India
  { fromFramework: "GDPR", fromClauseRef: "Art. 6",  toFramework: "DPDP_INDIA",    toClauseRef: "§7",   bidirectional: false, confidence: 0.6, rationale: "DPDP s. 7 legitimate uses are narrower than GDPR Art. 6 — consent is the default with limited exemptions." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 32", toFramework: "DPDP_INDIA",    toClauseRef: "§8",bidirectional: true,  confidence: 0.8, rationale: "DPDP s. 8(5) reasonable security safeguards — substantive equivalent of GDPR Art. 32." },
  // GDPR ↔ PIPL China
  { fromFramework: "GDPR", fromClauseRef: "Art. 6",  toFramework: "PIPL_CHINA",    toClauseRef: "Art. 13", bidirectional: false, confidence: 0.6, rationale: "PIPL Art. 13 legal bases — seven listed, narrower default than GDPR Art. 6; no 'legitimate interests' basis." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 32", toFramework: "PIPL_CHINA",    toClauseRef: "Art. 51", bidirectional: true,  confidence: 0.8, rationale: "PIPL Art. 51 general obligations of PI Handlers — substantive equivalent of GDPR Art. 32." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 44", toFramework: "PIPL_CHINA",    toClauseRef: "Art. 38-43", bidirectional: false, confidence: 0.4, rationale: "Cross-border-transfer regimes both restrict export but differ structurally — PIPL requires CAC security assessment / certification / Standard Contract / other route." },
  // GDPR ↔ APPI Japan
  { fromFramework: "GDPR", fromClauseRef: "Art. 6",  toFramework: "APPI_JAPAN",    toClauseRef: "Art. 18", bidirectional: false, confidence: 0.6, rationale: "APPI Art. 18 utilisation-purpose restriction is purpose-driven rather than legal-basis-driven; partial overlap with GDPR Art. 6." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 32", toFramework: "APPI_JAPAN",    toClauseRef: "Art. 23", bidirectional: true,  confidence: 0.8, rationale: "APPI Art. 23 security control measures — substantive equivalent of GDPR Art. 32, elaborated in the PPC's four-pillar guidance." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 33", toFramework: "APPI_JAPAN",    toClauseRef: "Art. 26", bidirectional: false, confidence: 0.6, rationale: "APPI Art. 26 mandatory leakage reporting — 2022 amendment aligned APPI with GDPR-style breach-notification, but uses four categorical triggers rather than a generic 'risk to rights' test." },
  // GDPR ↔ Australia Privacy Act
  { fromFramework: "GDPR", fromClauseRef: "Art. 5",  toFramework: "PRIVACY_ACT_AU",toClauseRef: "APP 3",  bidirectional: false, confidence: 0.6, rationale: "APP 3 collection limitation maps to GDPR Art. 5(1)(b) + (c) purpose limitation + data minimisation." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 32", toFramework: "PRIVACY_ACT_AU",toClauseRef: "APP 11", bidirectional: true,  confidence: 0.8, rationale: "APP 11 security of personal information — substantive equivalent of GDPR Art. 32." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 33", toFramework: "PRIVACY_ACT_AU",toClauseRef: "Part IIIC", bidirectional: false, confidence: 0.6, rationale: "Notifiable Data Breaches scheme — substantively overlaps with GDPR Art. 33 but uses an 'eligible data breach with serious harm' threshold rather than 'risk to rights'." },
  // GDPR ↔ CCPA / CPRA
  { fromFramework: "GDPR", fromClauseRef: "Art. 15", toFramework: "CCPA",          toClauseRef: "§1798.110", bidirectional: false, confidence: 0.6, rationale: "CCPA §1798.110 right-to-know maps to GDPR Art. 15 right-of-access, but CCPA's 12-month lookback differs from GDPR's open-ended access right." },
  { fromFramework: "GDPR", fromClauseRef: "Art. 17", toFramework: "CCPA",          toClauseRef: "§1798.105", bidirectional: false, confidence: 0.6, rationale: "CCPA §1798.105 right-to-delete maps to GDPR Art. 17 right-to-erasure, but CCPA's exception list differs." },
];

// ─── EU AI Act ↔ ISO/IEC 42001 ──────────────────────────────────────────────

const EU_AI_ACT_ISO_42001: readonly CrosswalkEdge[] = [
  { fromFramework: "EU_AI_ACT", fromClauseRef: "Art. 9",  toFramework: "ISO_42001", toClauseRef: "Cl. 6.1", bidirectional: false, confidence: 0.8, rationale: "ISO 42001 6.1 actions to address risks + opportunities — direct backbone for EU AI Act Art. 9 risk-management-system requirements for high-risk AI." },
  { fromFramework: "EU_AI_ACT", fromClauseRef: "Art. 10", toFramework: "ISO_42001", toClauseRef: "Cl. 7.3", bidirectional: false, confidence: 0.6, rationale: "ISO 42001 7.4 communication + 8.x AI-system-impact-assessment overlap with EU AI Act Art. 10 data governance — but 42001 is process-oriented while Art. 10 has prescriptive data-quality criteria." },
  { fromFramework: "EU_AI_ACT", fromClauseRef: "Art. 11", toFramework: "ISO_42001", toClauseRef: "Cl. 7.2", bidirectional: false, confidence: 0.8, rationale: "ISO 42001 7.5 documented information — provides the documentation discipline that Art. 11 technical-documentation requires." },
  { fromFramework: "EU_AI_ACT", fromClauseRef: "Art. 12", toFramework: "ISO_42001", toClauseRef: "Cl. 9.1", bidirectional: false, confidence: 0.8, rationale: "ISO 42001 9.1 monitoring + measurement — operational backbone for Art. 12 record-keeping (logging)." },
  { fromFramework: "EU_AI_ACT", fromClauseRef: "Art. 14", toFramework: "ISO_42001", toClauseRef: "Cl. 8.1", bidirectional: false, confidence: 0.6, rationale: "ISO 42001 8.4 system-impact-assessment + human-oversight controls — partial backbone for Art. 14 human oversight, which has additional Art-14-specific prescriptive measures." },
  { fromFramework: "EU_AI_ACT", fromClauseRef: "Art. 17", toFramework: "ISO_42001", toClauseRef: "Cl. 4.1", bidirectional: false, confidence: 0.8, rationale: "Art. 17 quality-management system — ISO 42001 IS an AI quality-management system; full Plan-Do-Check-Act structure of 42001 evidences Art. 17." },
];

// ─── EU AI Act ↔ NIST AI RMF ────────────────────────────────────────────────

const EU_AI_ACT_NIST_AI_RMF: readonly CrosswalkEdge[] = [
  { fromFramework: "EU_AI_ACT", fromClauseRef: "Art. 9",  toFramework: "NIST_AI_RMF", toClauseRef: "MAP-1",     bidirectional: false, confidence: 0.6, rationale: "NIST AI RMF Map-1 (context) — categorisation supports Art. 9 risk-system foundation." },
  { fromFramework: "EU_AI_ACT", fromClauseRef: "Art. 9",  toFramework: "NIST_AI_RMF", toClauseRef: "MEASURE-1", bidirectional: false, confidence: 0.8, rationale: "NIST AI RMF Measure-1 — risk-analysis + impact-assessment maps to Art. 9 risk-management-system implementation." },
  { fromFramework: "EU_AI_ACT", fromClauseRef: "Art. 9",  toFramework: "NIST_AI_RMF", toClauseRef: "MANAGE-1",  bidirectional: false, confidence: 0.8, rationale: "NIST AI RMF Manage-1 — risk treatment + monitoring maps to Art. 9 ongoing risk management." },
  { fromFramework: "EU_AI_ACT", fromClauseRef: "Art. 14", toFramework: "NIST_AI_RMF", toClauseRef: "GOVERN-2",  bidirectional: false, confidence: 0.6, rationale: "NIST AI RMF Govern-2 (accountability structures + roles) supports Art. 14 human-oversight institutional design." },
  { fromFramework: "EU_AI_ACT", fromClauseRef: "Art. 15", toFramework: "NIST_AI_RMF", toClauseRef: "MEASURE-2", bidirectional: false, confidence: 0.6, rationale: "Accuracy + robustness + cybersecurity testing — NIST AI RMF Measure-2 sub-categories (validity/reliability/safety/security/resilience) provide the metric framework." },
];

// ─── ISO/IEC 27001 ↔ SOC 2 ─────────────────────────────────────────────────

const ISO_27001_SOC_2: readonly CrosswalkEdge[] = [
  { fromFramework: "ISO_27001", fromClauseRef: "Annex A.5",  toFramework: "SOC_2", toClauseRef: "CC1", bidirectional: true,  confidence: 0.8, rationale: "Information security policies (27001) ≈ Control Environment — integrity + ethical values (SOC 2 Common Criteria)." },
  { fromFramework: "ISO_27001", fromClauseRef: "Annex A.5", toFramework: "SOC_2", toClauseRef: "CC6", bidirectional: true,  confidence: 0.8, rationale: "Access control (27001) ≈ Logical and physical access controls (SOC 2 CC6.1)." },
  { fromFramework: "ISO_27001", fromClauseRef: "Annex A.5", toFramework: "SOC_2", toClauseRef: "CC7", bidirectional: true,  confidence: 0.8, rationale: "Incident management planning (27001) ≈ Identification of security events + response (SOC 2 CC7.4)." },
  { fromFramework: "ISO_27001", fromClauseRef: "Annex A.8", toFramework: "SOC_2", toClauseRef: "CC6", bidirectional: true,  confidence: 0.8, rationale: "Cryptography (27001) ≈ Transmission + disposal of confidential information (SOC 2 CC6.7)." },
  { fromFramework: "ISO_27001", fromClauseRef: "Annex A.8", toFramework: "SOC_2", toClauseRef: "CC8", bidirectional: true,  confidence: 0.8, rationale: "Secure development life cycle (27001) ≈ Change management (SOC 2 CC8.1)." },
];

// ─── NIST CSF ↔ ISO/IEC 27001 ───────────────────────────────────────────────

const NIST_CSF_ISO_27001: readonly CrosswalkEdge[] = [
  { fromFramework: "NIST_CSF", fromClauseRef: "GV.OC", toFramework: "ISO_27001", toClauseRef: "Cl. 4.1", bidirectional: true,  confidence: 0.6, rationale: "Govern - Organizational Context ≈ ISO 27001 4.1 understanding the organization + its context." },
  { fromFramework: "NIST_CSF", fromClauseRef: "ID.AM", toFramework: "ISO_27001", toClauseRef: "Annex A.5", bidirectional: true, confidence: 0.8, rationale: "Identify - Asset Management ≈ ISO 27001 A.5.9 inventory of information + other associated assets." },
  { fromFramework: "NIST_CSF", fromClauseRef: "PR.AA", toFramework: "ISO_27001", toClauseRef: "Annex A.5",bidirectional: true, confidence: 0.8, rationale: "Protect - Identity Management, Authentication and Access Control ≈ ISO 27001 A.5.15 access control." },
  { fromFramework: "NIST_CSF", fromClauseRef: "DE.CM", toFramework: "ISO_27001", toClauseRef: "Annex A.8",bidirectional: true, confidence: 0.8, rationale: "Detect - Continuous Monitoring ≈ ISO 27001 A.8.16 monitoring activities." },
  { fromFramework: "NIST_CSF", fromClauseRef: "RS.CO", toFramework: "ISO_27001", toClauseRef: "Annex A.5",bidirectional: true, confidence: 0.8, rationale: "Respond - Communications ≈ ISO 27001 A.5.24 information security incident management planning + preparation." },
  { fromFramework: "NIST_CSF", fromClauseRef: "RC.RP", toFramework: "ISO_27001", toClauseRef: "Annex A.5",bidirectional: true, confidence: 0.8, rationale: "Recover - Recovery Planning ≈ ISO 27001 A.5.30 ICT readiness for business continuity." },
];

// ─── PCI DSS ↔ ISO/IEC 27001 ───────────────────────────────────────────────

const PCI_DSS_ISO_27001: readonly CrosswalkEdge[] = [
  { fromFramework: "PCI_DSS", fromClauseRef: "Req. 3",  toFramework: "ISO_27001", toClauseRef: "Annex A.8", bidirectional: false, confidence: 0.8, rationale: "PCI DSS Req. 3 protect stored cardholder data ≈ ISO 27001 A.8.24 use of cryptography." },
  { fromFramework: "PCI_DSS", fromClauseRef: "Req. 4",  toFramework: "ISO_27001", toClauseRef: "Annex A.8", bidirectional: false, confidence: 0.8, rationale: "PCI DSS Req. 4 protect cardholder data with strong cryptography during transmission ≈ ISO 27001 A.8.24 cryptography." },
  { fromFramework: "PCI_DSS", fromClauseRef: "Req. 7",  toFramework: "ISO_27001", toClauseRef: "Annex A.5", bidirectional: false, confidence: 0.8, rationale: "PCI DSS Req. 7 restrict access to system components ≈ ISO 27001 A.5.15 access control." },
  { fromFramework: "PCI_DSS", fromClauseRef: "Req. 8",  toFramework: "ISO_27001", toClauseRef: "Annex A.5", bidirectional: false, confidence: 0.8, rationale: "PCI DSS Req. 8 identify users and authenticate access ≈ ISO 27001 A.5.16 identity management + A.5.17 authentication information." },
  { fromFramework: "PCI_DSS", fromClauseRef: "Req. 10", toFramework: "ISO_27001", toClauseRef: "Annex A.8", bidirectional: false, confidence: 0.8, rationale: "PCI DSS Req. 10 log + monitor all access ≈ ISO 27001 A.8.15 logging + A.8.16 monitoring." },
];

// ─── Master export ──────────────────────────────────────────────────────────

export const CROSSWALKS: readonly CrosswalkEdge[] = [
  ...GDPR_UK_GDPR,
  ...GDPR_ISO_27701,
  ...GDPR_ISO_27001,
  ...GDPR_NIS2,
  ...GDPR_DORA,
  ...GDPR_HIPAA,
  ...GDPR_PRIVACY_FAMILY,
  ...EU_AI_ACT_ISO_42001,
  ...EU_AI_ACT_NIST_AI_RMF,
  ...ISO_27001_SOC_2,
  ...NIST_CSF_ISO_27001,
  ...PCI_DSS_ISO_27001,
];

/** Filter edges where the FROM clause matches. */
export function crosswalksFrom(
  framework: FrameworkCode,
  clauseRef: string,
): readonly CrosswalkEdge[] {
  return CROSSWALKS.filter(
    (e) =>
      (e.fromFramework === framework && e.fromClauseRef === clauseRef) ||
      (e.bidirectional && e.toFramework === framework && e.toClauseRef === clauseRef),
  );
}

/** Filter edges between two frameworks (in either direction). */
export function crosswalksBetween(
  a: FrameworkCode,
  b: FrameworkCode,
): readonly CrosswalkEdge[] {
  return CROSSWALKS.filter(
    (e) =>
      (e.fromFramework === a && e.toFramework === b) ||
      (e.bidirectional && e.fromFramework === b && e.toFramework === a),
  );
}
