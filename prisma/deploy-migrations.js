/**
 * Applies pending Prisma migrations — but ONLY on Vercel.
 *
 * Runs from `postinstall`. Local `npm install` must never mutate the
 * database, so this gates on the VERCEL env var (Vercel sets VERCEL=1
 * automatically during its build). `prisma migrate deploy` is the
 * production-safe command: it only applies committed migrations and
 * never generates or resets anything. It uses the datasource's
 * `directUrl` (DIRECT_URL) automatically — so DIRECT_URL must be set
 * in the Vercel project env (non-pooled, port 5432).
 */
const { execSync } = require("node:child_process");

if (!process.env.VERCEL) {
  console.log("[prisma] Not on Vercel — skipping `migrate deploy`.");
  process.exit(0);
}

try {
  console.log("[prisma] Vercel build detected — running `prisma migrate deploy`…");
  execSync("npx --no-install prisma migrate deploy", { stdio: "inherit" });
} catch (err) {
  console.error("[prisma] migrate deploy failed:", err.message);
  // Fail the build so a broken/missing migration never ships silently.
  process.exit(1);
}
