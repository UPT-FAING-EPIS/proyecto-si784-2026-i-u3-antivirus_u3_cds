<center>

![./media/logo-upt.png](./media/logo-upt.png)

**UNIVERSIDAD PRIVADA DE TACNA**

**FACULTAD DE INGENIERIA**

**Escuela Profesional de Ingeniería de Sistemas**

**Proyecto de Antivirus**

Curso: *Calidad y Pruebas de Software*

Docente: *Mag. Patrick Cuadros Quiroga*

Integrantes:

***LLica Mamani, Jimmy Mijair (2023076789)***

***Sierra Ruiz, Iker Alberto (2023077090)***

**Tacna – Perú**

***2026***

</center>

<div style="page-break-after: always; visibility: hidden"></div>

Sistema *RustGuard Antivirus*

Estándar de Programación

Versión *1.0*

| CONTROL DE VERSIONES | | | | |
|:---:|:---|:---|:---|:---|
| Versión | Hecha por | Revisada por | Aprobada por | Fecha | Motivo |
| 1.0 | Equipo RustGuard | Mag. Patrick Cuadros Quiroga | Equipo RustGuard | 04/07/2026 | Documentación de Convenciones de Código (Multi-lenguaje) |

<div style="page-break-after: always; visibility: hidden"></div>

# **INDICE GENERAL**

[1. Introducción](#1-introducción)

[2. Estándares Generales de Nomenclatura](#2-estándares-generales-de-nomenclatura)

[3. Estándares para el Ecosistema Python (Action)](#3-estándares-para-el-ecosistema-python-action)

[4. Estándares para el Ecosistema TypeScript (VSCode)](#4-estándares-para-el-ecosistema-typescript-vscode)

[5. Estándares para el Ecosistema Node.js (Telegram Bot)](#5-estándares-para-el-ecosistema-nodejs-telegram-bot)

[6. Manejo de Errores y Seguridad (Universal)](#6-manejo-de-errores-y-seguridad-universal)

<div style="page-break-after: always; visibility: hidden"></div>

## 1. Introducción

El sistema **RustGuard** se construye sobre tres plataformas con tecnologías radicalmente diferentes (Python, TypeScript y JavaScript puro). Mantener la calidad del software (SQA) requiere la definición de un **Estándar de Programación** unificado pero adaptativo, el cual dicta las convenciones semánticas, estructurales y de seguridad para los colaboradores del proyecto.

---

## 2. Estándares Generales de Nomenclatura

Independientemente del lenguaje de programación empleado, RustGuard adopta las siguientes reglas semánticas:

* **Idioma de Funciones y Variables:** Todas las funciones algorítmicas, variables internas, y nombres de estructuras deben escribirse en **Inglés**. (Ej. `checkBinaryHeaders()`, `KNOWN_MALWARE_HASHES`).
* **Idioma de Logs y UI:** Todos los mensajes de Output, alertas (`console.log`, `vscode.window.showWarningMessage`), y descripciones dirigidas al usuario deben estar estricta y profesionalmente redactados en **Español** con codificación UTF-8.
* **Constantes:** Toda variable estática inmutable en tiempo de compilación o ejecución debe escribirse en `UPPER_SNAKE_CASE` (Ej. `TEMP_DIR`, `SUSPICIOUS_PATTERNS`).

---

## 3. Estándares para el Ecosistema Python (Action)

El script del escaner `scanner.py` se adhiere a la Guía de Estilos **PEP-8**.

* **Variables y Funciones:** Emplear exclusivamente `snake_case` (Ej. `scan_directory()`, `file_path`).
* **Módulos:** Agrupar importaciones nativas al inicio del archivo (ej. `import os, sys, re`), separadas por una línea de las importaciones de terceros.
* **Retornos de Salida:** Las salidas tempranas o de finalización forzada deben realizarse exclusivamente vía `sys.exit(0)` (éxito) y `sys.exit(1)` (falla), para interactuar correctamente con los runners de Bash/Docker de GitHub Actions.
* **Tipado:** (Opcional pero recomendado). Uso de Type Hints en firmas de funciones complejas (Ej. `def match_pattern(content: str) -> bool:`).

---

## 4. Estándares para el Ecosistema TypeScript (VSCode)

La extensión `extension.ts` debe priorizar la asincronía y el tipado estricto.

* **Variables y Funciones:** Emplear `camelCase` para la lógica (Ej. `getFileHash()`, `checkContentPatterns()`).
* **Tipos y Clases:** Emplear `PascalCase` (Ej. `ThreatReport`).
* **Transacciones de Archivos:** Las aperturas de archivos pesados deben restringirse al buffer a través de File Descriptors (`fs.openSync`, `fs.readSync`) limitando el tamaño a `Math.min(512, stats.size)` para prevenir desbordes de memoria del editor V8.
* **Reglas de Linting Estricto (`tsconfig.json`):**
  * `"noImplicitAny": true` -> Ninguna variable debe quedar sin declarar su tipo (evitar `any`).
  * `"strictNullChecks": true` -> Obligatorio parsear los retornos que devuelvan `null` (como `checkHashSignature`).

---

## 5. Estándares para el Ecosistema Node.js (Telegram Bot)

El bot está desarrollado usando ES Modules en Node.js puro (`bot.js`).

* **Imports:** Utilizar el formato ECMAScript Modules `import { x } from 'y'` en lugar de `require`, estipulando explícitamente `"type": "module"` en el `package.json`.
* **Manejo de Asincronía:** Uso mandatorio de `async / await` al comunicarse con las promesas de la librería `node-telegram-bot-api` y descargas de red (Ej. `await bot.getFileLink()`).
* **Callbacks en Subprocesos:** La librería `child_process.exec` se manejará mediante funciones callback nativas de error y buffer (STDOUT/STDERR), procesando inmediatamente las cadenas mediante expresiones regulares.

---

## 6. Manejo de Errores y Seguridad (Universal)

* **Supresión de Excepciones Triviales (Silent Fails):** En el ciclo de lectura de miles de archivos de un proyecto, si un archivo está bloqueado por el sistema o es un binario ininteligible para Regex, el proceso `catch {}` debe simplemente omitir el error para continuar el bucle (no detener todo el análisis por un archivo basura).
* **Política Zero-Trace:** Toda manipulación de archivos descargados temporalmente (ej. Telegram Bot) debe estar envuelta en un bloque `try...finally` que fuerce indiscutiblemente la ejecución de `fs.unlinkSync()` sobre la ruta de descarga para evitar comprometer el servidor con archivos infectados persistentes.
* **Hardcoding Restringido:** Está prohibido quemar tokens de APIs en variables globales. Cualquier acceso privilegiado de red debe inyectarse a través del objeto `process.env`.
