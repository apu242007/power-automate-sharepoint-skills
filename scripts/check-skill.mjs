#!/usr/bin/env node
// Valida la estructura de cada skill en skills/*: frontmatter, tamaño del índice, referencias y enlaces relativos.
// Sin dependencias. Uso: node scripts/check-skill.mjs [directorio-de-skills]
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "skills");
const errors = [];
const warnings = [];
const err = (skill, msg) => errors.push(`[${skill}] ${msg}`);
const warn = (skill, msg) => warnings.push(`[${skill}] ${msg}`);

function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) return null;
  const lines = m[1].split(/\r?\n/);
  const fm = {};
  for (let i = 0; i < lines.length; i++) {
    const kv = lines[i].match(/^([A-Za-z_-]+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, rest] = kv;
    if (/^[>|][-+]?$/.test(rest)) {
      const buf = [];
      while (i + 1 < lines.length && /^\s+/.test(lines[i + 1])) buf.push(lines[++i].trim());
      fm[key] = buf.join(" ");
    } else if (rest === "") {
      const buf = [];
      while (i + 1 < lines.length && /^\s+/.test(lines[i + 1])) buf.push(lines[++i]);
      fm[key] = buf.join("\n");
    } else {
      fm[key] = rest.replace(/^["']|["']$/g, "");
    }
  }
  return { fm, end: m[0].length };
}

const skills = readdirSync(root).filter((d) => statSync(join(root, d)).isDirectory());
if (!skills.length) {
  console.error(`No se encontraron skills en ${root}`);
  process.exit(1);
}

for (const name of skills) {
  const dir = join(root, name);
  const file = join(dir, "SKILL.md");
  if (!existsSync(file)) { err(name, "falta SKILL.md"); continue; }
  const text = readFileSync(file, "utf8");
  const parsed = parseFrontmatter(text);
  if (!parsed) { err(name, "SKILL.md sin frontmatter válido"); continue; }
  const { fm } = parsed;

  // spec agentskills.io
  if (fm.name !== name) err(name, `name ("${fm.name}") debe coincidir con la carpeta ("${name}")`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(fm.name ?? "")) err(name, "name debe ir en minúsculas con guiones");
  if ((fm.name ?? "").length > 64) err(name, "name supera 64 caracteres");
  if (!fm.description) err(name, "falta description");
  else if (fm.description.length > 1024) err(name, `description mide ${fm.description.length} caracteres (máximo 1024)`);
  if (!fm.license) warn(name, "sin campo license");
  if (!/version:\s*"?\d+\.\d+\.\d+/.test(fm.metadata ?? "")) warn(name, "sin metadata.version (semver)");

  // índice liviano
  const lines = text.split(/\r?\n/).length;
  if (lines >= 500) err(name, `SKILL.md tiene ${lines} líneas (máximo recomendado: menos de 500)`);

  // referencias
  const refDir = join(dir, "references");
  const refFiles = existsSync(refDir) ? readdirSync(refDir).filter((f) => f.endsWith(".md")) : [];
  const mentioned = new Set([...text.matchAll(/`(\d{2}-[a-z0-9-]+\.md)`/g)].map((m) => m[1]));
  for (const f of mentioned) if (!refFiles.includes(f)) err(name, `SKILL.md menciona references/${f} pero no existe`);
  for (const f of refFiles) if (!mentioned.has(f)) err(name, `references/${f} no está enlazado desde el índice de SKILL.md`);

  // cada referencia declara sus secciones y no supera un tamaño razonable
  for (const f of refFiles) {
    const body = readFileSync(join(refDir, f), "utf8");
    if (!/^# \d+ · /m.test(body)) warn(name, `references/${f} no tiene un encabezado "# N · Título"`);
    if (body.length > 60_000) warn(name, `references/${f} pesa ${(body.length / 1024).toFixed(0)} KB: considerá dividirlo`);
  }

  // enlaces markdown relativos
  const mdFiles = [file, ...refFiles.map((f) => join(refDir, f))];
  for (const p of mdFiles) {
    const body = readFileSync(p, "utf8").replace(/```[\s\S]*?```/g, "");
    for (const m of body.matchAll(/\]\(((?!https?:|mailto:|#)[^)\s]+)\)/g)) {
      const target = resolve(dirname(p), m[1].split("#")[0]);
      if (m[1].split("#")[0] && !existsSync(target)) err(name, `enlace roto en ${p.replace(dir + "\\", "").replace(dir + "/", "")}: ${m[1]}`);
    }
  }

  // §N únicos en los encabezados de nivel 1
  const seen = new Map();
  for (const f of refFiles) {
    for (const m of readFileSync(join(refDir, f), "utf8").matchAll(/^# (\d+) · /gm)) {
      if (seen.has(m[1])) err(name, `sección §${m[1]} duplicada en ${f} y ${seen.get(m[1])}`);
      seen.set(m[1], f);
    }
  }

  console.log(`${name}: ${lines} líneas en SKILL.md · ${refFiles.length} referencias · ${seen.size} secciones · description ${fm.description?.length ?? 0}/1024`);
}

for (const w of warnings) console.warn(`AVISO  ${w}`);
for (const e of errors) console.error(`ERROR  ${e}`);
if (errors.length) { console.error(`\n${errors.length} error(es).`); process.exit(1); }
console.log("\nOK: estructura válida.");
