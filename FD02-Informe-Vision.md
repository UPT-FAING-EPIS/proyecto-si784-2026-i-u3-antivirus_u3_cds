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

Informe de Visión de Producto

Versión *2.0*

| CONTROL DE VERSIONES | | | | |
|:---:|:---|:---|:---|:---|
| Versión | Hecha por | Revisada por | Aprobada por | Fecha | Motivo |
| 1.0 | Sierra Ruiz, Iker Alberto | LLica Mamani, Jimmy Mijair | Sierra Ruiz, Iker Alberto | 02/06/2026 | Versión Inicial |
| 2.0 | Equipo RustGuard | Mag. Patrick Cuadros Quiroga | Equipo RustGuard | 04/07/2026 | Integración de la Suite Desktop |

<div style="page-break-after: always; visibility: hidden"></div>

# **INDICE GENERAL**

[1. Introducción](#1-introducción)

[2. Posicionamiento](#2-posicionamiento)

&nbsp;&nbsp;[2.1 Oportunidad de Negocio](#21-oportunidad-de-negocio)

&nbsp;&nbsp;[2.2 Declaración del Problema](#22-declaración-del-problema)

&nbsp;&nbsp;[2.3 Declaración de Posicionamiento](#23-declaración-de-posicionamiento)

[3. Descripciones de los Interesados y Usuarios](#3-descripciones-de-los-interesados-y-usuarios)

&nbsp;&nbsp;[3.1 Resumen de los Interesados](#31-resumen-de-los-interesados)

&nbsp;&nbsp;[3.2 Perfiles de Usuario](#32-perfiles-de-usuario)

&nbsp;&nbsp;[3.3 Entorno del Usuario](#33-entorno-del-usuario)

[4. Vista General del Producto](#4-vista-general-del-producto)

&nbsp;&nbsp;[4.1 Perspectiva del Producto](#41-perspectiva-del-producto)

&nbsp;&nbsp;[4.2 Capacidades del Producto](#42-capacidades-del-producto)

[5. Restricciones](#5-restricciones)

&nbsp;&nbsp;[5.1 Restricciones Técnicas](#51-restricciones-técnicas)

&nbsp;&nbsp;[5.2 Restricciones de Plataforma](#52-restricciones-de-plataforma)

[6. Rangos de Calidad](#6-rangos-de-calidad)

<div style="page-break-after: always; visibility: hidden"></div>

## 1. Introducción

El **Informe de Visión de Producto** define las bases conceptuales, el mercado objetivo, los perfiles de usuario y las metas estratégicas a gran escala de **RustGuard Antivirus**. Este documento sirve como punto de referencia fundamental para alinear las decisiones de diseño, desarrollo y calidad del equipo, asegurando que cada componente del sistema contribuya hacia un objetivo común: ofrecer una solución antivirus de escritorio gratuita, profesional y de alto rendimiento que democratice el acceso a la ciberseguridad.

---

## 2. Posicionamiento

### 2.1 Oportunidad de Negocio

Con el crecimiento exponencial del malware (más de 560,000 nuevas muestras detectadas diariamente según AV-TEST Institute), la necesidad de soluciones antivirus accesibles se ha vuelto crítica. El mercado actual presenta un vacío significativo: **no existe una aplicación de escritorio con interfaz gráfica moderna** que combine un motor antivirus de firmas (ClamAV), detección heurística de ransomware, monitoreo en tiempo real y una experiencia de usuario comparable a los productos comerciales, todo ello de forma gratuita y de código abierto.

Los usuarios afectados incluyen:
- **Estudiantes y académicos** que no pueden costear licencias de antivirus comerciales.
- **Pequeñas empresas y startups** que requieren protección básica sin overhead de licenciamiento.
- **Desarrolladores** que desean una herramienta transparente, auditable y extensible.

### 2.2 Declaración del Problema

| Elemento | Descripción |
| :--- | :--- |
| **El problema de** | La falta de soluciones antivirus gratuitas con interfaz gráfica profesional, protección en tiempo real y detección heurística de ransomware. |
| **Afecta a** | Usuarios de Windows que buscan protección integral sin costos de licenciamiento. |
| **El impacto del cual es** | Sistemas vulnerables a malware, ransomware y archivos maliciosos descargados de Internet, con pérdida potencial de datos personales y profesionales. |
| **Una solución exitosa sería** | Una aplicación de escritorio portable que integre escaneo por firmas (ClamAV), monitoreo automático del file system, honeypots anti-ransomware y una UI premium, todo empaquetado en un solo ejecutable sin dependencias externas complejas. |

### 2.3 Declaración de Posicionamiento

Para **usuarios de Windows que requieren seguridad ágil, gratuita y profesional**, **RustGuard Antivirus** es una **aplicación de escritorio basada en Electron** que provee **escaneo antivirus por firmas (ClamAV), protección en tiempo real, detección heurística de ransomware y gestión de cuarentena** con una interfaz premium de tema oscuro. A diferencia de **los antivirus comerciales** (Norton, Kaspersky, ESET), RustGuard es **100% gratuito, de código abierto, ligero y portable**, permitiendo al usuario ejecutar escaneos completos del sistema sin suscripciones, con un historial auditable y exportable de todas las operaciones realizadas.

---

## 3. Descripciones de los Interesados y Usuarios

### 3.1 Resumen de los Interesados

| Nombre | Descripción | Responsabilidades |
| :--- | :--- | :--- |
| Equipo de Desarrollo (RustGuard) | Estudiantes de Ingeniería de Sistemas de la UPT | Diseño, implementación, pruebas y documentación del sistema completo. |
| Docente (Mag. Patrick Cuadros Quiroga) | Profesor del curso de Calidad y Pruebas de Software | Supervisión académica, revisión de entregas y evaluación de la calidad del producto. |
| Usuarios Finales | Usuarios de Windows con necesidades de protección antimalware | Utilización del producto para escanear, monitorear y proteger sus sistemas. |

### 3.2 Perfiles de Usuario

| Perfil | Nivel Técnico | Necesidades Principales | Interacción con el Sistema |
| :--- | :---: | :--- | :--- |
| **Usuario Doméstico** | Básico | Proteger su equipo de malware descargado de Internet sin configuración técnica. | Ejecuta escaneos rápidos y activa la protección en tiempo real desde el Dashboard. |
| **Estudiante / Investigador** | Intermedio | Analizar archivos sospechosos descargados de repositorios académicos o forums. | Utiliza escaneo personalizado por carpeta y revisa los logs técnicos detallados. |
| **Administrador de Sistemas** | Avanzado | Auditar la seguridad de estaciones de trabajo, exportar reportes y validar archivos. | Emplea el historial exportable, revisa logs de sesión y gestiona la cuarentena manualmente. |

### 3.3 Entorno del Usuario

El usuario opera en un entorno de **escritorio Windows** (Windows 10/11 x64). La aplicación se ejecuta como un proceso Electron independiente con las siguientes características del entorno:
- **Pantalla mínima recomendada:** 1280 x 720 (HD).
- **Requisitos de RAM:** ~150 MB (proceso Electron) + ~200 MB (demonio clamd en memoria).
- **Almacenamiento:** ~250 MB para las firmas ClamAV locales (`clamav_db/`).
- **Conexión a Internet:** Opcional (solo requerida para la actualización automática de firmas con `freshclam`).

---

## 4. Vista General del Producto

### 4.1 Perspectiva del Producto

RustGuard no es un módulo de un sistema mayor, sino un **producto independiente y autónomo**. Se distribuye como un archivo ejecutable portable (`.exe`) o instalador NSIS, sin depender de servicios en la nube, APIs externas o suscripciones. La única dependencia externa es la instalación local de ClamAV (`C:\Program Files\ClamAV`), cuya instalación se puede realizar mediante Winget (`winget install ClamAV.ClamAV`).

### 4.2 Capacidades del Producto

Las capacidades diferenciadoras de RustGuard se clasifican en seis áreas funcionales:

| # | Capacidad | Descripción Técnica |
| :---: | :--- | :--- |
| CP-01 | **Escaneo por Firmas ClamAV** | Invocación del binario `clamdscan.exe` como subproceso asíncrono con parsing de resultados línea por línea (CLEAN/THREAT/IGNORED/INFO). |
| CP-02 | **Triple Modalidad de Escaneo** | Rápido (AppData, Downloads, Temp, Startup), Completo (disco C:\), Personalizado (selección por diálogo nativo). |
| CP-03 | **Protección en Tiempo Real** | Monitoreo del file system vía `chokidar` con cola de escaneo, notificaciones nativas de Windows y alertas IPC al frontend. |
| CP-04 | **Anti-Ransomware Heurístico** | Despliegue de honeypots ocultos (`.rg_canary.docx`, `.rg_canary.jpg`), detección de modificación/eliminación, alerta crítica a pantalla completa. |
| CP-05 | **Cuarentena Persistente** | Aislamiento de archivos infectados con extensión `.quar`, registro en SQLite, restauración y eliminación permanente. |
| CP-06 | **Historial Auditable** | Registro de todos los escaneos (tipo, fecha, archivos analizados, amenazas, estado), con exportación a archivo `.txt` y visor de logs con modal detallado. |

---

## 5. Restricciones

### 5.1 Restricciones Técnicas

- **Dependencia de ClamAV:** El sistema requiere que el usuario tenga ClamAV instalado localmente en `C:\Program Files\ClamAV`. Sin esta dependencia, las funciones de escaneo retornan un resultado vacío con un error registrado en el log.
- **Límites de ClamAV:** El tamaño máximo de archivo analizable está configurado en `clamd.conf` como `MaxFileSize 500M` y `MaxScanSize 500M`. Archivos superiores serán omitidos por el motor.
- **Archivos bloqueados por el S.O.:** Archivos en uso por el sistema operativo (Error 32: proceso en uso) no pueden ser escaneados y son clasificados como `IGNORED`.

### 5.2 Restricciones de Plataforma

- **Sistema Operativo:** Actualmente optimizado para **Windows 10/11 x64**. La lógica de rutas (`paths.js`), ocultamiento de honeypots (`attrib +h`) y resolución de binarios ClamAV está hardcoded para Windows.
- **Arquitectura:** Solo se generan builds para **x64** (NSIS y Portable).
- **Framework:** La aplicación depende de Electron 31 y Node.js integrado, lo que establece un baseline de ~80 MB para el ejecutable base.

---

## 6. Rangos de Calidad

Para garantizar la calidad del producto, se han establecido los siguientes rangos y herramientas:

| Dimensión de Calidad | Herramienta | Objetivo |
| :--- | :--- | :--- |
| **Cobertura de Código** | Vitest + @vitest/coverage-v8 | ≥ 80% de cobertura en componentes React |
| **Pruebas Unitarias** | Vitest + Testing Library | Validación de navegación, modales, estado y renderizado de todos los componentes |
| **Pruebas E2E / BDD** | Playwright + playwright-bdd | 14 escenarios Gherkin que cubren flujos completos de la aplicación |
| **Pruebas de Mutación** | Stryker Mutator | Validación de que los tests detectan cambios intencionados en el código |
| **Análisis Estático** | Semgrep + Snyk | Detección de vulnerabilidades en código y dependencias |
| **IaC Validation** | Terraform fmt + plan | Verificación de sintaxis y plan de ejecución de infraestructura |

---

## Bibliografía

1. McGraw, G. (2006). *Software Security: Building Security In*. Addison-Wesley Professional.
2. OWASP Foundation. (2025). *OWASP Top 10 Proactive Controls*. Recuperado de https://owasp.org/www-project-proactive-controls/
3. Electron. (2025). *Electron Documentation*. Recuperado de https://www.electronjs.org/docs
4. AV-TEST Institute. (2025). *Malware Statistics & Trends*. Recuperado de https://www.av-test.org/en/statistics/malware/
5. ClamAV. (2025). *ClamAV Official Documentation*. Recuperado de https://docs.clamav.net/
