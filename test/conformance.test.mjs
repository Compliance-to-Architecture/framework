/**
 * Framework-conformance test suite.
 *
 * Guards every populated Framework module against a fixed set of
 * structural invariants. Runs under `node --test` against the compiled
 * dist/ output, so no test-runner dependency is added.
 *
 * Invariants enforced:
 *
 *   I1  schemaVersion is 1
 *   I2  registry key === framework.code
 *   I3  name + version + description + referenceUrl are non-empty
 *   I4  jurisdiction is a non-empty list of ISO-3166-alpha-2 codes
 *       OR a recognised sentinel (GLOBAL / EU / UK)
 *   I5  every Clause has a non-empty clauseRef + title + description
 *   I6  clauseRef values within a framework are unique
 *   I7  every Control has a non-empty controlRef + title + description
 *   I8  controlRef values within a framework are unique
 *   I9  every Control.evidenceTypes is a non-empty subset of the
 *       12-kind EvidenceType union
 *   I10 every Control.clauseRefs is non-empty AND each entry exists in
 *       the framework's clauses list
 *   I11 every Control.riskLevel is a valid RiskLevel
 *   I12 every Question has a non-empty questionRef + text + category
 *   I13 questionRef values within a framework are unique
 *   I14 every Question.riskWeight is in [0, 1]
 *   I15 every Question.clauseRefs is non-empty AND each entry exists in
 *       the framework's clauses list
 *   I16 no fabricated copyright / TM / R markers in user-facing strings
 *
 * Invariants I5-I15 are skipped (not failed) for frameworks whose
 * clauses/controls/questions arrays are empty — that allows the suite
 * to ship alongside stubs and start enforcing the moment a framework
 * is populated, without a big-bang populate-all gate.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { FRAMEWORK_REGISTRY } from "../dist/index.js";

// ─── Constants ──────────────────────────────────────────────────────────────

const VALID_EVIDENCE_TYPES = new Set([
  "policy",
  "procedure",
  "log",
  "screenshot",
  "report",
  "attestation",
  "configuration",
  "training_record",
  "incident_record",
  "fria",
  "dpia",
  "contract",
]);

const VALID_RISK_LEVELS = new Set([
  "prohibited",
  "high",
  "limited",
  "minimal",
  "gpai",
]);

// ISO 3166-1 alpha-2 (e.g., "US", "GB") OR ISO 3166-2 subdivision
// (e.g., "US-CA" for California, "GB-ENG" for England). Subdivisions
// are legitimate compliance jurisdictions — state-level statutes like
// the CCPA only apply within a specific state.
const ISO_3166_PATTERN = /^[A-Z]{2}(-[A-Z0-9]{1,3})?$/;

// Trademark / copyright markers that should NOT appear in user-facing
// content per constitution tenet 7 (patent-safe).
const FORBIDDEN_MARKERS = ["™", "®", "©"];

// ─── Helpers ────────────────────────────────────────────────────────────────

function nonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function isPopulated(f) {
  return f.clauses.length > 0 || f.controls.length > 0 || f.questions.length > 0;
}

function noForbiddenMarkers(s, fieldPath) {
  for (const marker of FORBIDDEN_MARKERS) {
    assert.equal(
      s.includes(marker),
      false,
      `${fieldPath}: forbidden marker ${JSON.stringify(marker)} present — constitution tenet 7`,
    );
  }
}

// ─── Per-framework tests ────────────────────────────────────────────────────

const entries = Object.entries(FRAMEWORK_REGISTRY);

describe("framework registry", () => {
  it("is non-empty", () => {
    assert.ok(entries.length > 0, "FRAMEWORK_REGISTRY is empty");
  });

  it("registry key === framework.code (I2)", () => {
    for (const [key, framework] of entries) {
      assert.equal(framework.code, key, `${key}: framework.code mismatch`);
    }
  });
});

for (const [code, framework] of entries) {
  describe(`framework: ${code}`, () => {
    it("I1: schemaVersion === 1", () => {
      assert.equal(framework.schemaVersion, 1);
    });

    it("I3: name + version + description + referenceUrl are non-empty", () => {
      assert.ok(nonEmptyString(framework.name), "name");
      assert.ok(nonEmptyString(framework.version), "version");
      assert.ok(nonEmptyString(framework.description), "description");
      assert.ok(nonEmptyString(framework.referenceUrl), "referenceUrl");
      assert.match(
        framework.referenceUrl,
        /^https?:\/\//,
        "referenceUrl must be an http(s) URL",
      );
    });

    it("I4: jurisdiction is non-empty list of ISO-3166 / recognised sentinel", () => {
      // Recognised sentinels:
      //   GLOBAL        — applies to no specific jurisdiction
      //   INTERNATIONAL — alias of GLOBAL used by international standards bodies (ISO/IEC, NIST)
      //   EU            — European Union member states
      //   EEA           — European Economic Area (EU + Iceland + Liechtenstein + Norway)
      //   UK            — United Kingdom
      const RECOGNISED_SENTINELS = new Set(["GLOBAL", "INTERNATIONAL", "EU", "EEA", "UK"]);
      assert.ok(
        framework.jurisdiction.length > 0,
        "jurisdiction must be non-empty",
      );
      for (const j of framework.jurisdiction) {
        assert.ok(
          RECOGNISED_SENTINELS.has(j) || ISO_3166_PATTERN.test(j),
          `jurisdiction '${j}' is not ISO-3166-alpha-2 nor a recognised sentinel`,
        );
      }
    });

    it("I16: no forbidden trademark markers in metadata", () => {
      noForbiddenMarkers(framework.name, `${code}.name`);
      noForbiddenMarkers(framework.description, `${code}.description`);
    });

    if (!isPopulated(framework)) {
      it("skip: framework is a stub — content invariants deferred", () => {
        // Empty stub. I5-I15 will activate once arrays are populated.
        assert.ok(true);
      });
      return;
    }

    // ─── Populated-framework invariants ─────────────────────────────────────

    const clauseRefs = new Set();
    it("I5 + I6: clauses well-formed and unique", () => {
      assert.ok(
        framework.clauses.length > 0,
        "populated framework must have at least one clause",
      );
      for (const c of framework.clauses) {
        assert.ok(nonEmptyString(c.clauseRef), `clauseRef`);
        assert.ok(nonEmptyString(c.title), `${c.clauseRef}: title`);
        assert.ok(nonEmptyString(c.description), `${c.clauseRef}: description`);
        assert.equal(
          typeof c.mandatory,
          "boolean",
          `${c.clauseRef}: mandatory`,
        );
        assert.equal(
          clauseRefs.has(c.clauseRef),
          false,
          `duplicate clauseRef: ${c.clauseRef}`,
        );
        clauseRefs.add(c.clauseRef);
        noForbiddenMarkers(c.title, `${code}.clause[${c.clauseRef}].title`);
        noForbiddenMarkers(
          c.description,
          `${code}.clause[${c.clauseRef}].description`,
        );
      }
    });

    const controlRefs = new Set();
    it("I7 + I8 + I9 + I10 + I11: controls well-formed and unique", () => {
      assert.ok(
        framework.controls.length > 0,
        "populated framework must have at least one control",
      );
      for (const c of framework.controls) {
        assert.ok(nonEmptyString(c.controlRef), `controlRef`);
        assert.ok(nonEmptyString(c.title), `${c.controlRef}: title`);
        assert.ok(
          nonEmptyString(c.description),
          `${c.controlRef}: description`,
        );
        assert.ok(nonEmptyString(c.category), `${c.controlRef}: category`);
        assert.equal(
          controlRefs.has(c.controlRef),
          false,
          `duplicate controlRef: ${c.controlRef}`,
        );
        controlRefs.add(c.controlRef);

        assert.ok(
          c.evidenceTypes.length > 0,
          `${c.controlRef}: evidenceTypes must be non-empty`,
        );
        for (const et of c.evidenceTypes) {
          assert.ok(
            VALID_EVIDENCE_TYPES.has(et),
            `${c.controlRef}: evidenceType '${et}' is not a valid EvidenceType (12-kind union)`,
          );
        }

        assert.ok(
          c.clauseRefs.length > 0,
          `${c.controlRef}: clauseRefs must be non-empty`,
        );
        for (const ref of c.clauseRefs) {
          assert.ok(
            clauseRefs.has(ref),
            `${c.controlRef}: clauseRef '${ref}' does not exist in ${code}.clauses`,
          );
        }

        assert.ok(
          VALID_RISK_LEVELS.has(c.riskLevel),
          `${c.controlRef}: riskLevel '${c.riskLevel}' is not a valid RiskLevel`,
        );
      }
    });

    const questionRefs = new Set();
    it("I12 + I13 + I14 + I15: questions well-formed and unique", () => {
      assert.ok(
        framework.questions.length > 0,
        "populated framework must have at least one question",
      );
      for (const q of framework.questions) {
        assert.ok(nonEmptyString(q.questionRef), `questionRef`);
        assert.ok(nonEmptyString(q.text), `${q.questionRef}: text`);
        assert.ok(nonEmptyString(q.category), `${q.questionRef}: category`);
        assert.equal(
          questionRefs.has(q.questionRef),
          false,
          `duplicate questionRef: ${q.questionRef}`,
        );
        questionRefs.add(q.questionRef);

        assert.equal(
          typeof q.riskWeight,
          "number",
          `${q.questionRef}: riskWeight must be a number`,
        );
        assert.ok(
          q.riskWeight >= 0 && q.riskWeight <= 1,
          `${q.questionRef}: riskWeight ${q.riskWeight} out of [0, 1]`,
        );

        assert.ok(
          q.clauseRefs.length > 0,
          `${q.questionRef}: clauseRefs must be non-empty`,
        );
        for (const ref of q.clauseRefs) {
          assert.ok(
            clauseRefs.has(ref),
            `${q.questionRef}: clauseRef '${ref}' does not exist in ${code}.clauses`,
          );
        }
      }
    });
  });
}
