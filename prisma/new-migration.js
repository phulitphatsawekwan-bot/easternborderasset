/**
 * Authors a new Prisma migration WITHOUT a shadow database
 * (Supabase free plan can't create one for `migrate dev`).
 *
 * It diffs the LIVE database (the datasource connection) against the
 * desired models in schema.prisma and writes the resulting SQL into a
 * new timestamped migration folder. You then review it, commit, and
 * push — Vercel runs `prisma migrate deploy` on deploy.
 *
 * Usage:  npm run migrate:new -- <name>
 */
const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const name = process.argv[2];
if (!name) {
  console.error("Usage: npm run migrate:new -- <name>");
  process.exit(1);
}

const root = path.join(__dirname, "..");
const ts = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
const dir = path.join(__dirname, "migrations", `${ts}_${name}`);
const out = path.join(dir, "migration.sql");
fs.mkdirSync(dir, { recursive: true });

try {
  execSync(
    "npx --no-install prisma migrate diff " +
      "--from-schema-datasource ./prisma/schema.prisma " +
      "--to-schema-datamodel ./prisma/schema.prisma " +
      `--script > "${out}"`,
    { stdio: "inherit", shell: true, cwd: root }
  );
} catch (err) {
  fs.rmSync(dir, { recursive: true, force: true });
  console.error("[prisma] migrate diff failed:", err.message);
  process.exit(1);
}

const sql = fs.readFileSync(out, "utf8").trim();
if (!sql || /empty migration/i.test(sql)) {
  fs.rmSync(dir, { recursive: true, force: true });
  console.log("No schema changes detected — nothing to migrate.");
  process.exit(0);
}

console.log(`\nCreated  prisma/migrations/${ts}_${name}/migration.sql`);
console.log("Next: review the SQL, then either");
console.log("  • git add prisma/migrations && git commit && git push   (Vercel applies it)");
console.log("  • npm run migrate:deploy                                 (apply now, locally)");
