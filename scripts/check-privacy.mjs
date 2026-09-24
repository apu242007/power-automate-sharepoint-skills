#!/usr/bin/env node
// Escanea el repo en busca de datos que no deberían publicarse: firmas SAS, secretos, correos y tenants reales.
// Términos propios (empresa, proyectos) NO van en este archivo público: se leen de la variable PRIVACY_DENYLIST
// (regex) o del archivo local .privacy-denylist (una expresión por línea, ignorado por git).
// Uso: node scripts/check-privacy.mjs [ruta]
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, extname } from "node:path";

const root = resolve(process.argv[2] ?? ".");
const SKIP_DIRS = new Set([".git", "node_modules", "dist", ".vite"]);
const SKIP_FILES = new Set(["package-lock.json", "pnpm-lock.yaml", "yarn.lock"]);
const TEXT = new Set([".md", ".json", ".jsonc", ".yml", ".yaml", ".ts", ".tsx", ".js", ".mjs", ".ps1", ".html", ".css", ".txt", ".env", ".example", ".xml"]);

const PLACEHOLDER_HOST = /^(<[^>]+>|tenant|tenant-[ab]|contoso|your-?tenant|example|empresa|micuenta|midominio)$/i;
const OK_EMAIL_DOMAIN = /^(empresa|example|contoso|anthropic)\.(com|org)$/i;
const OK_EMAILS = new Set(["noreply@anthropic.com", "i@izs.me"]);

const RULES = [
  { id: "sas-signature", re: /[?&]sig=[A-Za-z0-9%_-]{20,}/g, why: "firma SAS de una URL de trigger (es una credencial)" },
  { id: "flow-url", re: /https:\/\/prod-\d+\.[a-z0-9.-]+\.logic\.azure\.com\/workflows\/[0-9a-f]+/gi, why: "URL de trigger de un flow" },
  { id: "flow-url-pp", re: /powerplatform\.com\/powerautomate\/automations\/direct\/workflows\/[0-9a-f]+/gi, why: "URL de trigger de un flow" },
  { id: "client-secret", re: /(client_?secret|clientSecret|APP_?SECRET)\s*[:=]\s*["']?[A-Za-z0-9~._-]{16,}/gi, why: "posible secreto de aplicación" },
  { id: "bearer", re: /Bearer\s+eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/g, why: "token JWT pegado" },
  { id: "private-key", re: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/g, why: "clave privada" },
];

function loadDenylist() {
  const items = [];
  if (process.env.PRIVACY_DENYLIST) items.push(process.env.PRIVACY_DENYLIST);
  const f = join(root, ".privacy-denylist");
  if (existsSync(f)) items.push(...readFileSync(f, "utf8").split(/\r?\n/).filter((l) => l.trim() && !l.startsWith("#")));
  return items.map((s) => new RegExp(s, "i"));
}
const deny = loadDenylist();
const findings = [];

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name) || SKIP_FILES.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) yield* walk(p);
    else if (TEXT.has(extname(name).toLowerCase()) || name.startsWith(".env")) yield p;
  }
}

for (const p of walk(root)) {
  const rel = p.slice(root.length + 1).replace(/\\/g, "/");
  if (rel === "scripts/check-privacy.mjs") continue;
  const lines = readFileSync(p, "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    const at = `${rel}:${i + 1}`;
    for (const r of RULES) if (new RegExp(r.re.source, r.re.flags).test(line)) findings.push(`${at}  ${r.why}`);
    for (const m of line.matchAll(/https?:\/\/([a-z0-9-]+)\.sharepoint\.com/gi))
      if (!PLACEHOLDER_HOST.test(m[1])) findings.push(`${at}  tenant real de SharePoint: ${m[0]}`);
    for (const m of line.matchAll(/\b[\w.+-]+@([\w-]+\.[a-z]{2,})\b/gi)) {
      if (OK_EMAILS.has(m[0].toLowerCase()) || OK_EMAIL_DOMAIN.test(m[1])) continue;
      findings.push(`${at}  correo real: ${m[0]}`);
    }
    for (const d of deny) if (d.test(line)) findings.push(`${at}  coincide con la lista privada de términos`);
  });
}

if (!deny.length) console.warn("AVISO: no hay lista privada de términos (PRIVACY_DENYLIST o .privacy-denylist); solo se aplican reglas genéricas.");
if (findings.length) {
  console.error(findings.map((f) => `HALLAZGO  ${f}`).join("\n"));
  console.error(`\n${findings.length} hallazgo(s). Corregí antes de publicar.`);
  process.exit(1);
}
console.log("OK: sin datos privados detectados.");
