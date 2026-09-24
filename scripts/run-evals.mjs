#!/usr/bin/env node
// Evaluación ESTÁTICA: comprueba, para cada caso de evals/cases.json, que (1) el router de SKILL.md envía a la
// referencia correcta, (2) la sección existe y (3) contiene los datos que la respuesta necesita.
// No llama a ningún modelo: detecta regresiones de contenido (un dato borrado o un router roto).
// Uso: node scripts/run-evals.mjs
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const casesFile = JSON.parse(readFileSync("evals/cases.json", "utf8"));
const skillDir = join("skills", casesFile.skill);
const skillMd = readFileSync(join(skillDir, "SKILL.md"), "utf8");
const routerRows = skillMd.split(/\r?\n/).filter((l) => l.startsWith("|"));

let pass = 0;
const fails = [];
for (const c of casesFile.cases) {
  const problems = [];
  // 1) router: alguna fila de la tabla cita `NN` y contiene alguna palabra clave del caso
  const row = routerRows.find((r) => r.includes("`" + c.router + "`") && c.keywords.some((k) => r.toLowerCase().includes(k.toLowerCase())));
  if (!row) problems.push("el router no envía a `" + c.router + "` con palabras clave " + JSON.stringify(c.keywords));
  // 2) archivo + sección
  const path = join(skillDir, "references", c.file);
  if (!existsSync(path)) {
    problems.push("no existe references/" + c.file);
  } else {
    const body = readFileSync(path, "utf8");
    const esc = c.section.replace(/\./g, "\\.");
    const sec = c.section.includes(".") ? new RegExp("^#{2,3} " + esc + "[ ·.]", "m") : new RegExp("^# " + esc + " · ", "m");
    if (!sec.test(body)) problems.push("no se encuentra la sección §" + c.section);
    for (const s of c.must_include) if (!body.toLowerCase().includes(s.toLowerCase())) problems.push('falta el dato "' + s + '"');
  }
  if (problems.length) fails.push("✗ " + c.id + ": " + problems.join("; "));
  else pass++;
}
console.log("Evals estáticos: " + pass + "/" + casesFile.cases.length + " correctos");
for (const f of fails) console.error(f);
process.exit(fails.length ? 1 : 0);
