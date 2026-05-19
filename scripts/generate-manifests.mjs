#!/usr/bin/env node
// One-shot generator for the 21 rule-pack manifests. Output is the source
// of truth thereafter; this script is committed only for reproducibility.

import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = "packages/frameworks/manifests";

/** @typedef {{
 *   slug: string,
 *   displayName: string,
 *   description: string,
 *   authorityId: string,
 *   authorityShortName: string,
 *   authorityTitle: string,
 *   authorityCitation: string,
 *   authorityUrl: string,
 *   authorityPublisher: string,
 *   authorityPublishedAt: string,
 *   authorityInForceFrom?: string,
 *   authorityApplicableFrom?: string,
 *   authorityCategory: string,
 *   jurisdictions: string[],
 *   appliesTo: { domains?: string[], entityRoles?: string[], sectors?: string[], systemTypes?: string[] },
 *   includedRuleGroups: string[],
 *   deadlines?: { name: string, date: string, appliesTo?: string, url?: string }[],
 *   supervisoryBodies?: string[]
 * }} F */

/** @type {F[]} */
const FRAMEWORKS = [
  {
    slug: "eu-ai-act",
    displayName: "EU AI Act",
    description: "Regulation (EU) 2024/1689 of the European Parliament and of the Council laying down harmonised rules on artificial intelligence.",
    authorityId: "eu-ai-act@2024-1689",
    authorityShortName: "EU AI Act",
    authorityTitle: "Regulation (EU) 2024/1689",
    authorityCitation: "Regulation (EU) 2024/1689",
    authorityUrl: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
    authorityPublisher: "European Parliament and Council of the European Union",
    authorityPublishedAt: "2024-07-12",
    authorityInForceFrom: "2024-08-01",
    authorityApplicableFrom: "2026-08-02",
    authorityCategory: "ai-regulation",
    jurisdictions: ["EU", "EEA"],
    appliesTo: {
      domains: ["artificial_intelligence"],
      entityRoles: ["provider", "deployer", "importer", "distributor", "authorized-representative"],
      systemTypes: ["ai_system", "general_purpose_ai_model", "high_risk_ai_system"]
    },
    includedRuleGroups: [
      "applicability",
      "risk_classification",
      "prohibited_practices",
      "high_risk_requirements",
      "transparency",
      "general_purpose_ai",
      "human_oversight",
      "post_market_monitoring",
      "incident_reporting",
      "governance",
      "documentation"
    ],
    deadlines: [
      { name: "Prohibited practices applicable", date: "2025-02-02", appliesTo: "prohibited_practices", url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj" },
      { name: "GPAI obligations applicable",     date: "2025-08-02", appliesTo: "general_purpose_ai" },
      { name: "Main applicability date",         date: "2026-08-02" },
      { name: "High-risk Annex III in scope",    date: "2027-08-02", appliesTo: "high_risk_requirements" }
    ],
    supervisoryBodies: ["European AI Office", "Member-State national competent authorities", "European Data Protection Supervisor"]
  },
  {
    slug: "iso-42001",
    displayName: "ISO/IEC 42001:2023 — AI Management System",
    description: "International standard specifying requirements for establishing, implementing, maintaining and continually improving an AI Management System (AIMS).",
    authorityId: "iso-42001@2023",
    authorityShortName: "ISO/IEC 42001",
    authorityTitle: "ISO/IEC 42001:2023 — Artificial intelligence — Management system",
    authorityCitation: "ISO/IEC 42001:2023",
    authorityUrl: "https://www.iso.org/standard/81230.html",
    authorityPublisher: "International Organization for Standardization",
    authorityPublishedAt: "2023-12-18",
    authorityCategory: "industry-standard",
    jurisdictions: ["INTERNATIONAL"],
    appliesTo: {
      domains: ["artificial_intelligence"],
      entityRoles: ["provider", "deployer"],
      systemTypes: ["ai_system"]
    },
    includedRuleGroups: [
      "context_of_organization",
      "leadership",
      "planning",
      "support",
      "operation",
      "performance_evaluation",
      "improvement",
      "annex_a_ai_controls"
    ],
    supervisoryBodies: ["Accredited certification bodies (UKAS, ANAB, etc)"]
  },
  {
    slug: "iso-27001",
    displayName: "ISO/IEC 27001:2022 — Information Security Management",
    description: "International standard specifying requirements for an information security management system (ISMS).",
    authorityId: "iso-27001@2022",
    authorityShortName: "ISO/IEC 27001",
    authorityTitle: "ISO/IEC 27001:2022 — Information security, cybersecurity and privacy protection — Information security management systems",
    authorityCitation: "ISO/IEC 27001:2022",
    authorityUrl: "https://www.iso.org/standard/27001",
    authorityPublisher: "International Organization for Standardization",
    authorityPublishedAt: "2022-10-25",
    authorityCategory: "information-security",
    jurisdictions: ["INTERNATIONAL"],
    appliesTo: {
      domains: ["information_security"],
      entityRoles: ["controller", "processor", "service_provider"]
    },
    includedRuleGroups: [
      "context_of_organization",
      "leadership",
      "planning",
      "support",
      "operation",
      "performance_evaluation",
      "improvement",
      "annex_a_93_controls"
    ],
    supervisoryBodies: ["Accredited certification bodies"]
  },
  {
    slug: "iso-27701",
    displayName: "ISO/IEC 27701:2019 — Privacy Information Management",
    description: "Extension to ISO/IEC 27001 establishing requirements and guidance for a Privacy Information Management System (PIMS).",
    authorityId: "iso-27701@2019",
    authorityShortName: "ISO/IEC 27701",
    authorityTitle: "ISO/IEC 27701:2019 — Privacy information management",
    authorityCitation: "ISO/IEC 27701:2019",
    authorityUrl: "https://www.iso.org/standard/71670.html",
    authorityPublisher: "International Organization for Standardization",
    authorityPublishedAt: "2019-08-06",
    authorityCategory: "data-protection",
    jurisdictions: ["INTERNATIONAL"],
    appliesTo: {
      domains: ["privacy", "data_protection"],
      entityRoles: ["pii_controller", "pii_processor"]
    },
    includedRuleGroups: [
      "pims_specific_requirements",
      "annex_a_pii_controller_controls",
      "annex_b_pii_processor_controls"
    ],
    supervisoryBodies: ["Accredited certification bodies"]
  },
  {
    slug: "gdpr",
    displayName: "General Data Protection Regulation (EU)",
    description: "Regulation (EU) 2016/679 — protection of natural persons with regard to the processing of personal data and on the free movement of such data.",
    authorityId: "gdpr@2016-679",
    authorityShortName: "GDPR",
    authorityTitle: "Regulation (EU) 2016/679",
    authorityCitation: "Regulation (EU) 2016/679 (GDPR)",
    authorityUrl: "https://eur-lex.europa.eu/eli/reg/2016/679/oj",
    authorityPublisher: "European Parliament and Council of the European Union",
    authorityPublishedAt: "2016-04-27",
    authorityInForceFrom: "2016-05-24",
    authorityApplicableFrom: "2018-05-25",
    authorityCategory: "data-protection",
    jurisdictions: ["EU", "EEA"],
    appliesTo: {
      domains: ["personal_data_processing"],
      entityRoles: ["controller", "processor", "joint-controller", "dpo", "representative"]
    },
    includedRuleGroups: [
      "territorial_scope",
      "lawful_basis",
      "data_subject_rights",
      "controller_obligations",
      "processor_obligations",
      "international_transfers",
      "dpia",
      "breach_notification",
      "supervisory_authorities"
    ],
    supervisoryBodies: ["European Data Protection Board", "Member-State Data Protection Authorities"]
  },
  {
    slug: "uk-gdpr",
    displayName: "UK GDPR (Data Protection Act 2018)",
    description: "UK retained EU law equivalent to the GDPR after Brexit, read with the Data Protection Act 2018.",
    authorityId: "uk-gdpr@2018",
    authorityShortName: "UK GDPR",
    authorityTitle: "UK GDPR (as retained by the European Union (Withdrawal) Act 2018) + Data Protection Act 2018",
    authorityCitation: "UK GDPR + DPA 2018",
    authorityUrl: "https://www.legislation.gov.uk/ukpga/2018/12/contents",
    authorityPublisher: "UK Parliament",
    authorityPublishedAt: "2018-05-23",
    authorityInForceFrom: "2018-05-25",
    authorityCategory: "data-protection",
    jurisdictions: ["UK"],
    appliesTo: {
      domains: ["personal_data_processing"],
      entityRoles: ["controller", "processor", "dpo", "representative"]
    },
    includedRuleGroups: [
      "territorial_scope",
      "lawful_basis",
      "data_subject_rights",
      "controller_obligations",
      "processor_obligations",
      "international_transfers",
      "dpia",
      "breach_notification"
    ],
    supervisoryBodies: ["Information Commissioner's Office (ICO)"]
  },
  {
    slug: "hipaa",
    displayName: "HIPAA — Privacy, Security & Breach Notification Rules",
    description: "Health Insurance Portability and Accountability Act of 1996, with regulations at 45 CFR Parts 160 and 164 (Privacy Rule, Security Rule, Breach Notification Rule).",
    authorityId: "hipaa@1996",
    authorityShortName: "HIPAA",
    authorityTitle: "Health Insurance Portability and Accountability Act of 1996 — 45 CFR Parts 160 & 164",
    authorityCitation: "45 CFR §§ 160, 164",
    authorityUrl: "https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C",
    authorityPublisher: "US Department of Health & Human Services (HHS)",
    authorityPublishedAt: "1996-08-21",
    authorityCategory: "healthcare",
    jurisdictions: ["US"],
    appliesTo: {
      domains: ["protected_health_information"],
      entityRoles: ["covered_entity", "business_associate", "subcontractor"]
    },
    includedRuleGroups: [
      "privacy_rule",
      "security_rule_administrative_safeguards",
      "security_rule_physical_safeguards",
      "security_rule_technical_safeguards",
      "breach_notification_rule",
      "enforcement_rule"
    ],
    supervisoryBodies: ["HHS Office for Civil Rights (OCR)"]
  },
  {
    slug: "soc-1",
    displayName: "SOC 1 — System and Organization Controls 1 (SSAE 18)",
    description: "AICPA examination engagement reporting on controls relevant to user entities' internal control over financial reporting (ICFR).",
    authorityId: "soc-1@ssae-18",
    authorityShortName: "SOC 1",
    authorityTitle: "AICPA SSAE No. 18, AT-C Section 320",
    authorityCitation: "AICPA SSAE 18",
    authorityUrl: "https://us.aicpa.org/interestareas/frc/assuranceadvisoryservices/sorhome.html",
    authorityPublisher: "American Institute of Certified Public Accountants",
    authorityPublishedAt: "2017-05-01",
    authorityCategory: "industry-standard",
    jurisdictions: ["US"],
    appliesTo: {
      domains: ["financial_reporting"],
      entityRoles: ["service_organization"]
    },
    includedRuleGroups: [
      "control_objectives",
      "tsc_for_icfr",
      "complementary_user_entity_controls",
      "complementary_subservice_organization_controls"
    ],
    supervisoryBodies: ["Independent CPA service auditor"]
  },
  {
    slug: "soc-2",
    displayName: "SOC 2 — Trust Services Criteria",
    description: "AICPA examination engagement reporting on controls at a service organization relevant to security, availability, processing integrity, confidentiality, and privacy.",
    authorityId: "soc-2@tsc-2017",
    authorityShortName: "SOC 2",
    authorityTitle: "AICPA Trust Services Criteria (TSC), 2017 with 2022 Points of Focus",
    authorityCitation: "AICPA TSC (Trust Services Criteria)",
    authorityUrl: "https://us.aicpa.org/interestareas/frc/assuranceadvisoryservices/trustservices.html",
    authorityPublisher: "American Institute of Certified Public Accountants",
    authorityPublishedAt: "2017-04-01",
    authorityCategory: "industry-standard",
    jurisdictions: ["US"],
    appliesTo: {
      domains: ["information_security", "privacy"],
      entityRoles: ["service_organization"]
    },
    includedRuleGroups: [
      "cc1_control_environment",
      "cc2_communication_information",
      "cc3_risk_assessment",
      "cc4_monitoring_activities",
      "cc5_control_activities",
      "cc6_logical_physical_access",
      "cc7_system_operations",
      "cc8_change_management",
      "cc9_risk_mitigation",
      "additional_criteria_availability",
      "additional_criteria_processing_integrity",
      "additional_criteria_confidentiality",
      "additional_criteria_privacy"
    ],
    supervisoryBodies: ["Independent CPA service auditor"]
  },
  {
    slug: "dora",
    displayName: "Digital Operational Resilience Act (DORA)",
    description: "Regulation (EU) 2022/2554 on digital operational resilience for the financial sector.",
    authorityId: "dora@2022-2554",
    authorityShortName: "DORA",
    authorityTitle: "Regulation (EU) 2022/2554",
    authorityCitation: "Regulation (EU) 2022/2554 (DORA)",
    authorityUrl: "https://eur-lex.europa.eu/eli/reg/2022/2554/oj",
    authorityPublisher: "European Parliament and Council of the European Union",
    authorityPublishedAt: "2022-12-14",
    authorityInForceFrom: "2023-01-16",
    authorityApplicableFrom: "2025-01-17",
    authorityCategory: "financial-services",
    jurisdictions: ["EU", "EEA"],
    appliesTo: {
      domains: ["ict_risk", "operational_resilience"],
      entityRoles: ["financial_entity", "ict_third_party_service_provider"],
      sectors: ["financial_services", "credit_institutions", "investment_firms", "insurance", "crypto_asset_service_providers"]
    },
    includedRuleGroups: [
      "ict_risk_management",
      "ict_incident_reporting",
      "digital_operational_resilience_testing",
      "ict_third_party_risk",
      "information_sharing_arrangements",
      "oversight_of_critical_third_party_providers"
    ],
    supervisoryBodies: ["European Supervisory Authorities (EBA, EIOPA, ESMA)", "National competent authorities"]
  },
  {
    slug: "nis2",
    displayName: "NIS2 Directive",
    description: "Directive (EU) 2022/2555 on measures for a high common level of cybersecurity across the Union, repealing the original NIS Directive.",
    authorityId: "nis2@2022-2555",
    authorityShortName: "NIS2",
    authorityTitle: "Directive (EU) 2022/2555",
    authorityCitation: "Directive (EU) 2022/2555 (NIS2)",
    authorityUrl: "https://eur-lex.europa.eu/eli/dir/2022/2555/oj",
    authorityPublisher: "European Parliament and Council of the European Union",
    authorityPublishedAt: "2022-12-14",
    authorityInForceFrom: "2023-01-16",
    authorityApplicableFrom: "2024-10-18",
    authorityCategory: "cybersecurity",
    jurisdictions: ["EU", "EEA"],
    appliesTo: {
      domains: ["cybersecurity", "network_information_systems"],
      entityRoles: ["essential_entity", "important_entity"],
      sectors: ["energy", "transport", "banking", "financial_market_infrastructure", "health", "drinking_water", "waste_water", "digital_infrastructure", "ict_service_management", "public_administration", "space"]
    },
    includedRuleGroups: [
      "cybersecurity_risk_management",
      "incident_reporting",
      "supply_chain_security",
      "vulnerability_disclosure",
      "governance_accountability"
    ],
    supervisoryBodies: ["Member-State national competent authorities", "ENISA"]
  },
  {
    slug: "eu-cra",
    displayName: "EU Cyber Resilience Act",
    description: "Regulation (EU) 2024/2847 on horizontal cybersecurity requirements for products with digital elements.",
    authorityId: "eu-cra@2024-2847",
    authorityShortName: "EU CRA",
    authorityTitle: "Regulation (EU) 2024/2847",
    authorityCitation: "Regulation (EU) 2024/2847 (CRA)",
    authorityUrl: "https://eur-lex.europa.eu/eli/reg/2024/2847/oj",
    authorityPublisher: "European Parliament and Council of the European Union",
    authorityPublishedAt: "2024-10-23",
    authorityInForceFrom: "2024-12-10",
    authorityApplicableFrom: "2027-12-11",
    authorityCategory: "cybersecurity",
    jurisdictions: ["EU", "EEA"],
    appliesTo: {
      domains: ["product_cybersecurity"],
      entityRoles: ["manufacturer", "importer", "distributor"],
      systemTypes: ["product_with_digital_elements"]
    },
    includedRuleGroups: [
      "essential_cybersecurity_requirements",
      "vulnerability_handling",
      "conformity_assessment",
      "ce_marking",
      "incident_notification"
    ],
    supervisoryBodies: ["Market surveillance authorities", "ENISA"]
  },
  {
    slug: "pci-dss",
    displayName: "PCI DSS v4.0",
    description: "Payment Card Industry Data Security Standard, v4.0 — global baseline for protecting cardholder data.",
    authorityId: "pci-dss@4.0",
    authorityShortName: "PCI DSS",
    authorityTitle: "Payment Card Industry Data Security Standard v4.0",
    authorityCitation: "PCI DSS v4.0",
    authorityUrl: "https://www.pcisecuritystandards.org/document_library/",
    authorityPublisher: "PCI Security Standards Council",
    authorityPublishedAt: "2022-03-31",
    authorityCategory: "financial-services",
    jurisdictions: ["INTERNATIONAL"],
    appliesTo: {
      domains: ["cardholder_data"],
      entityRoles: ["merchant", "service_provider"],
      sectors: ["payments"]
    },
    includedRuleGroups: [
      "req_1_network_security_controls",
      "req_2_secure_configurations",
      "req_3_protect_stored_account_data",
      "req_4_protect_cardholder_data_in_transit",
      "req_5_anti_malware",
      "req_6_secure_systems_and_software",
      "req_7_restrict_access",
      "req_8_identify_authenticate_users",
      "req_9_restrict_physical_access",
      "req_10_log_and_monitor",
      "req_11_test_security",
      "req_12_information_security_program"
    ],
    supervisoryBodies: ["Acquirers", "QSAs (Qualified Security Assessors)"]
  },
  {
    slug: "nist-ai-rmf",
    displayName: "NIST AI Risk Management Framework 1.0",
    description: "Voluntary US framework for managing risks posed by artificial intelligence to individuals, organizations and society.",
    authorityId: "nist-ai-rmf@1.0",
    authorityShortName: "NIST AI RMF",
    authorityTitle: "NIST AI Risk Management Framework (AI RMF 1.0)",
    authorityCitation: "NIST AI 100-1",
    authorityUrl: "https://www.nist.gov/itl/ai-risk-management-framework",
    authorityPublisher: "US National Institute of Standards and Technology",
    authorityPublishedAt: "2023-01-26",
    authorityCategory: "ai-regulation",
    jurisdictions: ["US"],
    appliesTo: {
      domains: ["artificial_intelligence"],
      entityRoles: ["provider", "deployer"],
      systemTypes: ["ai_system"]
    },
    includedRuleGroups: ["govern", "map", "measure", "manage"],
    supervisoryBodies: ["Voluntary — no statutory supervisor"]
  },
  {
    slug: "nist-csf",
    displayName: "NIST Cybersecurity Framework 2.0",
    description: "Voluntary US framework for managing and reducing cybersecurity risk.",
    authorityId: "nist-csf@2.0",
    authorityShortName: "NIST CSF",
    authorityTitle: "NIST Cybersecurity Framework 2.0",
    authorityCitation: "NIST CSF 2.0",
    authorityUrl: "https://www.nist.gov/cyberframework",
    authorityPublisher: "US National Institute of Standards and Technology",
    authorityPublishedAt: "2024-02-26",
    authorityCategory: "cybersecurity",
    jurisdictions: ["US"],
    appliesTo: { domains: ["cybersecurity"] },
    includedRuleGroups: ["govern", "identify", "protect", "detect", "respond", "recover"],
    supervisoryBodies: ["Voluntary — no statutory supervisor"]
  },
  {
    slug: "ccpa",
    displayName: "California Consumer Privacy Act (with CPRA amendments)",
    description: "California state privacy law (Cal. Civ. Code §§ 1798.100–1798.199.100), as amended by the California Privacy Rights Act.",
    authorityId: "ccpa-cpra@2023",
    authorityShortName: "CCPA/CPRA",
    authorityTitle: "California Consumer Privacy Act as amended by the California Privacy Rights Act",
    authorityCitation: "Cal. Civ. Code §§ 1798.100–1798.199.100",
    authorityUrl: "https://leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?lawCode=CIV&division=3.&title=1.81.5.",
    authorityPublisher: "State of California",
    authorityPublishedAt: "2018-06-28",
    authorityInForceFrom: "2020-01-01",
    authorityApplicableFrom: "2023-01-01",
    authorityCategory: "data-protection",
    jurisdictions: ["US-CA"],
    appliesTo: {
      domains: ["personal_information"],
      entityRoles: ["business", "service_provider", "contractor", "third_party"]
    },
    includedRuleGroups: [
      "applicability_thresholds",
      "consumer_rights",
      "notice_requirements",
      "service_provider_contracts",
      "sensitive_personal_information",
      "automated_decision_making"
    ],
    supervisoryBodies: ["California Privacy Protection Agency (CPPA)", "California Attorney General"]
  },
  {
    slug: "lgpd-brazil",
    displayName: "Lei Geral de Proteção de Dados (LGPD) — Brazil",
    description: "Lei nº 13.709/2018 — Brazilian General Data Protection Law.",
    authorityId: "lgpd@2018-13709",
    authorityShortName: "LGPD",
    authorityTitle: "Lei nº 13.709/2018",
    authorityCitation: "Lei nº 13.709/2018 (LGPD)",
    authorityUrl: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm",
    authorityPublisher: "Federal Government of Brazil",
    authorityPublishedAt: "2018-08-14",
    authorityInForceFrom: "2020-09-18",
    authorityCategory: "data-protection",
    jurisdictions: ["BR"],
    appliesTo: {
      domains: ["personal_data_processing"],
      entityRoles: ["controller", "processor", "dpo"]
    },
    includedRuleGroups: [
      "legal_bases",
      "data_subject_rights",
      "international_transfers",
      "security_and_secrecy",
      "good_practices_governance",
      "sanctions"
    ],
    supervisoryBodies: ["Autoridade Nacional de Proteção de Dados (ANPD)"]
  },
  {
    slug: "dpdp-india",
    displayName: "Digital Personal Data Protection Act 2023 — India",
    description: "India's first comprehensive data-protection statute regulating processing of digital personal data.",
    authorityId: "dpdp@2023",
    authorityShortName: "DPDP",
    authorityTitle: "Digital Personal Data Protection Act, 2023",
    authorityCitation: "Act No. 22 of 2023",
    authorityUrl: "https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf",
    authorityPublisher: "Government of India, Ministry of Electronics and Information Technology",
    authorityPublishedAt: "2023-08-11",
    authorityCategory: "data-protection",
    jurisdictions: ["IN"],
    appliesTo: {
      domains: ["digital_personal_data"],
      entityRoles: ["data_fiduciary", "data_processor", "significant_data_fiduciary", "consent_manager"]
    },
    includedRuleGroups: [
      "applicability",
      "obligations_of_data_fiduciary",
      "rights_and_duties_of_data_principal",
      "special_provisions",
      "data_protection_board"
    ],
    supervisoryBodies: ["Data Protection Board of India"]
  },
  {
    slug: "pipl-china",
    displayName: "Personal Information Protection Law — China",
    description: "PRC Personal Information Protection Law (2021), covering processing of personal information of natural persons in China and certain extraterritorial activities.",
    authorityId: "pipl@2021",
    authorityShortName: "PIPL",
    authorityTitle: "Personal Information Protection Law of the People's Republic of China",
    authorityCitation: "PIPL (2021)",
    authorityUrl: "http://en.npc.gov.cn.cdurl.cn/2021-12/29/c_694559.htm",
    authorityPublisher: "Standing Committee of the National People's Congress of the PRC",
    authorityPublishedAt: "2021-08-20",
    authorityInForceFrom: "2021-11-01",
    authorityCategory: "data-protection",
    jurisdictions: ["CN"],
    appliesTo: {
      domains: ["personal_information"],
      entityRoles: ["personal_information_handler", "entrusted_party"]
    },
    includedRuleGroups: [
      "legal_basis_and_consent",
      "rights_of_individuals",
      "obligations_of_handlers",
      "cross_border_transfer",
      "sensitive_personal_information",
      "automated_decision_making"
    ],
    supervisoryBodies: ["Cyberspace Administration of China (CAC)"]
  },
  {
    slug: "appi-japan",
    displayName: "Act on the Protection of Personal Information (APPI) — Japan",
    description: "Japan's principal data protection statute, as amended by the 2020/2021 reforms.",
    authorityId: "appi@2003-amended-2020",
    authorityShortName: "APPI",
    authorityTitle: "Act on the Protection of Personal Information (Act No. 57 of 2003), as amended",
    authorityCitation: "Act No. 57 of 2003 (APPI)",
    authorityUrl: "https://www.ppc.go.jp/en/legal/",
    authorityPublisher: "Government of Japan, Personal Information Protection Commission",
    authorityPublishedAt: "2003-05-30",
    authorityInForceFrom: "2005-04-01",
    authorityCategory: "data-protection",
    jurisdictions: ["JP"],
    appliesTo: {
      domains: ["personal_information"],
      entityRoles: ["personal_information_handling_business_operator", "trustee"]
    },
    includedRuleGroups: [
      "scope_and_definitions",
      "obligations_of_business_operators",
      "rights_of_individuals",
      "cross_border_transfer",
      "anonymously_processed_information"
    ],
    supervisoryBodies: ["Personal Information Protection Commission (PPC)"]
  },
  {
    slug: "privacy-act-au",
    displayName: "Privacy Act 1988 — Australia",
    description: "Commonwealth statute regulating the handling of personal information about individuals, framed around the 13 Australian Privacy Principles.",
    authorityId: "privacy-act-au@1988",
    authorityShortName: "Privacy Act (AU)",
    authorityTitle: "Privacy Act 1988 (Cth) — including the Australian Privacy Principles",
    authorityCitation: "Privacy Act 1988 (Cth)",
    authorityUrl: "https://www.legislation.gov.au/Series/C2004A03712",
    authorityPublisher: "Commonwealth of Australia",
    authorityPublishedAt: "1988-12-14",
    authorityInForceFrom: "1989-01-01",
    authorityCategory: "data-protection",
    jurisdictions: ["AU"],
    appliesTo: {
      domains: ["personal_information"],
      entityRoles: ["app_entity", "credit_provider", "credit_reporting_body", "tfn_recipient"]
    },
    includedRuleGroups: [
      "australian_privacy_principles",
      "credit_reporting",
      "notifiable_data_breaches",
      "tfn_handling"
    ],
    supervisoryBodies: ["Office of the Australian Information Commissioner (OAIC)"]
  }
];

const REQUIRED_DICTIONARIES = [
  "regunav:dictionary:obligation-category",
  "regunav:dictionary:control-category",
  "regunav:dictionary:evidence-type",
  "regunav:dictionary:evidence-frequency",
  "regunav:dictionary:authority-category",
  "regunav:dictionary:architecture-capability",
  "regunav:dictionary:actor-role",
  "regunav:dictionary:reason-code"
];

const REQUIRED_PROFILES = [
  "regunav.core.v1",
  "regunav.conformance.v1"
];

const VERSION = "1.0.0";
const PUBLISHED_AT = "2026-05-16";
const PUBLISHER = {
  name: "Regunav Inc.",
  url: "https://regunav.com",
  contact: "rule-packs@regunav.com"
};

function manifestFor(f) {
  const authority = {
    id: f.authorityId,
    shortName: f.authorityShortName,
    title: f.authorityTitle,
    citation: f.authorityCitation,
    url: f.authorityUrl,
    publisher: f.authorityPublisher,
    publishedAt: f.authorityPublishedAt,
    category: f.authorityCategory
  };
  if (f.authorityInForceFrom) authority.inForceFrom = f.authorityInForceFrom;
  if (f.authorityApplicableFrom) authority.applicableFrom = f.authorityApplicableFrom;

  const payload = {
    authority,
    jurisdictions: f.jurisdictions,
    appliesTo: f.appliesTo,
    includedRuleGroups: f.includedRuleGroups,
    artefacts: {
      framework: `../src/${f.slug}.ts`
    }
  };
  if (f.deadlines) payload.deadlines = f.deadlines;
  if (f.supervisoryBodies) payload.supervisoryBodies = f.supervisoryBodies;

  return {
    schemaVersion: "regunav.manifest.v1",
    id: `regunav:manifest:rule-pack:${f.slug}:${VERSION}`,
    kind: "rule-pack",
    displayName: f.displayName,
    description: f.description,
    version: VERSION,
    publishedAt: PUBLISHED_AT,
    publisher: PUBLISHER,
    license: "Apache-2.0",
    status: "preview",
    requiredDictionaries: REQUIRED_DICTIONARIES,
    requiredProfiles: REQUIRED_PROFILES,
    payload
  };
}

mkdirSync(OUT_DIR, { recursive: true });
for (const f of FRAMEWORKS) {
  const out = manifestFor(f);
  const path = join(OUT_DIR, `${f.slug}.manifest.json`);
  writeFileSync(path, JSON.stringify(out, null, 2) + "\n", "utf-8");
  console.log("wrote", path);
}
console.log(`\n${FRAMEWORKS.length} manifests generated.`);
