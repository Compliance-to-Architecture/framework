/**
 * Crosswalks integrity test.
 *
 * Asserts that every edge in `CROSSWALKS` resolves to a real `clauseRef`
 * in the corresponding framework's clause list. With the §8.1 backfill
 * now landed, this test catches drift between the crosswalk data and
 * the framework modules — e.g. a clause being renamed without updating
 * the crosswalks, or a typo in `clauseRef` that an editor wouldn't flag.
 *
 * Runs alongside the 16-invariant conformance suite via
 * `pnpm --filter @regunav/frameworks test`.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { FRAMEWORK_REGISTRY, CROSSWALKS } from "../dist/index.js";

function clauseRefsForFramework(code) {
  const f = FRAMEWORK_REGISTRY[code];
  if (!f) return null;
  return new Set(f.clauses.map((c) => c.clauseRef));
}

describe("crosswalks integrity", () => {
  it("is non-empty (sanity)", () => {
    assert.ok(CROSSWALKS.length > 0, "CROSSWALKS is empty");
  });

  it("every edge resolves to real frameworks + clauses on both sides", () => {
    const failures = [];
    for (const e of CROSSWALKS) {
      const fromClauses = clauseRefsForFramework(e.fromFramework);
      const toClauses = clauseRefsForFramework(e.toFramework);
      if (!fromClauses) {
        failures.push(`unknown framework: ${e.fromFramework}`);
        continue;
      }
      if (!toClauses) {
        failures.push(`unknown framework: ${e.toFramework}`);
        continue;
      }
      // Allow crosswalks to point at clauseRefs in frameworks whose
      // arrays are still empty (stub) — that's a different invariant
      // covered by the no-stubs gate, not by integrity.
      if (fromClauses.size > 0 && !fromClauses.has(e.fromClauseRef)) {
        failures.push(
          `${e.fromFramework}.${e.fromClauseRef} -> ${e.toFramework}.${e.toClauseRef}: fromClauseRef '${e.fromClauseRef}' not in ${e.fromFramework}.clauses`,
        );
      }
      if (toClauses.size > 0 && !toClauses.has(e.toClauseRef)) {
        failures.push(
          `${e.fromFramework}.${e.fromClauseRef} -> ${e.toFramework}.${e.toClauseRef}: toClauseRef '${e.toClauseRef}' not in ${e.toFramework}.clauses`,
        );
      }
    }
    assert.equal(
      failures.length,
      0,
      `${failures.length} crosswalk edge(s) reference clauses that do not exist:\n  - ${failures.join("\n  - ")}`,
    );
  });

  it("confidence is in [0, 1]", () => {
    for (const e of CROSSWALKS) {
      assert.ok(
        e.confidence >= 0 && e.confidence <= 1,
        `edge ${e.fromFramework}.${e.fromClauseRef} -> ${e.toFramework}.${e.toClauseRef}: confidence ${e.confidence} out of [0, 1]`,
      );
    }
  });

  it("rationale is non-empty for every edge", () => {
    for (const e of CROSSWALKS) {
      assert.ok(
        typeof e.rationale === "string" && e.rationale.trim().length > 0,
        `edge ${e.fromFramework}.${e.fromClauseRef} -> ${e.toFramework}.${e.toClauseRef}: rationale is empty`,
      );
    }
  });

  it("no self-edges (a framework's clause does not cross-walk to itself)", () => {
    for (const e of CROSSWALKS) {
      assert.ok(
        !(e.fromFramework === e.toFramework && e.fromClauseRef === e.toClauseRef),
        `self-edge detected: ${e.fromFramework}.${e.fromClauseRef}`,
      );
    }
  });
});
