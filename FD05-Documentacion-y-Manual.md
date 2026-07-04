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
| 2.0 | Equipo RustGuard | Mag. Patrick Cuadros Quiroga | Equipo RustGuard | 04/07/2026 | Manual consolidado de la Suite Omnicanal |

<div style="page-break-after: always; visibility: hidden"></div>

# **INDICE GENERAL**

[1. Introducción](#1-introducción)

[2. Manual: RustGuard GitHub Action](#2-manual-rustguard-github-action)

&nbsp;&nbsp;[2.1 Instalación en tu Pipeline](#21-instalación-en-tu-pipeline)

&nbsp;&nbsp;[2.2 Uso y Configuración](#22-uso-y-configuración)

[3. Manual: RustGuard Telegram Bot](#3-manual-rustguard-telegram-bot)

&nbsp;&nbsp;[3.1 Configuración de Entorno Local](#31-configuración-de-entorno-local)

&nbsp;&nbsp;[3.2 Manual del Usuario Final (Telegram)](#32-manual-del-usuario-final-telegram)

[4. Manual: RustGuard VS Code Extension](#4-manual-rustguard-vs-code-extension)

&nbsp;&nbsp;[4.1 Instalación de la Extensión](#41-instalación-de-la-extensión)

&nbsp;&nbsp;[4.2 Escaneo Local desde VS Code](#42-escaneo-local-desde-vs-code)

<div style="page-break-after: always; visibility: hidden"></div>

## 1. Introducción

El presente **Informe de Proyecto y Manual** consolida de manera centralizada la documentación técnica y de usuario de los tres pilares del ecosistema RustGuard Antivirus. Al ser una suite modular compuesta por interfaces completamente distintas (DevOps, Mensajería y Desarrollo Local), las guías de despliegue y uso difieren radicalmente por herramienta. A continuación se presentan las guías paso a paso para cada uno de los ecosistemas.

---

## 2. Manual: RustGuard GitHub Action

### 2.1 Instalación en tu Pipeline

El componente DevSecOps Action no requiere descargas directas en la máquina del desarrollador, se integra puramente a través del archivo de Workflows de GitHub (`.github/workflows`). 

Para proteger un repositorio:
1. Crea la ruta `.github/workflows/main.yml` en la raíz de tu proyecto si no existe.
2. Añade el siguiente bloque YAML al archivo:

```yaml
name: DevSecOps Security Scan
on: [push, pull_request]

jobs:
  rustguard_scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: RustGuard Security Scanner
        uses: IkerASierraR/action_rustguard@main
        with:
          scan-path: '.'
```

### 2.2 Uso y Configuración
Una vez inyectado, RustGuard se ejecutará automáticamente (de manera pasiva) ante cualquier evento de Push o Pull Request. No se requiere intervención adicional. Si el desarrollador inyecta accidentalmente secretos (ej. token de AWS) o código ofuscado, el *pipeline* fallará devolviendo un aspa roja (❌) y detallando en los logs exactamente el archivo y la línea del hallazgo.
* **Variable opcional:** Si solo quieres escanear una carpeta en específico (ej: una carpeta de uploads), cambia el valor de `scan-path` por `src/uploads`.

---

## 3. Manual: RustGuard Telegram Bot

### 3.1 Configuración de Entorno Local
A diferencia de la action, el bot de Telegram se hospeda en tu máquina, servidor o VPS.
1. Instalar dependencias globales: Requiere **Node.js 14+** y **ClamAV** (En Linux instalar vía `sudo apt install clamav` y en Windows mediante binarios en la ruta relativa `../../bin/clamav/clamscan.exe`).
2. Clonar el repositorio del bot y abrir una terminal.
3. Ejecutar `npm install` para instalar el SDK de Telegram.
4. Crear el archivo `.env` tomando como base `.env.example`:
   ```bash
   cp .env.example .env
   ```
5. Rellenar el archivo `.env` con el token provisto por [@BotFather](https://t.me/BotFather) en Telegram.
   ```env
   TELEGRAM_BOT_TOKEN="tu_token_aqui"
   ```
6. Inicializar el servicio ejecutando `npm start`.

### 3.2 Manual del Usuario Final (Telegram)
Una vez en línea, la interacción humana se diseña para ser trivial:
1. Abre Telegram y busca el nombre de usuario de tu bot.
2. Haz clic en **INICIAR** (o escribe `/start`).
3. Adjunta como *Documento* cualquier archivo sospechoso (`.pdf`, `.exe`, `.zip`).
4. Observa el veredicto en la sala de chat. En cuestión de milisegundos, obtendrás el mensaje **✅ SEGURO** o **🚨 PELIGRO MALWARE** con el nombre específico de la firma maliciosa encontrada.

---

## 4. Manual: RustGuard VS Code Extension

### 4.1 Instalación de la Extensión
Este escaner funciona de manera autónoma, consumiendo regex y algoritmos en TypeScript embebidos en el editor Visual Studio Code.
1. Existen dos métodos de instalación: 
   - **(Vía VSIX):** Dirígete a la pestaña de Extensiones de VSCode, pulsa sobre los tres puntos `...` y selecciona **Instalar desde archivo VSIX...**. Selecciona el archivo `rustguard-vscode-1.0.3.vsix`.
   - **(Vía Compilación Local):** Abre el código fuente en VS Code, corre `npm install`, luego `npm run compile` y presiona la tecla `F5` para lanzar el Entorno de Pruebas de VSCode con la extensión cargada.

### 4.2 Escaneo Local desde VS Code
Al ser una herramienta orientada al desarrollador, su diseño se integra limpiamente en la interfaz nativa del editor:
1. Navega por el **Explorador de Archivos** (barra lateral izquierda).
2. Haz **clic derecho** sobre el archivo (o script) que desees analizar en busca de payloads ocultos.
3. Pulsa sobre el nuevo botón inyectado en el menú contextual llamado **"Escanear con RustGuard Antivirus"**.
4. Visualiza la notificación emergente inferior derecha:
   - Notificación de Información (Azul): El archivo superó las capas criptográfica y heurística.
   - Notificación de Advertencia (Amarilla/Roja): Positivo en malware o extensión disfrazada (ej. ejecutable PE en archivo de texto). Se habilitará el botón **Ver detalles** para expandir los motivos en la consola de Output de VS Code.

---

## Bibliografía

1. Node.js Foundation. (2025). *Node.js v18.x Documentation*. Recuperado de https://nodejs.org/docs/latest-v18.x/api/
2. Python Software Foundation. (2025). *Python 3.10 Documentation*. Recuperado de https://docs.python.org/3.10/
3. GitHub. (2025). *Creating a composite action*. Recuperado de https://docs.github.com/en/actions/creating-actions/creating-a-composite-action
