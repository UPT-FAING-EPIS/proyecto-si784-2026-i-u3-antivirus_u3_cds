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
| 2.0 | Equipo RustGuard | Mag. Patrick Cuadros Quiroga | Equipo RustGuard | 04/07/2026 | Arquitectura completa con Modelo C4 |

<div style="page-break-after: always; visibility: hidden"></div>

# **INDICE GENERAL**

[1. Introducción](#1-introducción)

[2. Representación Arquitectónica - Modelo C4](#2-representación-arquitectónica---modelo-c4)

&nbsp;&nbsp;[2.1 Diagrama de Contexto (Nivel 1)](#21-diagrama-de-contexto-nivel-1)

&nbsp;&nbsp;[2.2 Diagrama de Contenedores (Nivel 2)](#22-diagrama-de-contenedores-nivel-2)

&nbsp;&nbsp;[2.3 Diagrama de Componentes (Nivel 3)](#23-diagrama-de-componentes-nivel-3)

[3. Vista de Procesos](#3-vista-de-procesos)

&nbsp;&nbsp;[3.1 Secuencia de Arranque](#31-secuencia-de-arranque)

&nbsp;&nbsp;[3.2 Secuencia de Escaneo](#32-secuencia-de-escaneo)

&nbsp;&nbsp;[3.3 Secuencia Anti-Ransomware](#33-secuencia-anti-ransomware)

[4. Vista de Despliegue](#4-vista-de-despliegue)

[5. Vista de Datos](#5-vista-de-datos)

[6. Restricciones de Diseño](#6-restricciones-de-diseño)

[7. Patrones Arquitectónicos](#7-patrones-arquitectónicos)

[8. Decisiones Arquitectónicas](#8-decisiones-arquitectónicas)

<div style="page-break-after: always; visibility: hidden"></div>

## 1. Introducción

El presente **Informe de Arquitectura** documenta las decisiones de diseño estructural del sistema **RustGuard Antivirus**, una aplicación de escritorio construida con Electron.js y React 19 que integra el motor ClamAV. La arquitectura sigue un modelo de **dos procesos aislados** (Main y Renderer) comunicados exclusivamente por IPC, conforme al patrón de seguridad de Electron con `contextIsolation: true`.

---

## 2. Representación Arquitectónica - Modelo C4

### 2.1 Diagrama de Contexto (Nivel 1)

```mermaid
C4Context
    title Diagrama de Contexto - RustGuard Antivirus

    Person(user, "Usuario Final", "Ejecuta escaneos y gestiona la seguridad de su equipo")

    System(rg, "RustGuard Antivirus", "Aplicación de escritorio Electron que integra ClamAV para protección antimalware")

    System_Ext(clamav, "ClamAV Engine", "Motor antivirus de firmas instalado en C:/Program Files/ClamAV")
    System_Ext(clamdb, "database.clamav.net", "Servidor de actualización de firmas ClamAV")
    System_Ext(winfs, "Windows File System", "Sistema de archivos del S.O.")

    Rel(user, rg, "Interactúa mediante la UI")
    Rel(rg, clamav, "Invoca clamdscan/clamd via child_process")
    Rel(rg, clamdb, "Descarga firmas con freshclam", "HTTPS")
    Rel(rg, winfs, "Lee/escribe archivos, monitorea cambios")
```

### 2.2 Diagrama de Contenedores (Nivel 2)

```mermaid
C4Container
    title Diagrama de Contenedores - RustGuard Antivirus

    Person(user, "Usuario")

    System_Boundary(rg, "RustGuard Antivirus") {
        Container(renderer, "Proceso Renderer", "React 19 + TailwindCSS", "UI premium con Dashboard, Escaneo, Tiempo Real, Cuarentena e Historial")
        Container(main, "Proceso Main", "Node.js (Electron)", "Orquesta IPC, gestiona ClamAV, SQLite, Watcher y Honeypots")
        Container(preload, "Preload Bridge", "CommonJS", "contextBridge que expone APIs seguras al Renderer")
        ContainerDb(sqlite, "SQLite DB", "better-sqlite3", "Almacena scan_history y quarantine (WAL mode)")
        Container(logs, "Sistema de Logs", "File System", "Archivos .log por sesión en userData/logs/")
    }

    System_Ext(clamd, "clamd Daemon", "Motor ClamAV en memoria")
    System_Ext(freshclam, "freshclam", "Actualizador de firmas")

    Rel(user, renderer, "Interactúa", "Electron UI")
    Rel(renderer, preload, "Invoca APIs", "contextBridge")
    Rel(preload, main, "Comunicación", "ipcRenderer ↔ ipcMain")
    Rel(main, clamd, "Escanea archivos", "child_process.spawn")
    Rel(main, freshclam, "Actualiza firmas", "child_process.spawn")
    Rel(main, sqlite, "CRUD", "better-sqlite3")
    Rel(main, logs, "Escribe logs", "fs.createWriteStream")
```

### 2.3 Diagrama de Componentes (Nivel 3)

```mermaid
graph TB
    subgraph MainProcess["Proceso Main (electron/)"]
        main_js["main.js<br/><i>IPC Hub - 30+ handlers</i>"]
        clamav_js["clamav.js<br/><i>Motor de Escaneo</i>"]
        clamd_svc["clamd_service.js<br/><i>Gestión del Daemon</i>"]
        config_gen["config_generator.js<br/><i>Genera clamd.conf</i>"]
        watcher_js["watcher.js<br/><i>Protección Tiempo Real</i>"]
        honeypot_js["honeypot.js<br/><i>Anti-Ransomware</i>"]
        quarantine_js["quarantine.js<br/><i>Gestión Cuarentena</i>"]
        db_js["db.js<br/><i>SQLite WAL</i>"]
        logger_js["logger.js<br/><i>Logging por Sesión</i>"]
        paths_js["paths.js<br/><i>Rutas userData</i>"]
        preload["preload.cjs<br/><i>IPC Bridge</i>"]
    end

    subgraph RendererProcess["Proceso Renderer (src/)"]
        app["App.jsx<br/><i>Router de Vistas</i>"]
        dashboard["Dashboard.jsx"]
        scan["Scan.jsx"]
        realtime["RealTime.jsx"]
        quarantine_page["Quarantine.jsx"]
        history["History.jsx"]
        layout["Layout.jsx"]
        sidebar["Sidebar.jsx"]
        titlebar["Titlebar.jsx"]
        logviewer["LogViewer.jsx"]
        threatmodal["ThreatModal.jsx"]
        ransomwaremodal["RansomwareAlertModal.jsx"]
    end

    main_js --> clamav_js
    main_js --> clamd_svc
    main_js --> config_gen
    main_js --> watcher_js
    main_js --> honeypot_js
    main_js --> quarantine_js
    main_js --> db_js

    clamav_js --> logger_js
    clamav_js --> db_js
    clamav_js --> paths_js
    watcher_js --> clamav_js
    quarantine_js --> db_js
    db_js --> paths_js
    logger_js --> paths_js
    clamd_svc --> paths_js

    app --> layout
    app --> ransomwaremodal
    layout --> sidebar
    layout --> titlebar
    scan --> logviewer
    scan --> threatmodal

    preload -.->|contextBridge| app
```

---

## 3. Vista de Procesos

### 3.1 Secuencia de Arranque

```mermaid
sequenceDiagram
    participant U as Usuario
    participant E as Electron (Main)
    participant S as Splash Screen
    participant CG as config_generator
    participant FC as freshclam
    participant CD as clamd
    participant W as BrowserWindow

    U->>E: Abre RustGuard.exe
    E->>CG: generateClamAVConfigs()
    E->>S: Muestra splash.html
    S-->>U: "Cargando..."
    E->>FC: spawn freshclam (actualizar firmas)
    FC-->>E: Firmas actualizadas (o warning)
    S-->>U: "Actualizando firmas ClamAV..."
    E->>CD: spawn clamd --config-file
    CD-->>E: Motor listo (o timeout 15s)
    S-->>U: "Cargando Motor Antivirus..."
    E->>W: createWindow() (ventana principal)
    E->>S: splash.close()
    W-->>U: Dashboard visible
```

### 3.2 Secuencia de Escaneo

```mermaid
sequenceDiagram
    participant U as Usuario (Renderer)
    participant P as Preload (IPC)
    participant M as main.js
    participant C as clamav.js
    participant DB as db.js
    participant L as logger.js
    participant CL as clamdscan.exe

    U->>P: scanQuick()
    P->>M: ipcMain.handle('scan-quick')
    M->>C: quickScan()
    C->>L: initSessionLog()
    C->>DB: insertScanStart('quick', logFile)
    C->>C: generateScanList(targets)
    C->>CL: spawn clamdscan -f lista.txt
    loop Por cada línea stdout
        CL-->>C: "archivo: OK" o "archivo: Threat FOUND"
        C->>C: parseClamScanLine(line)
        C->>L: writeLog(level, line)
        L-->>U: IPC 'log-message'
    end
    CL-->>C: process.close(code)
    C->>DB: updateScanFinish(id, files, threats, 'completed')
    C-->>M: {scannedFiles, threatsFound, threats[]}
    M-->>P: resultado
    P-->>U: Muestra resumen
```

### 3.3 Secuencia Anti-Ransomware

```mermaid
sequenceDiagram
    participant U as Usuario
    participant M as main.js
    participant H as honeypot.js
    participant FS as File System
    participant CK as chokidar
    participant W as BrowserWindow

    U->>M: toggleAntiransomware(true)
    M->>H: startAntiRansomware()
    H->>FS: writeFileSync('.rg_canary.docx')
    H->>FS: exec('attrib +h canary')
    H->>CK: watch(honeypots, {ignoreInitial:true})

    Note over CK,FS: Ransomware modifica el honeypot
    FS-->>CK: evento 'change'
    CK->>H: handleRansomwareDetection(path)
    H->>W: win.restore() + maximize() + setAlwaysOnTop(true)
    H->>W: send('ransomware-alert', {filePath, time})
    W-->>U: Modal ALERTA CRÍTICA pantalla completa
```

---

## 4. Vista de Despliegue

```mermaid
graph TB
    subgraph PC["🖥️ Máquina del Usuario (Windows x64)"]
        subgraph ElectronApp["RustGuard.exe (Electron 31)"]
            MainProc["Proceso Main (Node.js)"]
            RendererProc["Proceso Renderer (Chromium)"]
        end

        subgraph ClamAVInstall["C:/Program Files/ClamAV/"]
            clamd_exe["clamd.exe (Daemon)"]
            clamdscan_exe["clamdscan.exe (Scanner)"]
            freshclam_exe["freshclam.exe (Updater)"]
        end

        subgraph UserData["AppData/Roaming/RustGuard/"]
            db_file["db/rustguard.db"]
            logs_dir["logs/*.log"]
            quar_dir["quarantine/*.quar"]
            clamdb["clamav_db/*.cvd"]
            conf1["clamd.conf"]
            conf2["freshclam.conf"]
        end
    end

    subgraph Cloud["☁️ Internet"]
        ClamDBServer["database.clamav.net"]
    end

    MainProc --> clamd_exe
    MainProc --> clamdscan_exe
    MainProc --> freshclam_exe
    MainProc --> db_file
    MainProc --> logs_dir
    MainProc --> quar_dir
    freshclam_exe --> ClamDBServer
```

---

## 5. Vista de Datos

```mermaid
erDiagram
    scan_history {
        INTEGER id PK "AUTO INCREMENT"
        TEXT scan_type "quick | full | file"
        DATETIME started_at "NOT NULL"
        DATETIME finished_at "NULLABLE"
        INTEGER files_scanned "DEFAULT 0"
        INTEGER threats_found "DEFAULT 0"
        TEXT log_file "Ruta al archivo .log"
        TEXT status "running | completed | cancelled | error"
    }

    quarantine {
        INTEGER id PK "AUTO INCREMENT"
        TEXT original_path "NOT NULL"
        TEXT quarantine_path "NOT NULL"
        TEXT threat_name "NULLABLE"
        DATETIME quarantined_at "NOT NULL"
        BOOLEAN restored "DEFAULT 0"
    }
```

---

## 6. Restricciones de Diseño

| Restricción | Justificación |
| :--- | :--- |
| **Context Isolation obligatorio** | `contextIsolation: true` + `nodeIntegration: false` para prevenir ataques XSS en el Renderer. |
| **Comunicación exclusiva por IPC** | Todo acceso a Node.js APIs pasa por `preload.cjs` → `contextBridge.exposeInMainWorld()`. |
| **Spawn asíncrono para ClamAV** | `child_process.spawn()` evita bloquear el event loop de Node.js durante escaneos largos. |
| **SQLite WAL mode** | Garantiza integridad de datos ante cierres inesperados de la aplicación. |
| **Directorios en userData** | Todos los datos persistentes (DB, logs, cuarentena, firmas) residen en `app.getPath('userData')` para portabilidad. |

---

## 7. Patrones Arquitectónicos

| Patrón | Aplicación en RustGuard |
| :--- | :--- |
| **Broker (IPC Broker)** | `main.js` actúa como broker central que recibe mensajes IPC del Renderer y los despacha a los módulos apropiados (clamav, quarantine, watcher, honeypot). |
| **Observer** | `chokidar` implementa el patrón Observer para monitorear cambios en el file system. `BrowserWindow.webContents.send()` implementa pub/sub para notificar al Renderer. |
| **Queue (Cola)** | `watcher.js` encola archivos detectados y los procesa secuencialmente (`processQueue()`) para evitar saturar ClamAV con múltiples escaneos simultáneos. |
| **Façade** | `preload.cjs` actúa como fachada que abstrae 30+ llamadas IPC en una API limpia (`window.electronAPI`). |
| **Fail-Safe** | Si ClamAV no está instalado, el sistema no crashea; retorna resultado vacío y registra el error. Si clamd no responde, el timeout de 15s resuelve la promesa como fallback. |
| **Repository** | `db.js` centraliza todas las operaciones CRUD de SQLite, exponiendo funciones puras (`insertScanStart`, `updateScanFinish`, etc.) sin exponer el objeto `db` directamente. |

---

## 8. Decisiones Arquitectónicas

| ID | Decisión | Alternativas Evaluadas | Justificación |
| :---: | :--- | :--- | :--- |
| AD-01 | Usar `clamdscan` (daemon) en lugar de `clamscan` (standalone) | clamscan recarga firmas en cada ejecución (~15s de startup) | clamdscan se conecta al daemon que ya tiene las firmas en RAM, reduciendo el tiempo de escaneo por archivo a milisegundos. |
| AD-02 | Generar lista de archivos antes de invocar clamdscan (`-f flag`) | Pasar directorio directamente a clamdscan | Permite cancelación granular durante la fase de recopilación y evita que clamdscan aborte por archivos inaccesibles. |
| AD-03 | Usar `better-sqlite3` sincrónico en lugar de un ORM async | Sequelize, TypeORM, knex | SQLite es single-threaded por naturaleza. `better-sqlite3` es el driver más rápido para Node.js y el modo sincrónico simplifica la lógica de transacciones sin overhead de promesas. |
| AD-04 | Ventana Frameless con Titlebar personalizado | Frame nativo del S.O. | Permite un diseño visual consistente con el tema oscuro premium y controles de ventana integrados en la marca RustGuard. |
| AD-05 | Honeypots con `chokidar` en lugar de Windows API (`ReadDirectoryChangesW`) | API nativa de Windows | `chokidar` es cross-platform y ya es dependencia del proyecto para el módulo de Tiempo Real, evitando duplicar la lógica de file watching. |

---

## Bibliografía

1. Richards, M., & Ford, N. (2020). *Fundamentals of Software Architecture*. O'Reilly Media.
2. Brown, S. (2021). *The C4 Model for Visualising Software Architecture*. Recuperado de https://c4model.com/
3. Electron. (2025). *Process Model*. Recuperado de https://www.electronjs.org/docs/latest/tutorial/process-model
4. SQLite. (2025). *Write-Ahead Logging*. Recuperado de https://www.sqlite.org/wal.html
