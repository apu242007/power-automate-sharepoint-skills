# power-automate-sharepoint-skills

[![Validate](https://github.com/apu242007/power-automate-sharepoint-skills/actions/workflows/validate.yml/badge.svg)](https://github.com/apu242007/power-automate-sharepoint-skills/actions/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Una skill de agente que sabe por qué se rompió tu pipeline de Power Automate + SharePoint.**
Trae las trampas que solo aparecen en ejecución, los límites y licencias que nadie te avisa, y las políticas del tenant que aplica tu equipo de IT. Todo con el **síntoma exacto**, la causa y el arreglo, y con los datos de plataforma verificados contra Microsoft Learn (con fecha y enlace).

> 🇬🇧 [Read in English](README.md) · Las secciones clave de plataforma (§21–§23, §26, §29, §30, §32) tienen **traducción al inglés** en `references/en/`.

## El problema

Armás un formulario web público, sin login (React/Vite o una PWA estática en GitHub Pages) que hace POST a un **flow de Power Automate con trigger HTTP** que escribe en **SharePoint**. En tu máquina anda. Y después:

- el flow nuevo devuelve **401** al navegador y el historial de ejecución está vacío,
- la corrida figura en verde pero **faltan los adjuntos**,
- `Get items` devuelve **100 filas**, o nada pasado los **5.000**,
- el flow **se apaga solo**, o falla con `DirectApiAuthorizationRequired`,
- funciona con datos móviles y falla en la **red de la empresa**,
- `Obtener contenido de archivo` dice `Route did not match` con una ruta perfectamente válida.

Un agente potente muchas veces acierta la causa principal por su cuenta. Lo que suele faltarle es el detalle de segundo orden: las excepciones, las cifras exactas, las salvedades y los "no hagas esto", cada uno con su fuente. En una comparación de 8 síntomas, las respuestas con la skill cubrieron los 44 hechos verificados y sin ella 25 (muestra chica y sesgada por construcción: ver [`evals/comparison.md`](evals/comparison.md)).

## Qué incluye

- **34 secciones en 22 archivos de referencia**, enrutados desde un índice liviano: el agente carga solo lo que necesita.
- **78 filas de catálogo de errores**: síntoma → causa → arreglo.
- **Límites y licencias con fuente y fecha**: default de autenticación del trigger, Premium, 120 s / 100 MB, umbrales, throttling, apagado automático, DLP.
- **Dos caminos para flows como código**: paquete + API de administración (no soportada, solo desarrollo) y el camino **soportado**: PAC CLI + tabla `workflow` de Dataverse.
- **Kit de arranque probado** (`assets/spa-starter/`): SPA con firma, fotos, borrador versionado, service worker y cliente de envío con reintentos idempotentes; 108 tests.
- **Diseño**: seguridad de un endpoint público, listas e índices, resiliencia (try/catch, reintentos idempotentes) y datos personales.
- **27 evals estáticos + CI** en cada push: validador oficial, estructura, escaneo de privacidad y enlaces.

## Preguntas para las que está hecha

| Preguntale a tu agente | Debe llevar a |
|---|---|
| "Mi SPA recibe 401 del flow recién creado" | §21.1: el default de *Who can trigger the flow* es **Any user in my tenant**, no *Anyone* |
| "La corrida está verde pero faltan adjuntos" | §22.1: `Response` temprano y falla manejada; cerrar el Catch con `Terminate → Failed` |
| "`Get items` trae solo 100 / vacío en una lista grande" | §23: Top Count, paginación, columnas indexadas y el umbral de 5.000 |
| "Anda con datos móviles pero no desde la oficina" | §29.4: dominios que IT debe permitir |
| "¿Cómo exporto, edito y reimporto un flow de solución por CLI?" | §26: `pac solution export / unpack / pack / import` |
| "IT no me da permisos sobre todo el tenant" | §32: `Sites.Selected` y un pedido corto y aprobable |
| "`Route did not match` en *Get file content*" | §28.2: pasar `{Identifier}`, no una ruta armada a mano |

## Instalar

```bash
npx skills add https://github.com/apu242007/power-automate-sharepoint-skills --skill spa-sharepoint-power-automate
```

```text
# Marketplace de plugins de Claude Code
/plugin marketplace add apu242007/power-automate-sharepoint-skills
/plugin install spa-sharepoint-power-automate@power-automate-sharepoint-skills
```

O copiá `skills/spa-sharepoint-power-automate/` a la carpeta de skills de tu agente. Abrí una sesión nueva y **leé cualquier skill antes de instalarla**: corre con los permisos de tu agente.

## Alcance y límites

- Es experiencia de campo más investigación de documentación: **no es documentación oficial de Microsoft** ni tiene relación con Microsoft o las herramientas mencionadas.
- Está construida alrededor de un pipeline real: SPA/PWA pública → flow con trigger HTTP → SharePoint. Dataverse, Power Apps y SPFx aparecen solo donde tocan ese pipeline.
- Hay detalles de Argentina (patentes, feriados, Ley 25.326). §33 es una guía técnica, **no asesoría legal**.
- Los límites y valores por defecto cambian: cada dato lleva su fuente y fecha, y lo no confirmado dice **NO VERIFICADO**.

## Contribuir

Los issues y PR son bienvenidos, sobre todo **errores nuevos con el síntoma exacto** y **correcciones de datos que cambiaron** (con fuente). Leé [CONTRIBUTING.md](CONTRIBUTING.md) y [SECURITY.md](SECURITY.md). Nunca incluyas tenants, nombres de empresa, correos ni URLs de trigger.

## Licencia

[MIT](LICENSE)
