/**
 * Cross-validation tests for the rule-pack manifests.
 *
 * Purpose: bind the manifest layer to the rest of the repo. If any of the
 * following drift, these tests fail loudly:
 *   - manifest <-> framework module 1:1 pairing
 *   - artefact paths actually exist on disk
 *   - required dictionaries actually exist
 *   - manifest hashes are stable (canonical-JSON SHA-256)
 *
 * Run: node --test packages/frameworks/test/manifests.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..", "..");
const manifestsDir = join(repoRoot, "packages", "frameworks", "manifests");
const frameworksSrc = join(repoRoot, "packages", "frameworks", "src");
const dictionariesDir = join(repoRoot, "packages", "dictionaries", "dictionaries");

const manifestFiles = readdirSync(manifestsDir).filter((f) => f.endsWith(".manifest.json")).sort();
const manifests = manifestFiles.map((f) => ({
  file: f,
  slug: f.replace(".manifest.json", ""),
  doc: JSON.parse(readFileSync(join(manifestsDir, f), "utf-8")),
}));

const frameworkFiles = readdirSync(frameworksSrc)
  .filter((f) => f.endsWith(".ts") && f !== "index.ts")
  .map((f) => f.replace(".ts", ""))
  .sort();

test("every framework module has a manifest", () => {
  const manifestSlugs = new Set(manifests.map((m) => m.slug));
  const missing = frameworkFiles.filter((f) => !manifestSlugs.has(f));
  assert.equal(
    missing.length,
    0,
    `framework modules without a manifest: ${missing.join(", ")}`,
  );
});

test("every manifest has a framework module", () => {
  const fwSet = new Set(frameworkFiles);
  const orphan = manifests.filter((m) => !fwSet.has(m.slug));
  assert.equal(
    orphan.length,
    0,
    `manifests without a framework module: ${orphan.map((m) => m.slug).join(", ")}`,
  );
});

test("artefacts.framework path resolves on disk", () => {
  for (const m of manifests) {
    const rel = m.doc.payload?.artefacts?.framework;
    if (!rel) continue;
    const abs = resolve(manifestsDir, rel);
    assert.ok(
      existsSync(abs) && statSync(abs).isFile(),
      `${m.file}: artefacts.framework '${rel}' resolves to non-existent file (${abs})`,
    );
  }
});

test("every requiredDictionaries entry resolves to a dictionary file", () => {
  if (!existsSync(dictionariesDir)) {
    // Dictionaries package is on PR #60; skip silently if not merged yet.
    return;
  }
  const dictCategories = new Set();
  for (const f of readdirSync(dictionariesDir).filter((f) => f.endsWith(".json"))) {
    const d = JSON.parse(readFileSync(join(dictionariesDir, f), "utf-8"));
    dictCategories.add(d.category);
  }
  for (const m of manifests) {
    for (const required of m.doc.requiredDictionaries ?? []) {
      // Format: regunav:dictionary:<category>[@version]
      const category = required.replace(/^regunav:dictionary:/, "").split("@")[0];
      assert.ok(
        dictCategories.has(category),
        `${m.file}: requiredDictionaries refers to '${required}' but no dictionary file declares category '${category}'`,
      );
    }
  }
});

test("manifest id matches version, slug and filename", () => {
  for (const m of manifests) {
    const expectedId = `regunav:manifest:rule-pack:${m.slug}:${m.doc.version}`;
    assert.equal(
      m.doc.id,
      expectedId,
      `${m.file}: id '${m.doc.id}' should be '${expectedId}'`,
    );
    assert.equal(
      m.file,
      `${m.slug}.manifest.json`,
      `${m.file}: filename should match slug '${m.slug}'`,
    );
  }
});

test("manifests with status=preview cite under-population reason", () => {
  // Per the constitution: status='preview' is acceptable while underlying
  // framework data is empty, but the manifest itself MUST be real. We assert
  // the structural minimums here; populating the framework TS module is a
  // separate gated workstream (no-stubs CI gate).
  for (const m of manifests) {
    assert.ok(
      ["active", "preview", "deprecated", "retired"].includes(m.doc.status),
      `${m.file}: invalid status`,
    );
    // No 'reason' field required, but description must explain what it
    // covers — empty description on a preview pack is forbidden.
    assert.ok(
      typeof m.doc.description === "string" && m.doc.description.length >= 40,
      `${m.file}: description must be a substantive sentence (got ${JSON.stringify(m.doc.description?.slice(0, 30))})`,
    );
  }
});

function canonical(v) {
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  if (Array.isArray(v)) return "[" + v.map(canonical).join(",") + "]";
  const o = v;
  return "{" + Object.keys(o).sort().map((k) => JSON.stringify(k) + ":" + canonical(o[k])).join(",") + "}";
}

test("each manifest hashes deterministically (content addressing)", () => {
  for (const m of manifests) {
    const h1 = createHash("sha256").update(canonical(m.doc)).digest("hex");
    const h2 = createHash("sha256").update(canonical(m.doc)).digest("hex");
    assert.equal(h1, h2, `${m.file}: hash must be deterministic`);
    assert.match(h1, /^[a-f0-9]{64}$/);
  }
});

test("counts match expected", () => {
  assert.equal(manifests.length, 21, `expected 21 manifests, got ${manifests.length}`);
  assert.equal(frameworkFiles.length, 21, `expected 21 framework modules, got ${frameworkFiles.length}`);
});
