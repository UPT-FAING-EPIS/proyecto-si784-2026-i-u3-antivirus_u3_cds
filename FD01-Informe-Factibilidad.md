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

[2. Riesgos y Mitigación](#2-riesgos-y-mitigación)

[3. Análisis de la Situación actual](#3-análisis-de-la-situación-actual)

[4. Estudio de Factibilidad](#4-estudio-de-factibilidad)

&nbsp;&nbsp;[4.1 Factibilidad Técnica](#41-factibilidad-técnica)

&nbsp;&nbsp;[4.2 Factibilidad Económica](#42-factibilidad-económica)

&nbsp;&nbsp;[4.3 Factibilidad Operativa](#43-factibilidad-operativa)

&nbsp;&nbsp;[4.4 Factibilidad Legal](#44-factibilidad-legal)

<div style="page-break-after: always; visibility: hidden"></div>

## 1. Descripción del Proyecto

**RustGuard Antivirus** ha evolucionado de un escáner aislado a una suite completa (ecosistema) orientada a proteger el ciclo de vida del desarrollo y la transferencia de archivos en entornos modernos. El proyecto se compone de tres frentes tecnológicos interconectados conceptualmente, aunque independientes en su despliegue:

1. **RustGuard DevSecOps Action:** Una integración en GitHub Actions escrita en Python que escanea automáticamente repositorios completos en busca de secretos expuestos, paylods de malware, inyección de código y archivos de doble extensión. Actúa como portero de seguridad en metodologías CI/CD.
2. **RustGuard Telegram Bot:** Un agente conversacional escrito en Node.js que aprovecha el motor de ClamAV instalado en el sistema host para actuar como sandbox. Recibe archivos de usuarios, los evalúa en un entorno temporal aislado, dictamina su nivel de peligrosidad y elimina rastros (`zero-trace`), protegiendo ecosistemas de mensajería.
3. **RustGuard VS Code Extension:** Una extensión autónoma desarrollada en TypeScript/Node.js para entornos de programación locales. Realiza comprobaciones a nivel de bytes (cabeceras PE) y emplea heurística y hashes criptográficos (SHA-256) sin requerir internet, garantizando la seguridad en el entorno primario del desarrollador.

---

## 2. Riesgos y Mitigación

| Riesgo | Impacto | Estrategia de Mitigación |
| :--- | :--- | :--- |
| **Complejidad de Mantenimiento:** Manejo de 3 lenguajes distintos (Python, JS, TS). | Alto | Se ha definido un estándar de programación riguroso y una separación clara de responsabilidades arquitectónicas (Action vs Bot vs Extension). |
| **Dependencia de ClamAV (Telegram Bot):** El servidor necesita mantener firmas actualizadas. | Medio | Implementación de rutinas automáticas (`freshclam`) a nivel servidor y limitación del escaneo al tamaño del directorio `/tmp`. |
| **Falsos Positivos en Regex (VSCode/Action):** Detección errónea de código legítimo. | Medio | Calibración detallada de Expresiones Regulares; el usuario de VSCode/Github mantiene el control final de anular la advertencia revisando el log (Output Channel / Action Logs). |
| **Exceso de Carga (Action):** Repositorios masivos ralentizando el pipeline. | Bajo | Exclusión de carpetas predecibles como `node_modules` y `.git`, así como escaneos parciales por `scan-path`. |

---

## 3. Análisis de la Situación actual

Actualmente, las empresas enfrentan amenazas en múltiples vectores de ataque: código inyectado a través de repositorios compartidos, descarga de utilidades ofuscadas durante la escritura de código en los IDE, y transferencia de ejecutables maliciosos en canales de mensajería empresarial como Telegram.
Los sistemas tradicionales de antivirus (basados únicamente en el escaneo de disco en segundo plano) suelen ser intrusivos, consumen altos recursos de RAM y no están integrados en las herramientas de uso diario del programador. RustGuard propone acercar la seguridad (Shift-Left Security) proveyéndola exactamente donde ocurre el flujo de trabajo: el repositorio (GitHub), el IDE (VS Code) y la comunicación (Telegram).

---

## 4. Estudio de Factibilidad

### 4.1 Factibilidad Técnica
Técnicamente, el sistema es altamente viable. 
- **VSCode:** Utiliza el API nativa de VSCode (`vscode.commands.registerCommand`) y librerías Node `fs` y `crypto`, no requiere dependencias pesadas.
- **Telegram:** Aprovecha Node Telegram Bot API y la capacidad de Spawning Processes de Node.js (`child_process.exec`) para comunicarse con ClamAV, lo que lo hace ligero y asíncrono.
- **Action:** Se empaqueta eficientemente en una imagen Docker ultraligera (`python:3.10-slim`), asegurando portabilidad e integración perfecta con los runners de GitHub.

### 4.2 Factibilidad Económica
El proyecto tiene un **Costo Operativo de $0** para su despliegue inicial y de pruebas.
- **Alojamiento (Action):** Los runners públicos de GitHub Actions son gratuitos para proyectos Open Source.
- **IDE:** VS Code es de código abierto y gratuito.
- **Bot:** La API de Telegram es gratuita; el alojamiento de ClamAV puede realizarse en servidores de bajo costo (VPS Tier 1) y en modo local para entornos de prueba.
- **Licenciamiento:** El motor antivirus principal depende de firmas Open Source (ClamAV) y heurística de creación propia, evadiendo pagos por licencias de software propietario.

### 4.3 Factibilidad Operativa
Desde el punto de vista del usuario final, la operatividad es transparente:
- El **desarrollador** no nota la Action hasta que rompe accidentalmente las reglas de seguridad.
- El **programador** en VSCode simplemente hace clic derecho sin salir de su editor.
- El **usuario común** arrastra su archivo a Telegram y recibe una respuesta casi inmediata.
Esta descentralización garantiza una curva de aprendizaje mínima.

### 4.4 Factibilidad Legal
El proyecto es compatible con normativas estándar de código abierto. Al implementar la metodología *Zero-Trace* en el bot de Telegram (eliminando permanentemente los archivos del directorio `/tmp` tras su análisis), RustGuard garantiza la privacidad del usuario, alineándose indirectamente con leyes de protección de datos (como GDPR) al no almacenar PII (Personal Identifiable Information) ni archivos sensibles a largo plazo.
