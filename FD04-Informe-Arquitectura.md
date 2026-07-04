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

Informe de Arquitectura

Versión *2.0*

| CONTROL DE VERSIONES | | | | |
|:---:|:---|:---|:---|:---|
| Versión | Hecha por | Revisada por | Aprobada por | Fecha | Motivo |
| 1.0 | Sierra Ruiz, Iker Alberto | LLica Mamani, Jimmy Mijair | Sierra Ruiz, Iker Alberto | 02/06/2026 | Versión Inicial |
| 2.0 | Equipo RustGuard | Mag. Patrick Cuadros Quiroga | Equipo RustGuard | 04/07/2026 | Arquitectura Multi-Plataforma (Integración Final) |

<div style="page-break-after: always; visibility: hidden"></div>

# **INDICE GENERAL**

[1. Introducción](#1-introducción)

[2. Representación Arquitectónica](#2-representación-arquitectónica)

[3. Vista Lógica y Componentes](#3-vista-lógica-y-componentes)

&nbsp;&nbsp;[3.1 Core Scanner (Python - Action)](#31-core-scanner-python---action)

&nbsp;&nbsp;[3.2 Node Middleware (Node.js - Telegram)](#32-node-middleware-nodejs---telegram)

&nbsp;&nbsp;[3.3 Native Extension Engine (TS - VSCode)](#33-native-extension-engine-ts---vscode)

[4. Restricciones de Diseño](#4-restricciones-de-diseño)

[5. Patrones Arquitectónicos](#5-patrones-arquitectónicos)

<div style="page-break-after: always; visibility: hidden"></div>

## 1. Introducción

El **Informe de Arquitectura** provee una perspectiva integral de las decisiones de diseño estructural del ecosistema **RustGuard Antivirus**. A diferencia de los sistemas de seguridad monolíticos que instalan agentes perpetuos en un sistema operativo, RustGuard se diseñó bajo una arquitectura **Desacoplada y Modular**. El ecosistema se subdivide en tres componentes principales que, aunque no se comunican directamente a través de una API central, comparten la misma lógica de negocio heurística y operan bajo la filosofía *Shift-Left Security*.

---

## 2. Representación Arquitectónica

El sistema global se representa mediante un **Modelo Distribuido de Integraciones Aisladas**. Cada integración es 100% independiente para prevenir Puntos Únicos de Fallo (SPOF - Single Point Of Failure).

```text
[ Ecosistema RustGuard ]
   │
   ├──> 1. [ VS Code Extension ] (TypeScript)
   │       └── Ejecución nativa en el proceso V8 del editor local.
   │       └── Motor interno: Regex y Hashing.
   │
   ├──> 2. [ GitHub Action ] (Python 3.10)
   │       └── Ejecución efímera en Runner (Docker Container).
   │       └── Motor interno: Regex profunda / Secret Scanning.
   │
   └──> 3. [ Telegram Bot ] (Node.js)
           └── Ejecución en Servidor (Daemon / PM2).
           └── Delegación de proceso (OS Shell) al motor ClamAV.
```

---

## 3. Vista Lógica y Componentes

### 3.1 Core Scanner (Python - Action)
- **Capa de Control:** El archivo `main.yml` orquesta la invocación del contenedor usando `action.yml` como metadato.
- **Capa de Procesamiento (`scanner.py`):** Utiliza la librería estándar de Python (`os`, `re`, `sys`) para atravesar el árbol de directorios del repositorio virtual, escupiendo los resultados a la salida estándar `stdout`.
- **Estrategia de Salida:** Devuelve códigos de estado (`sys.exit(1)` en caso de malware) para interconectarse con la API de flujos de trabajo de GitHub.

### 3.2 Node Middleware (Node.js - Telegram)
- **Capa de Escucha (`bot.js`):** Instancia `TelegramBot` (Long Polling), suscribiéndose asíncronamente a los eventos `on('message')`.
- **Capa de I/O Temporal:** Emplea los módulos `fs` y `path` nativos para gestionar transitoriamente descargas en buffers usando `fetch` y `arrayBuffer()`.
- **Capa de Ejecución (Sub-Process):** Actúa como middleware de sistema operativo utilizando `exec()` para llamar directamente a un Daemon o Binario (ClamAV - `clamscan.exe`). La salida es parseada mediante expresiones regulares.

### 3.3 Native Extension Engine (TS - VSCode)
- **Capa de Suscripción:** A través del archivo `package.json` (`activationEvents`), se inyectan comandos en la UI de Electron (VS Code).
- **Capa Heurística de Triple Capa (`extension.ts`):** 
  - *Capa 1 (Crypto):* Mapeo de hashes criptográficos mediante la API nativa de criptografía de Node.
  - *Capa 2 (Content):* Verificación iterativa con expresiones regulares (RegEx).
  - *Capa 3 (Binary Header):* Apertura superficial de archivos (Buffer Chunking) para leer bytes iniciales (Magic Numbers) utilizando identificadores como `0x4D 0x5A` (PE - Portable Executable).

---

## 4. Restricciones de Diseño

* **Restricciones de Memoria (RAM):** Dado que la extensión de VS Code y el Scanner en Python leen el contenido íntegro del archivo hacia la memoria en su Capa 2 (Content Regex), se aplica una restricción por diseño limitando el tamaño máximo analizable (por ejemplo, 10 MB en TypeScript) para evitar crashes del IDE o sobrecostos en el Runner de Github.
* **Manejo Dinámico de Rutas:** El bot de Telegram está diseñado con bifurcación de lógica (`os.platform() === 'win32'`) para resolver estáticamente las rutas a los binarios locales en Windows o depender del `PATH` global de Unix en entornos de producción Linux, restringiendo su despliegue en Windows a una estructura de carpetas estricta.

---

## 5. Patrones Arquitectónicos

* **Façade Pattern (Fachada):**
El bot de Telegram y la Extensión actúan como fachadas. El usuario interactúa de forma gráfica, simple y amigable, mientras que toda la complejidad de orquestación de subprocesos y librerías criptográficas es abstraída en el backend del módulo.
* **Fail-Fast (Fallo Rápido):**
En el diseño del DevSecOps Action, no se intenta limpiar el archivo malicioso ni se recolectan estadísticas lentas; en cuanto un módulo detecta una firma positiva, se genera el error crítico para abortar la tubería (Pipeline) y proteger el despliegue de inmediato.
* **Event-Driven (Orientado a Eventos):**
Toda la suite responde a eventos asíncronos generados por entidades externas, garantizando el ahorro computacional (Bot: Mensajes entrantes / Action: Eventos Push / VSCode: Command Invocation).
