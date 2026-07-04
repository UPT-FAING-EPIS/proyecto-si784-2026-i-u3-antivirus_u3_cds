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

Documentación de Proyecto y Manual de Usuario

Versión *2.0*

| CONTROL DE VERSIONES | | | | |
|:---:|:---|:---|:---|:---|
| Versión | Hecha por | Revisada por | Aprobada por | Fecha | Motivo |
| 1.0 | Sierra Ruiz, Iker Alberto | LLica Mamani, Jimmy Mijair | Sierra Ruiz, Iker Alberto | 02/06/2026 | Versión Inicial |
| 2.0 | Equipo RustGuard | Mag. Patrick Cuadros Quiroga | Equipo RustGuard | 04/07/2026 | Manual completo de la aplicación Desktop |

<div style="page-break-after: always; visibility: hidden"></div>

# **INDICE GENERAL**

[1. Introducción](#1-introducción)

[2. Requisitos del Sistema](#2-requisitos-del-sistema)

[3. Instalación y Configuración](#3-instalación-y-configuración)

&nbsp;&nbsp;[3.1 Instalación de ClamAV](#31-instalación-de-clamav)

&nbsp;&nbsp;[3.2 Instalación de RustGuard](#32-instalación-de-rustguard)

&nbsp;&nbsp;[3.3 Ejecución en Modo Desarrollo](#33-ejecución-en-modo-desarrollo)

[4. Manual de Usuario](#4-manual-de-usuario)

&nbsp;&nbsp;[4.1 Dashboard Principal](#41-dashboard-principal)

&nbsp;&nbsp;[4.2 Centro de Escaneo](#42-centro-de-escaneo)

&nbsp;&nbsp;[4.3 Protección en Tiempo Real](#43-protección-en-tiempo-real)

&nbsp;&nbsp;[4.4 Escudo Anti-Ransomware](#44-escudo-anti-ransomware)

&nbsp;&nbsp;[4.5 Bóveda de Cuarentena](#45-bóveda-de-cuarentena)

&nbsp;&nbsp;[4.6 Historial de Escaneos](#46-historial-de-escaneos)

[5. Pipeline CI/CD](#5-pipeline-cicd)

&nbsp;&nbsp;[5.1 Workflows de GitHub Actions](#51-workflows-de-github-actions)

[6. Infraestructura como Código (Terraform)](#6-infraestructura-como-código-terraform)

[7. Estrategia de Pruebas](#7-estrategia-de-pruebas)

<div style="page-break-after: always; visibility: hidden"></div>

## 1. Introducción

Este documento consolida la **documentación técnica y el manual de usuario** del sistema RustGuard Antivirus. Está dirigido tanto a usuarios finales que desean operar la aplicación, como a desarrolladores que necesiten configurar el entorno de desarrollo, comprender el pipeline CI/CD o extender la funcionalidad del sistema.

---

## 2. Requisitos del Sistema

| Requisito | Especificación |
| :--- | :--- |
| **Sistema Operativo** | Windows 10/11 (x64) |
| **RAM mínima** | 4 GB (recomendado 8 GB) |
| **Almacenamiento** | 500 MB libres (firmas ClamAV + aplicación) |
| **ClamAV** | Versión 1.0+ instalada en `C:\Program Files\ClamAV` |
| **Node.js** (solo desarrollo) | v20 LTS o superior |
| **Conexión a Internet** | Opcional (solo para actualizar firmas) |

---

## 3. Instalación y Configuración

### 3.1 Instalación de ClamAV

ClamAV es el motor antivirus externo que RustGuard utiliza. Se instala de la siguiente manera:

**Opción A - Winget (recomendado):**
```bash
winget install ClamAV.ClamAV
```

**Opción B - Instalador manual:**
1. Descargar el instalador desde https://www.clamav.net/downloads
2. Instalar en la ruta por defecto: `C:\Program Files\ClamAV`
3. Verificar la instalación ejecutando en CMD:
```bash
"C:\Program Files\ClamAV\clamscan.exe" --version
```

### 3.2 Instalación de RustGuard

**Para usuarios finales:**
1. Ir a la sección **Releases** del repositorio en GitHub.
2. Descargar `RustGuard-Portable-1.0.0.exe` (versión portable sin instalación).
3. Ejecutar el archivo directamente. La aplicación creará automáticamente sus directorios de datos en `%APPDATA%/RustGuard/`.

**Para instalación completa:**
1. Descargar el instalador NSIS desde Releases.
2. Ejecutar el instalador y seguir el asistente.
3. Se creará un acceso directo en el escritorio y menú de inicio.

### 3.3 Ejecución en Modo Desarrollo

```bash
# Clonar el repositorio
git clone https://github.com/[usuario]/rustguard.git
cd rustguard

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo (Vite + Electron simultáneo)
npm start

# Ejecutar solo el frontend (sin Electron)
npm run dev
```

**Comandos de pruebas:**
```bash
npm test               # Pruebas unitarias (Vitest)
npm run test:coverage  # Cobertura de código
npm run test:mutation  # Pruebas de mutación (Stryker)
npm run test:e2e       # Pruebas E2E (Playwright BDD)
```

---

## 4. Manual de Usuario

### 4.1 Dashboard Principal

Al abrir RustGuard, el usuario es recibido con el **Dashboard principal** que muestra:

- **Indicador de Estado:** Un escudo grande animado que indica `SISTEMA PROTEGIDO` (verde), `AMENAZA DETECTADA` (rojo) o `ESCANEO EN CURSO` (azul).
- **Tarjetas de Estadísticas:**
  - *Firmas ClamAV:* Estado de la última actualización de firmas.
  - *Último Escaneo:* Tipo y hora del último análisis realizado.
  - *Tiempo Real:* Toggle para activar/desactivar la protección en tiempo real.
- **Acciones Rápidas:** Dos botones para iniciar directamente un Escaneo Rápido o Completo.

### 4.2 Centro de Escaneo

Desde la sección **Escaneo** se puede ejecutar tres tipos de análisis:

| Tipo | Descripción | Áreas Escaneadas |
| :--- | :--- | :--- |
| **Rápido** | Analiza las áreas más vulnerables del sistema | AppData, Downloads, Temp, Startup |
| **Completo** | Escaneo exhaustivo de todo el disco | C:\ completo |
| **Carpeta** | Escaneo dirigido a una carpeta específica | Carpeta seleccionada por el usuario |

**Flujo de uso:**
1. Haga clic en el tipo de escaneo deseado.
2. Observe los resultados en el **visor de logs en tiempo real** (auto-scroll).
3. Si se detecta una amenaza, aparecerá un **modal de alerta** con:
   - Nombre de la amenaza (ej. `Win.Test.EICAR_HDB-1`)
   - Ruta del archivo infectado
   - Botón **"Mover a Cuarentena"** (recomendado) o **"Ignorar"**
4. Para cancelar un escaneo en curso, use el botón rojo **"Detener Escaneo"**.

### 4.3 Protección en Tiempo Real

La sección **Tiempo Real** permite activar un vigilante automático que:
- Monitorea las carpetas `Descargas` y `Escritorio` del usuario.
- Espera a que cada archivo termine de descargarse (2 segundos de estabilización).
- Escanea automáticamente cada archivo nuevo o modificado con ClamAV.
- Emite una **notificación nativa de Windows** si detecta una amenaza.

**Para activar/desactivar:** Use el toggle en la sección de Protección en Tiempo Real.

### 4.4 Escudo Anti-Ransomware

El módulo **Anti-Ransomware** utiliza una técnica de heurística basada en **archivos honeypot**:
- Al activarse, despliega archivos señuelo ocultos (`.rg_canary.docx`, `.rg_canary.jpg`) en las carpetas Documentos y Escritorio.
- Si un proceso malicioso (ransomware) intenta cifrar o eliminar estos archivos, el sistema:
  1. Fuerza la ventana de RustGuard a primer plano.
  2. Muestra un **modal de emergencia a pantalla completa** con fondo rojo.
  3. Recomienda acciones inmediatas: apagar el equipo, desconectar la red.

### 4.5 Bóveda de Cuarentena

La **Bóveda de Cuarentena** muestra todos los archivos que han sido aislados del sistema:

| Columna | Descripción |
| :--- | :--- |
| Amenaza | Nombre de la firma de malware detectada |
| Ruta Original | Ubicación original del archivo infectado |
| Fecha de Aislamiento | Momento en que fue movido a cuarentena |
| Acciones | Restaurar al sistema o Eliminar permanentemente |

- **Restaurar:** Devuelve el archivo a su ubicación original (requiere confirmación del usuario).
- **Eliminar:** Borra permanentemente el archivo del disco (irreversible, requiere confirmación).

### 4.6 Historial de Escaneos

La sección **Historial** registra cada escaneo realizado:
- **Tipo:** Rápido, Completo o Carpeta/Archivo
- **Inicio/Fin:** Timestamps del escaneo
- **Archivos analizados:** Cantidad total
- **Amenazas:** Número encontrado (rojo si > 0)
- **Estado:** Completado, En curso, Error o Cancelado
- **Log:** Botón para abrir el registro detallado en un modal

**Exportar historial:** El botón **"Exportar Historial"** guarda un archivo `.txt` con un resumen de todos los escaneos realizados.

---

## 5. Pipeline CI/CD

### 5.1 Workflows de GitHub Actions

El proyecto implementa **6 workflows** automatizados:

| Workflow | Archivo | Trigger | Descripción |
| :--- | :--- | :--- | :--- |
| **Code Coverage** | `coverage.yml` | Push a `codigo` | Ejecuta `vitest --coverage` y publica el reporte en GitHub Pages |
| **E2E / BDD** | `e2e.yml` | Push a `codigo` | Ejecuta Playwright con 14 escenarios Gherkin + genera reporte |
| **Mutation Testing** | `mutation.yml` | Push a `codigo` | Ejecuta Stryker Mutator y publica resultados en GitHub Pages |
| **Static Analysis** | `static-analysis.yml` | Push/PR a `codigo` | Semgrep (SAST) + Snyk (vulnerabilidades en dependencias) |
| **Terraform** | `terraform.yml` | Push/PR a `codigo` | `terraform init` → `fmt -check` → `plan` |
| **Release** | `release.yml` | Push de tag `v*` | `electron-builder` genera portable e instalador NSIS en Windows |

---

## 6. Infraestructura como Código (Terraform)

El directorio `terraform/` define un recurso **AWS S3 Bucket** para alojar artefactos de release:

```hcl
resource "aws_s3_bucket" "rustguard_artifacts" {
  bucket = "rustguard-release-artifacts-${var.environment}"
  tags = {
    Name        = "RustGuard Artifacts"
    Environment = var.environment
    Project     = "Antivirus SI784"
  }
}
```

**Variables:** `aws_region` (default: `us-east-1`), `environment` (default: `dev`).

---

## 7. Estrategia de Pruebas

| Nivel | Herramienta | Archivos | Cobertura |
| :--- | :--- | :--- | :--- |
| **Unitarias** | Vitest + Testing Library | 12 archivos (`App.test.jsx`, 6 component tests, 5 page tests) | Navegación, renderizado, IPC mocks, modales |
| **E2E / BDD** | Playwright + Gherkin | `antivirus.feature` (14 scenarios) | Flujos completos de UI |
| **Mutación** | Stryker Mutator | Todos los componentes React | Calidad de los tests |
| **Estático** | Semgrep + Snyk | Todo el repositorio | Vulnerabilidades de código y dependencias |

---

## Bibliografía

1. Node.js Foundation. (2025). *Node.js v20 Documentation*. Recuperado de https://nodejs.org/docs/latest-v20.x/api/
2. Electron. (2025). *Electron Builder Documentation*. Recuperado de https://www.electron.build/
3. Playwright. (2025). *Playwright Documentation*. Recuperado de https://playwright.dev/docs/intro
4. HashiCorp. (2025). *Terraform AWS Provider*. Recuperado de https://registry.terraform.io/providers/hashicorp/aws
