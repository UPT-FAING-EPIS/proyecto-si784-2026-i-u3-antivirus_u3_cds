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

Informe de Especificación de Requerimientos

Versión *2.0*

| CONTROL DE VERSIONES | | | | |
|:---:|:---|:---|:---|:---|
| Versión | Hecha por | Revisada por | Aprobada por | Fecha | Motivo |
| 1.0 | LLica Mamani, Jimmy Mijair | Sierra Ruiz, Iker Alberto | LLica Mamani, Jimmy Mijair | 02/06/2026 | Versión Inicial |
| 2.0 | Equipo RustGuard | Mag. Patrick Cuadros Quiroga | Equipo RustGuard | 04/07/2026 | Especificación consolidada (Tres subsistemas) |

<div style="page-break-after: always; visibility: hidden"></div>

# **INDICE GENERAL**

[1. Introducción](#1-introducción)

[2. Requerimientos Funcionales (RF)](#2-requerimientos-funcionales-rf)

&nbsp;&nbsp;[2.1 Subsistema DevSecOps (Action)](#21-subsistema-devsecops-action)

&nbsp;&nbsp;[2.2 Subsistema Sandbox (Telegram Bot)](#22-subsistema-sandbox-telegram-bot)

&nbsp;&nbsp;[2.3 Subsistema IDE (VS Code)](#23-subsistema-ide-vs-code)

[3. Requerimientos No Funcionales (RNF)](#3-requerimientos-no-funcionales-rnf)

&nbsp;&nbsp;[3.1 Seguridad y Privacidad](#31-seguridad-y-privacidad)

&nbsp;&nbsp;[3.2 Rendimiento](#32-rendimiento)

&nbsp;&nbsp;[3.3 Portabilidad y Compatibilidad](#33-portabilidad-y-compatibilidad)

<div style="page-break-after: always; visibility: hidden"></div>

## 1. Introducción

El **Informe de Especificación de Requerimientos** consolida las capacidades que el sistema **RustGuard** debe ser capaz de realizar y las restricciones bajo las cuales debe operar. Debido a que el proyecto aborda la seguridad en 3 etapas distintas del flujo de un usuario, los requerimientos se categorizan funcionalmente por subsistema.

---

## 2. Requerimientos Funcionales (RF)

### 2.1 Subsistema DevSecOps (Action)
* **RF-A01:** El sistema debe montarse automáticamente en un contenedor al activarse los eventos `push` o `pull_request` en GitHub.
* **RF-A02:** El escáner (Python) debe iterar sobre el directorio especificado en el input `scan-path`, omitiendo directorios predecibles (ej. `.git`, `node_modules`).
* **RF-A03:** El sistema debe detectar credenciales quemadas ("Secret Scanning") usando expresiones regulares precisas (Ej. Tokens JWT, AWS Keys, RSA Private Keys).
* **RF-A04:** El sistema debe detectar payloads remotos ofuscados (ej. `eval(base64...)` en PHP/Python/JS y comandos `Invoke-WebRequest` ocultos en scripts).
* **RF-A05:** Si se detecta al menos una amenaza, la ejecución del script debe finalizar forzosamente devolviendo un código `exit(1)` para detener el pipeline.

### 2.2 Subsistema Sandbox (Telegram Bot)
* **RF-T01:** El bot (Node.js) debe estar escuchando en modalidad de *Long Polling* los eventos de tipo documento subidos a los chats.
* **RF-T02:** El bot debe solicitar a la API de Telegram la descarga del documento y almacenarlo en la carpeta temporal (ej. `os.tmpdir()/rustguard_telegram`).
* **RF-T03:** El sistema debe ejecutar el binario local `clamscan` contra la ruta del archivo descargado de forma asíncrona mediante un *Child Process*.
* **RF-T04:** El script debe parsear la respuesta `STDOUT` verificando exclusivamente la presencia del string `"FOUND"`.
* **RF-T05:** El sistema debe retornar un mensaje al chat (en formato Markdown) especificando "✅ SEGURO" o el nombre exacto de la amenaza detectada.

### 2.3 Subsistema IDE (VS Code)
* **RF-V01:** La extensión debe inyectar el comando "Escanear con RustGuard Antivirus" en el menú contextual `explorer/context` de VSCode.
* **RF-V02:** El sistema debe validar criptográficamente (SHA-256) el hash de un archivo contra un diccionario predefinido en código.
* **RF-V03:** El motor de heurística debe descartar el escaneo completo por expresiones regulares para archivos de un peso superior a 10MB.
* **RF-V04:** La extensión debe verificar los 2 primeros bytes del archivo en crudo para detectar cabeceras ejecutables (PE Headers - `MZ`), alertando si la extensión del archivo (ej. `.png`) no se condice.
* **RF-V05:** Si existen amenazas, la UI debe desplegar un *Output Channel* detallando iterativamente los motivos de la alerta.

---

## 3. Requerimientos No Funcionales (RNF)

### 3.1 Seguridad y Privacidad
* **RNF-01 (Zero-Trace):** Para el subsistema Telegram, el archivo analizado DEBE ser eliminado del file system del servidor mediante `fs.unlinkSync()` independientemente de si el veredicto es positivo, negativo o si ocurre una excepción en el motor.
* **RNF-02 (Autonomía VSCode):** La extensión de VSCode no debe realizar llamadas HTTP o enviar información de telemetría / archivos locales del programador hacia servicios de nube externos.
* **RNF-03 (Protección de Secretos):** Todos los tokens, llaves API y paths locales del sistema servidor no deben integrarse nunca directamente en el código fuente, requiriéndose obligatoriamente la parametrización vía `.env`.

### 3.2 Rendimiento
* **RNF-04:** El escáner de VSCode no debe bloquear la interfaz de usuario (UI Thread) del editor durante su análisis (empleo de promesas asíncronas).
* **RNF-05:** La acción de GitHub debe completar un escaneo de un repositorio promedio (aprox. 1,000 archivos de texto) en un tiempo no mayor a 45 segundos para no encarecer la infraestructura de integración continua.

### 3.3 Portabilidad y Compatibilidad
* **RNF-06:** El sistema de Telegram Bot debe determinar inteligentemente su plataforma (`os.platform() === 'win32'`) para ajustar los comandos de terminal; invocando ejecutables mapeados con sus respectivas rutas relativas en Windows, o demonios nativos de shell en Linux.
* **RNF-07:** La acción en GitHub debe estar contenedorizada basándose explícitamente en `python:3.10-slim` (o similar de Alpine) para garantizar su inmutabilidad en runners basados en Ubuntu u otros sistemas.
