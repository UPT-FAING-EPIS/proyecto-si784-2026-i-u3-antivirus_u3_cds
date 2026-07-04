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

Versión *2.0*

| CONTROL DE VERSIONES | | | | |
|:---:|:---|:---|:---|:---|
| Versión | Hecha por | Revisada por | Aprobada por | Fecha | Motivo |
| 1.0 | Equipo RustGuard | Mag. Patrick Cuadros Quiroga | Equipo RustGuard | 02/06/2026 | Versión Inicial |
| 2.0 | Equipo RustGuard | Mag. Patrick Cuadros Quiroga | Equipo RustGuard | 04/07/2026 | Estándar consolidado para Electron + React |

<div style="page-break-after: always; visibility: hidden"></div>

# **INDICE GENERAL**

[1. Introducción](#1-introducción)

[2. Nomenclatura y Convenciones](#2-nomenclatura-y-convenciones)

[3. Estructura de Archivos](#3-estructura-de-archivos)

[4. Estándares por Tecnología](#4-estándares-por-tecnología)

&nbsp;&nbsp;[4.1 JavaScript / Node.js (Proceso Main)](#41-javascript--nodejs-proceso-main)

&nbsp;&nbsp;[4.2 React JSX (Proceso Renderer)](#42-react-jsx-proceso-renderer)

&nbsp;&nbsp;[4.3 CSS / TailwindCSS](#43-css--tailwindcss)

&nbsp;&nbsp;[4.4 SQL (SQLite)](#44-sql-sqlite)

&nbsp;&nbsp;[4.5 Terraform (HCL)](#45-terraform-hcl)

[5. Estándares de Pruebas](#5-estándares-de-pruebas)

[6. Control de Versiones (Git)](#6-control-de-versiones-git)

<div style="page-break-after: always; visibility: hidden"></div>

## 1. Introducción

Este documento define los estándares de programación obligatorios para el desarrollo del sistema **RustGuard Antivirus**. El cumplimiento de estas convenciones garantiza la legibilidad, mantenibilidad y consistencia del código fuente a lo largo de todo el proyecto.

---

## 2. Nomenclatura y Convenciones

| Elemento | Convención | Ejemplo |
| :--- | :--- | :--- |
| Variables y funciones | camelCase | `scanTarget`, `isScanning`, `handleFileChange` |
| Constantes | UPPER_SNAKE_CASE | `CLAMAV_DIR`, `HONEYPOT_NAMES`, `QUARANTINE_DIR` |
| Componentes React | PascalCase | `Dashboard`, `LogViewer`, `ThreatModal` |
| Archivos de componente | PascalCase.jsx | `Dashboard.jsx`, `Sidebar.jsx` |
| Archivos de módulo (backend) | snake_case.js o camelCase.js | `clamd_service.js`, `honeypot.js` |
| Archivos de test | ComponentName.test.jsx | `Dashboard.test.jsx` |
| Canales IPC | kebab-case | `scan-quick`, `toggle-realtime`, `get-scan-history` |
| Tablas SQL | snake_case | `scan_history`, `quarantine` |
| Campos SQL | snake_case | `files_scanned`, `quarantined_at` |
| Variables Terraform | snake_case | `aws_region`, `environment` |
| Workflows GitHub | kebab-case.yml | `static-analysis.yml`, `coverage.yml` |

---

## 3. Estructura de Archivos

- **Proceso Main (Backend):** Todos los módulos se ubican en `electron/`.
- **Proceso Renderer (Frontend):** Se organiza en `src/components/`, `src/pages/`, `src/test/`.
- **Pruebas:** Espejo de la estructura del código fuente dentro de `src/test/`.
- **CI/CD:** Workflows en `.github/workflows/`.
- **IaC:** Archivos Terraform en `terraform/`.

---

## 4. Estándares por Tecnología

### 4.1 JavaScript / Node.js (Proceso Main)

- **Módulo:** ES Modules (`import/export`). Excepción: `preload.cjs` usa CommonJS por requerimiento de Electron.
- **Asincronía:** Usar `async/await` en lugar de callbacks anidados. Las promesas deben tener `catch` o `try/catch`.
- **Child Process:** Preferir `spawn()` sobre `exec()` para procesos largos (streaming de stdout).
- **Manejo de errores:** Nunca dejar un `catch` vacío sin al menos un `writeLog('ERROR', ...)`.
- **File System:** Usar `fs.promises` para operaciones asíncronas. Verificar existencia con `fs.existsSync()` antes de operar.

### 4.2 React JSX (Proceso Renderer)

- **Componentes funcionales:** Todos los componentes deben ser funciones (no clases).
- **Hooks:** Usar `useState`, `useEffect`, `useRef` según necesidad. No usar hooks de terceros sin justificación.
- **Props:** Desestructurar en la firma de la función (`function Dashboard({ setCurrentView })`).
- **Renderizado condicional:** Usar operadores ternarios o `&&` en lugar de `if/else` dentro del JSX.
- **ElectronAPI guard:** Siempre verificar `if (window.electronAPI)` antes de invocar APIs IPC para permitir ejecución en navegador.

### 4.3 CSS / TailwindCSS

- **Variables CSS:** Definir colores y temas en `index.css` usando custom properties (`--bg-base`, `--accent-primary`, etc.).
- **Utilidades Tailwind:** Referir las variables CSS dentro de las clases Tailwind (`bg-[var(--bg-panel)]`).
- **Animaciones:** Usar clases Tailwind para transiciones (`transition-colors`, `animate-pulse`).

### 4.4 SQL (SQLite)

- **Prepared Statements:** Obligatorio para todas las operaciones con parámetros (`db.prepare()`).
- **Timestamps:** Usar `datetime('now', 'localtime')` para consistencia de zona horaria.
- **Modo WAL:** Activado globalmente para integridad transaccional.

### 4.5 Terraform (HCL)

- **Formato:** Ejecutar `terraform fmt` antes de cada commit.
- **Variables:** Definir todas las variables en `variables.tf` con `description` y `default`.
- **Outputs:** Documentar cada output con su `description`.

---

## 5. Estándares de Pruebas

| Regla | Descripción |
| :--- | :--- |
| **Aislamiento** | Cada test debe ser independiente. Usar `beforeEach` para limpiar estado. |
| **Mocks** | Mockear dependencias externas (`electronAPI`, componentes hijos) con `vi.mock()`. |
| **Nomenclatura** | Usar `describe('ComponentName')` + `it('descripción del comportamiento')`. |
| **BDD Features** | Usar Gherkin con `Given/When/Then` en archivos `.feature`. |
| **Cobertura mínima** | Aspirar a ≥ 80% de cobertura de líneas. |

---

## 6. Control de Versiones (Git)

| Regla | Ejemplo |
| :--- | :--- |
| **Rama principal** | `codigo` (rama de desarrollo activo) |
| **Commits** | Mensajes descriptivos en español: `feat: agregar módulo anti-ransomware` |
| **Tags** | Formato semántico: `v1.0.0`, `v1.1.0` |
| **Archivos ignorados** | `node_modules/`, `dist/`, `release/`, `coverage/`, `*.log` |

---

## Bibliografía

1. Airbnb. (2025). *JavaScript Style Guide*. Recuperado de https://github.com/airbnb/javascript
2. React. (2025). *Rules of Hooks*. Recuperado de https://react.dev/warnings/invalid-hook-call-warning
3. ESLint. (2025). *Getting Started*. Recuperado de https://eslint.org/docs/latest/use/getting-started
