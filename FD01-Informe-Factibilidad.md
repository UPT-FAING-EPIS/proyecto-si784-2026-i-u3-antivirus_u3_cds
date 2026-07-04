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

Informe de Factibilidad

Versión *2.0*

| CONTROL DE VERSIONES | | | | |
|:---:|:---|:---|:---|:---|
| Versión | Hecha por | Revisada por | Aprobada por | Fecha | Motivo |
| 1.0 | LLica Mamani, Jimmy Mijair | Sierra Ruiz, Iker Alberto | LLica Mamani, Jimmy Mijair | 02/06/2026 | Versión Inicial |
| 2.0 | Equipo RustGuard | Mag. Patrick Cuadros Quiroga | Equipo RustGuard | 04/07/2026 | Versión Extendida e Integrada |

<div style="page-break-after: always; visibility: hidden"></div>

# **INDICE GENERAL**

[1. Descripción del Proyecto](#1-descripción-del-proyecto)

&nbsp;&nbsp;[1.1 Nombre del Proyecto](#11-nombre-del-proyecto)

&nbsp;&nbsp;[1.2 Duración del Proyecto](#12-duración-del-proyecto)

&nbsp;&nbsp;[1.3 Descripción General](#13-descripción-general)

&nbsp;&nbsp;[1.4 Objetivos del Proyecto](#14-objetivos-del-proyecto)

[2. Riesgos y Mitigación](#2-riesgos-y-mitigación)

[3. Análisis de la Situación Actual](#3-análisis-de-la-situación-actual)

[4. Estudio de Factibilidad](#4-estudio-de-factibilidad)

&nbsp;&nbsp;[4.1 Factibilidad Técnica](#41-factibilidad-técnica)

&nbsp;&nbsp;[4.2 Factibilidad Económica](#42-factibilidad-económica)

&nbsp;&nbsp;[4.3 Factibilidad Operativa](#43-factibilidad-operativa)

&nbsp;&nbsp;[4.4 Factibilidad Legal](#44-factibilidad-legal)

&nbsp;&nbsp;[4.5 Factibilidad Social](#45-factibilidad-social)

[5. Análisis Costo-Beneficio](#5-análisis-costo-beneficio)

<div style="page-break-after: always; visibility: hidden"></div>

## 1. Descripción del Proyecto

### 1.1 Nombre del Proyecto

**RustGuard Antivirus** — Suite de Seguridad de Escritorio con Motor ClamAV.

### 1.2 Duración del Proyecto

El proyecto abarca el semestre académico 2026-I, con un desarrollo iterativo dividido en tres unidades académicas (U1, U2, U3), comprendiendo aproximadamente 16 semanas de trabajo efectivo.

### 1.3 Descripción General

**RustGuard Antivirus** es una aplicación de escritorio multiplataforma construida con **Electron.js** y **React 19**, que integra el motor antivirus de código abierto **ClamAV** para brindar una protección completa contra malware en tiempo real. El sistema opera como una suite de seguridad profesional que incluye:

1. **Motor de Escaneo bajo demanda:** Emplea el binario `clamdscan` (demonio de ClamAV) para ejecutar tres modalidades de escaneo: Rápido (áreas críticas del sistema: AppData, Downloads, Temp, Startup), Completo (disco completo C:\) y Personalizado (selección de carpeta por el usuario mediante diálogo nativo del sistema operativo).
2. **Protección en Tiempo Real (File System Watcher):** Un módulo basado en la librería `chokidar` que monitorea continuamente las carpetas de `Descargas` y `Escritorio` del usuario, encolando y escaneando automáticamente cada archivo nuevo o modificado con el motor ClamAV en segundo plano.
3. **Escudo Anti-Ransomware (Honeypot Heurístico):** Una capa avanzada de seguridad que despliega archivos señuelo (canary files) ocultos en `Documentos` y `Escritorio`, y vigila su integridad. Si un proceso malicioso modifica o elimina estos archivos (comportamiento típico de un ransomware en fase de cifrado masivo), el sistema dispara una alerta crítica a pantalla completa con instrucciones de emergencia.
4. **Bóveda de Cuarentena Persistente:** Sistema de aislamiento y gestión de archivos infectados con almacenamiento en SQLite (via `better-sqlite3`). Permite mover, restaurar y eliminar permanentemente archivos amenazantes.
5. **Dashboard y Panel de Historial:** Interfaz React premium con tema oscuro personalizado, visor de logs en tiempo real con scroll automático, historial de escaneos con exportación a texto plano y visualización modal de registros detallados.
6. **Pipeline CI/CD Integral:** 6 workflows de GitHub Actions para automatizar cobertura de código, pruebas E2E con Playwright/BDD, pruebas de mutación con Stryker, análisis estático (Semgrep + Snyk), validación de infraestructura Terraform e integración de releases con Electron Builder.

### 1.4 Objetivos del Proyecto

**Objetivo General:**  
Desarrollar una aplicación antivirus de escritorio funcional, portable y profesional que integre un motor de detección de malware basado en firmas (ClamAV), detección heurística de ransomware mediante honeypots, y protección en tiempo real del sistema de archivos, cumpliendo con estándares de calidad de software automatizada.

**Objetivos Específicos:**
- Implementar la integración con el motor ClamAV (clamdscan/clamd) para escaneo por firmas de archivos.
- Desarrollar un sistema de monitoreo en tiempo real del file system con cola de escaneo para evitar bloqueos.
- Diseñar e implementar un módulo anti-ransomware basado en heurística por archivos honeypot.
- Construir una base de datos SQLite embebida para persistencia de historial de escaneos y cuarentena.
- Desarrollar una interfaz de usuario moderna en React 19 con TailwindCSS sobre Electron con ventana Frameless.
- Automatizar la calidad del software mediante 6 pipelines de CI/CD con cobertura, mutación, E2E, análisis estático, IaC y releases.

---

## 2. Riesgos y Mitigación

| # | Riesgo | Probabilidad | Impacto | Estrategia de Mitigación |
| :---: | :--- | :---: | :---: | :--- |
| R1 | **Dependencia del binario ClamAV:** Si el usuario no tiene ClamAV instalado (`C:\Program Files\ClamAV`), el escaneo falla. | Alta | Crítico | Se implementó un mecanismo de detección (`fs.existsSync(CLAMDSCAN_EXE)`) que retorna un resultado vacío en lugar de crashear, registrando el error en el log. Se incluye documentación de instalación paso a paso. |
| R2 | **Bloqueo del hilo principal (UI Thread) de Electron:** El escaneo de miles de archivos podría congelar la interfaz. | Media | Alto | Se utiliza `child_process.spawn()` para ejecutar ClamAV como subproceso asíncrono. La recopilación de archivos también es asíncrona (`fs.promises.readdir`). El frontend usa IPC (`ipcMain.handle`) que es non-blocking. |
| R3 | **Falsos positivos del módulo Anti-Ransomware:** Programas legítimos de limpieza podrían borrar accidentalmente los honeypots. | Baja | Medio | Los honeypots están ocultos (`attrib +h` en Windows) y tienen nombres con prefijo `.rg_canary`, reduciendo la probabilidad de interacción accidental. La alerta es informativa, no destructiva. |
| R4 | **Archivos en uso (Error 32 de Windows):** El escáner no puede acceder archivos bloqueados por el sistema operativo. | Alta | Bajo | El parser `parseClamScanLine()` clasifica estas líneas como `IGNORED`, no como errores, evitando falsos reportes de fallo. |
| R5 | **Base de datos corrupta en cierre forzoso:** Un corte de energía podría corromper SQLite. | Baja | Medio | Se activó el modo `WAL` (Write-Ahead Logging) con `db.pragma('journal_mode = WAL')` para garantizar integridad transaccional. |
| R6 | **Rendimiento en escaneo completo:** Un disco con millones de archivos podría generar archivos de lista enormes. | Media | Medio | Se implementó un sistema de listas temporales (`rustguard_scan_{id}.txt`) que son limpiadas automáticamente (`fs.unlinkSync`) al finalizar o cancelar el escaneo. |

---

## 3. Análisis de la Situación Actual

En el panorama actual de ciberseguridad, las soluciones antivirus comerciales para entornos de escritorio (Norton, Kaspersky, ESET) presentan varios problemas para usuarios y desarrolladores:

- **Costo elevado:** Las licencias anuales oscilan entre $30 y $100 USD, excluyendo a estudiantes y pequeñas organizaciones.
- **Alto consumo de recursos:** Los motores en segundo plano consumen entre 200 MB y 1 GB de RAM permanentemente, degradando el rendimiento del sistema.
- **Opacidad en la detección:** Los motores propietarios no permiten inspeccionar las reglas ni los falsos positivos, generando desconfianza en entornos de desarrollo donde archivos legítimos son marcados erróneamente.
- **Ausencia de protección anti-ransomware en soluciones gratuitas:** La mayoría de herramientas gratuitas (Windows Defender en configuración básica) no incluyen detección heurística basada en honeypots.

**RustGuard Antivirus** aprovecha estas brechas proponiendo una solución 100% Open Source, ligera, transparente y con capacidades avanzadas (Anti-Ransomware por honeypot) que normalmente solo se encuentran en suites empresariales de alto costo.

---

## 4. Estudio de Factibilidad

### 4.1 Factibilidad Técnica

El sistema es **técnicamente viable** dado que se sustenta en tecnologías maduras y ampliamente documentadas:

| Tecnología | Versión | Propósito | Madurez |
| :--- | :---: | :--- | :---: |
| **Electron.js** | 31.x | Runtime de escritorio (Chromium + Node.js) | Alta |
| **React** | 19.x | Librería de UI reactiva para el frontend | Alta |
| **Vite** | 8.x | Empaquetador y servidor de desarrollo ultrarrápido | Alta |
| **TailwindCSS** | 4.x | Framework de utilidades CSS para diseño premium | Alta |
| **ClamAV (clamd/clamdscan)** | Latest | Motor antivirus Open Source de firmas | Muy Alta |
| **better-sqlite3** | 11.x | Driver SQLite nativo para Node.js (WAL) | Alta |
| **chokidar** | 4.x | Librería de monitoreo del sistema de archivos | Alta |
| **Vitest** | 4.x | Framework de pruebas unitarias para el frontend | Alta |
| **Playwright + BDD** | 1.60 | Pruebas E2E con escenarios Gherkin | Alta |
| **Stryker Mutator** | 9.x | Pruebas de mutación para validar calidad de tests | Alta |
| **Terraform** | Latest | Infraestructura como Código (IaC) para AWS S3 | Muy Alta |

**Infraestructura de desarrollo:**
- **Comunicación IPC:** Se emplea el patrón `contextBridge` + `ipcRenderer` de Electron con `contextIsolation: true` y `nodeIntegration: false`, garantizando la seguridad del proceso Renderer.
- **Proceso de arranque:** El sistema ejecuta una secuencia controlada: Splash Screen → Actualización de firmas (freshclam) → Arranque del demonio clamd → Ventana principal.
- **Compilación y distribución:** `electron-builder` genera instaladores NSIS y portables para Windows x64, incluyendo las firmas ClamAV como `extraResources`.

### 4.2 Factibilidad Económica

El proyecto opera con un **Costo de Licenciamiento de $0.00 USD**:

| Recurso | Tipo | Costo |
| :--- | :---: | :---: |
| Electron.js | MIT License | $0 |
| React 19 | MIT License | $0 |
| ClamAV Engine | GPL v2 | $0 |
| Vite + TailwindCSS | MIT License | $0 |
| better-sqlite3 | MIT License | $0 |
| GitHub Actions (runners públicos) | Gratuito (Open Source) | $0 |
| Terraform (validación local) | MPL v2 | $0 |
| AWS S3 (bucket de artefactos) | Pay-as-you-go | ~$0.023/GB |
| **Total Desarrollo** | | **$0.00** |

**Nota:** El único costo potencial es el almacenamiento en AWS S3 para los instaladores publicados, estimado en menos de $1 USD/mes para un proyecto académico.

### 4.3 Factibilidad Operativa

La operatividad del sistema es **inmediata y transparente** para el usuario final:

- **Instalación:** Un solo archivo ejecutable (`.exe` portable o instalador NSIS) descargable desde GitHub Releases. No requiere configuración avanzada.
- **Arranque automático:** Al iniciar la app, RustGuard actualiza automáticamente las firmas ClamAV (`freshclam`), carga el demonio en memoria (`clamd`) y presenta el Dashboard de estado.
- **Curva de aprendizaje mínima:** La interfaz sigue el paradigma visual de antivirus comerciales (Dashboard central, barra lateral de navegación, botones de acción directa). Un usuario sin conocimientos técnicos puede ejecutar un escaneo en 2 clics.
- **Feedback inmediato:** El visor de logs en tiempo real, las notificaciones nativas del sistema operativo y los modales de amenaza garantizan que el usuario siempre esté informado.

### 4.4 Factibilidad Legal

- **Licenciamiento Open Source:** Todas las dependencias utilizan licencias permisivas (MIT, GPL v2, MPL v2) compatibles con proyectos académicos y comerciales.
- **Privacidad del usuario:** RustGuard **no transmite datos** del usuario hacia servidores externos. Todo el procesamiento ocurre localmente. Los archivos analizados permanecen en el disco del usuario.
- **Eliminación segura:** Los archivos en cuarentena son renombrados con extensión `.quar` y almacenados en el directorio `userData` de Electron, aislados del sistema de archivos principal.

### 4.5 Factibilidad Social

- **Impacto académico:** El proyecto demuestra la integración práctica de conceptos de ciberseguridad, arquitectura de software y calidad de software en un producto funcional.
- **Accesibilidad:** Al ser gratuito y de código abierto, cualquier estudiante o desarrollador puede descargar, auditar y mejorar el sistema.
- **Concientización en seguridad:** El módulo Anti-Ransomware educa al usuario sobre la existencia de ataques de cifrado masivo y las acciones preventivas recomendadas.

---

## 5. Análisis Costo-Beneficio

| Beneficio | Descripción | Valor Estimado |
| :--- | :--- | :---: |
| Protección contra malware | Detección basada en firmas de millones de amenazas conocidas (ClamAV) | Alto |
| Detección de ransomware | Heurística por honeypot que detecta cifrado masivo en fase temprana | Alto |
| Monitoreo en tiempo real | Vigilancia automática de descargas y escritorio sin intervención | Medio |
| Historial auditable | Registro persistente de todos los escaneos con exportación | Medio |
| Automatización CI/CD | 6 pipelines que garantizan calidad continua del software | Alto |
| Costo total | Desarrollo, despliegue y operación | **$0.00** |

**Conclusión:** El análisis demuestra que **RustGuard Antivirus es un proyecto técnicamente viable, económicamente sostenible, operativamente intuitivo y legalmente compatible**, con un balance costo-beneficio extremadamente favorable para un entorno académico y de código abierto.

---

## Bibliografía

1. Bass, L., Weber, I., & Zhu, L. (2015). *DevOps: A Software Architect's Perspective*. Addison-Wesley Professional.
2. Kim, G., Debois, P., Willis, J., & Humble, J. (2016). *The DevOps Handbook: How to Create World-Class Agility, Reliability, and Security in Technology Organizations*. IT Revolution Press.
3. ClamAV. (2025). *ClamAV Official Documentation*. Recuperado de https://docs.clamav.net/
4. Electron. (2025). *Electron Documentation - Context Isolation*. Recuperado de https://www.electronjs.org/docs/latest/tutorial/context-isolation
5. Chokidar. (2025). *Chokidar - Efficient cross-platform file watching*. Recuperado de https://github.com/paulmillr/chokidar
