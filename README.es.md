# power-automate-sharepoint-skills

[![Validate](https://github.com/apu242007/power-automate-sharepoint-skills/actions/workflows/validate.yml/badge.svg)](https://github.com/apu242007/power-automate-sharepoint-skills/actions/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Que tu agente de IA arme la página web, el flow de Power Automate y la lista de SharePoint desde tu propia computadora, y sepa por qué se rompe.**

Una skill de agente para Claude Code, GitHub Copilot en VS Code, Codex, Cursor y cualquier agente que lea el formato [Agent Skills](https://agentskills.io/specification). Le enseña al agente a conectar una **página web externa** (React/Vite o una PWA estática) con **SharePoint a través de Power Automate**, a crear y modificar esos flows **como código desde tu terminal** con la CLI de Power Platform (`pac`) en vez de editarlos a mano en el portal, y las trampas que solo aparecen en ejecución: límites, licencias, políticas del tenant, con el **síntoma exacto**, la causa y el arreglo, y los datos de plataforma verificados contra Microsoft Learn (con fecha y enlace).

> 🇬🇧 [Read in English](README.md) · Las secciones clave de plataforma (§21–§23, §26, §29, §30, §32) tienen **traducción al inglés** en `references/en/`.

![La misma pregunta respondida sin y con la skill: un flow poco usado que se apagó solo, y el error "disabled by your organization"](docs/demo-with-vs-without-skill.gif)

*Extractos de respuestas reales del mismo modelo, sin la skill (izquierda) y con ella (derecha); el texto resaltado es lo que le faltaba a la respuesta sin la skill. n = 1 por condición, texto abreviado.*

## Qué hace y qué no hace

La skill es **conocimiento que el agente lee**. No se conecta a nada por sí sola ni inicia sesión por vos. El trabajo lo hace tu agente con sus propias herramientas (terminal, `pac`, edición de archivos), y la skill le dice cuál es el camino soportado y qué puede salir mal.

**Uso típico.** Le pedís a tu agente, en VS Code o en una terminal:

> "Armá una página pública que envíe un formulario a SharePoint a través de un flow de Power Automate. Creá el flow como código con `pac`, importalo en mi entorno de desarrollo y dame la página."

Con la skill cargada, el agente conoce el pipeline (página → flow con trigger HTTP → lista de SharePoint), el camino soportado por CLI para el flow, el default de autenticación del trigger que devuelve 401, los límites y qué pedirle a IT cuando las políticas se interponen.

### Qué se probó con una corrida real de un agente

Probado el 2026-09-24 con `pac` 2.12.2 en un **entorno de desarrollador** (no producción), escribiendo en una lista de SharePoint de prueba. Los detalles y las trampas están en §26.7.

| Paso | Estado |
|---|---|
| Iniciar sesión desde la terminal con `pac auth create --deviceCode` | Probado |
| Crear un proyecto de solución y un flow con trigger HTTP **como código**, `pack` e `import` | Probado |
| Flow activado tras el import, sin abrir el diseñador | Probado (un flow sin conexiones) |
| POST desde fuera a la URL del trigger; historial de corridas con `pac power-automate list-flow-runs` | Probado |
| Cambiar el flow por código (campo nuevo), reimportar y que quede la definición nueva | Probado |
| Connection reference de SharePoint en la solución + archivo de despliegue, import | Import probado |
| Crear una lista y una columna de SharePoint por código (un flow programado con llamadas REST) | Probado |
| Un flow con acción de SharePoint **escribe una fila** (el POST desde fuera devolvió el `Id` de la fila) | Probado |
| Obtener la URL del trigger por código | **No se puede con `pac`**: se copia del diseñador |
| Crear la conexión de SharePoint por código | No cubierto: en la prueba se creó en el portal, y tras el import hubo que abrir los flows, activarlos y ejecutarlos ahí (no se confirmó cuál de esos pasos hacía falta) |
| Construir apps de lienzo de Power Apps | No cubierto (Power Apps aparece solo como quien llama al flow) |

Igual necesitás: `pac` instalado y con sesión en un entorno que puedas modificar, licencia Premium donde el trigger HTTP la exija, y permiso sobre el sitio de SharePoint. Mirá `pac auth who` antes de cada import para no tocar el entorno equivocado.

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
- **Flows como código, de dos maneras**: el camino **soportado** (PAC CLI + tabla `workflow` de Dataverse, con una receta probada en una corrida real) y el camino no soportado de paquete + API de administración (solo desarrollo).
- **Kit de arranque probado** (`assets/spa-starter/`): SPA con firma, fotos, borrador versionado, service worker y cliente de envío con reintentos idempotentes; 108 tests.
- **Diseño**: seguridad de un endpoint público, listas e índices, resiliencia (try/catch, reintentos idempotentes) y datos personales.
- **29 evals estáticos + CI** en cada push: validador oficial, estructura, escaneo de privacidad y enlaces.

## Preguntas para las que está hecha

| Preguntale a tu agente | Debe llevar a |
|---|---|
| "Creá un flow HTTP desde cero con `pac` e importalo" | §26.7: la receta probada, con las trampas observadas y lo que **no** se probó |
| "Mi SPA recibe 401 del flow recién creado" | §21.1: el default de *Who can trigger the flow* es **Any user in my tenant**, no *Anyone* |
| "La corrida está verde pero faltan adjuntos" | §22.1: `Response` temprano y falla manejada; cerrar el Catch con `Terminate → Failed` |
| "`Get items` trae solo 100 / vacío en una lista grande" | §23: Top Count, paginación, columnas indexadas y el umbral de 5.000 |
| "Anda con datos móviles pero no desde la oficina" | §29.4: dominios que IT debe permitir |
| "¿Cómo exporto, edito y reimporto un flow de solución por CLI?" | §26: `pac solution export / unpack / pack / import` |
| "Un flow que no toqué se apagó solo" | §21.3: 90 días sin actividad, 14 días de fallas, y la excepción para dueños Premium o licencias Process |
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

Para seguir la receta probada también necesitás la [CLI de Power Platform](https://learn.microsoft.com/power-platform/developer/cli/introduction) (`pac`), con sesión en un entorno de desarrollo.

## Cómo está organizado el contenido

`SKILL.md` es un índice liviano (enrutador de síntoma a archivo, más 16 reglas innegociables). El detalle está en `references/`: las secciones §1–§34 cubren desde la seguridad de un endpoint público y la SPA, hasta el catálogo de errores (§13–§17), los flows como código (§20 y §26), licencias y límites (§21), resiliencia (§22), SharePoint a escala (§23), soluciones (§24), gobernanza del tenant (§29), correo (§30), permisos `Sites.Selected` (§32) y el kit de arranque (§34). La tabla completa, con el archivo de cada sección, está en el [README en inglés](README.md#how-the-content-is-organised).

## Por qué confiar

- **Fuentes y fechas.** Los datos de plataforma terminan con un bloque *Fuentes* (Microsoft Learn). Lo no confirmado dice **NO VERIFICADO** y se indica el origen (documentación oficial, foro, observación propia).
- **Lo probado se marca como probado.** La receta de flows como código (§26.7) sale de una corrida real, con fechas y versiones, y dice qué no se probó.
- **Validada en cada push**: el [validador de referencia de agentskills.io](https://agentskills.io/specification), controles de estructura y enlaces, un escaneo de privacidad (sin tenants, correos ni URLs de trigger) y 29 evals estáticos que evitan que el enrutador y los datos clave retrocedan.
- **Honesta sobre lo que cambia.** Las cuotas y los valores por defecto cambian: por ejemplo, el default de *Who can trigger the flow* en flows nuevos es **Any user in my tenant**, y Microsoft describe *Anyone* como el modo heredado. El changelog registra qué se verificó y cuándo.
- **Notas de uso responsable** donde una técnica podría malinterpretarse (§18.1, §20.2): solo tokens delegados, visibles en los registros de inicio de sesión, y no reemplazan un registro de aplicación aprobado.

## Alcance y límites

- Es experiencia de campo más investigación de documentación: **no es documentación oficial de Microsoft** ni tiene relación con Microsoft o las herramientas mencionadas.
- Está construida alrededor de un pipeline real: SPA/PWA pública → flow con trigger HTTP → SharePoint. Dataverse, Power Apps y SPFx aparecen solo donde tocan ese pipeline.
- Cambiar flows por código modifica un entorno real. Usá un entorno de desarrollo, verificá el perfil activo de `pac` y seguí las políticas de tu organización.
- Hay detalles de Argentina (patentes, feriados, Ley 25.326). §33 es una guía técnica, **no asesoría legal**.
- Los límites y valores por defecto cambian: cada dato lleva su fuente y fecha, y lo no confirmado dice **NO VERIFICADO**.

## Hoja de ruta

Ver [CHANGELOG.md](CHANGELOG.md) → *Planned*: la creación de apps de Power Apps (`pac canvas`), averiguar qué paso posterior al import activa de verdad los flows, la traducción al inglés de las secciones restantes, PDF en servidor, mapas/GPS, cola sin conexión, Approvals frente a aprobación por enlace, Teams y Adaptive Cards.

## Contribuir

Los issues y PR son bienvenidos, sobre todo **errores nuevos con el síntoma exacto** y **correcciones de datos que cambiaron** (con fuente). Leé [CONTRIBUTING.md](CONTRIBUTING.md) y [SECURITY.md](SECURITY.md). Nunca incluyas tenants, nombres de empresa, correos ni URLs de trigger.

## Licencia

[MIT](LICENSE)
