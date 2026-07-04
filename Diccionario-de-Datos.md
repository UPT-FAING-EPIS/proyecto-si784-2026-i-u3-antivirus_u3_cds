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

Diccionario de Datos y Estructuras

Versión *2.0*

| CONTROL DE VERSIONES | | | | |
|:---:|:---|:---|:---|:---|
| Versión | Hecha por | Revisada por | Aprobada por | Fecha | Motivo |
| 1.0 | Equipo RustGuard | Mag. Patrick Cuadros Quiroga | Equipo RustGuard | 04/07/2026 | Definición Estructural |
| 2.0 | Equipo RustGuard | Mag. Patrick Cuadros Quiroga | Equipo RustGuard | 04/07/2026 | Diccionario completo con esquemas SQLite e IPC |

<div style="page-break-after: always; visibility: hidden"></div>

# **INDICE GENERAL**

[1. Introducción](#1-introducción)

[2. Esquema de Base de Datos (SQLite)](#2-esquema-de-base-de-datos-sqlite)

&nbsp;&nbsp;[2.1 Tabla scan_history](#21-tabla-scan_history)

&nbsp;&nbsp;[2.2 Tabla quarantine](#22-tabla-quarantine)

[3. Estructuras de Datos en Memoria](#3-estructuras-de-datos-en-memoria)

&nbsp;&nbsp;[3.1 Resultado de Escaneo (ScanSummary)](#31-resultado-de-escaneo-scansummary)

&nbsp;&nbsp;[3.2 Línea Parseada (ParsedLine)](#32-línea-parseada-parsedline)

&nbsp;&nbsp;[3.3 Entrada de Log (LogEntry)](#33-entrada-de-log-logentry)

[4. Contratos IPC (Inter-Process Communication)](#4-contratos-ipc-inter-process-communication)

&nbsp;&nbsp;[4.1 Canales Handle (invoke/handle)](#41-canales-handle-invokehandle)

&nbsp;&nbsp;[4.2 Canales Send (eventos push)](#42-canales-send-eventos-push)

[5. Configuración ClamAV Generada](#5-configuración-clamav-generada)

[6. Estructura de Directorios](#6-estructura-de-directorios)

<div style="page-break-after: always; visibility: hidden"></div>

## 1. Introducción

RustGuard utiliza **SQLite** como base de datos embebida para persistencia local, **objetos JavaScript** para las estructuras transitorias en memoria, y el protocolo **IPC de Electron** como contrato de comunicación entre procesos. Este diccionario documenta exhaustivamente cada una de estas estructuras.

---

## 2. Esquema de Base de Datos (SQLite)

**Motor:** better-sqlite3 v11.x | **Modo:** WAL (Write-Ahead Logging) | **Ubicación:** `%APPDATA%/RustGuard/db/rustguard.db`

### 2.1 Tabla `scan_history`

Registra cada escaneo ejecutado por el usuario.

| Campo | Tipo | Restricciones | Descripción |
| :--- | :---: | :--- | :--- |
| `id` | INTEGER | PK, AUTOINCREMENT | Identificador único del escaneo |
| `scan_type` | TEXT | NOT NULL | Tipo: `quick`, `full` o `file` |
| `started_at` | DATETIME | NOT NULL | Fecha/hora de inicio (localtime) |
| `finished_at` | DATETIME | NULLABLE | Fecha/hora de finalización |
| `files_scanned` | INTEGER | DEFAULT 0 | Total de archivos analizados |
| `threats_found` | INTEGER | DEFAULT 0 | Total de amenazas detectadas |
| `log_file` | TEXT | NULLABLE | Ruta absoluta al archivo `.log` |
| `status` | TEXT | NOT NULL | `running`, `completed`, `cancelled`, `error` |

### 2.2 Tabla `quarantine`

Registra cada archivo aislado en cuarentena.

| Campo | Tipo | Restricciones | Descripción |
| :--- | :---: | :--- | :--- |
| `id` | INTEGER | PK, AUTOINCREMENT | Identificador único del registro |
| `original_path` | TEXT | NOT NULL | Ruta original del archivo infectado |
| `quarantine_path` | TEXT | NOT NULL | Ruta en `userData/quarantine/` con extensión `.quar` |
| `threat_name` | TEXT | NULLABLE | Nombre de la firma de malware (ej. `Win.Test.EICAR`) |
| `quarantined_at` | DATETIME | NOT NULL | Fecha/hora de aislamiento (localtime) |
| `restored` | BOOLEAN | DEFAULT 0 | `0` = en cuarentena, `1` = restaurado/eliminado |

---

## 3. Estructuras de Datos en Memoria

### 3.1 Resultado de Escaneo (`ScanSummary`)

Retornado por `quickScan()`, `fullScan()` y `scanTarget()`:

```javascript
{
  scannedFiles: Number,   // Total archivos procesados
  threatsFound: Number,   // Total amenazas detectadas
  threats: [              // Array de amenazas individuales
    {
      file: String,       // Ruta del archivo infectado
      status: 'THREAT',
      threatName: String, // Nombre de la firma (ej. "Win.Test.EICAR_HDB-1")
      rawLine: String     // Línea cruda de clamdscan
    }
  ]
}
```

### 3.2 Línea Parseada (`ParsedLine`)

Retornada por `parseClamScanLine()` para cada línea de stdout de clamdscan:

| Campo | Tipo | Valores Posibles | Descripción |
| :--- | :---: | :--- | :--- |
| `file` | String\|null | Ruta del archivo o null | Archivo al que pertenece la línea |
| `status` | String | `CLEAN`, `THREAT`, `IGNORED`, `INFO` | Clasificación de la línea |
| `threatName` | String\|null | Nombre de amenaza o null | Solo presente si `status === 'THREAT'` |
| `rawLine` | String | Línea original | Texto crudo para el visor de logs |

### 3.3 Entrada de Log (`LogEntry`)

Emitida por `writeLog()` al Renderer vía IPC:

```javascript
{
  timestamp: String,  // "[HH:MM:SS]"
  level: String,      // "INFO" | "SUCCESS" | "WARNING" | "DANGER" | "ERROR"
  message: String,    // Mensaje descriptivo
  rawLine: String     // Línea completa formateada
}
```

---

## 4. Contratos IPC (Inter-Process Communication)

### 4.1 Canales Handle (invoke/handle)

| Canal IPC | Dirección | Parámetros | Retorno | Módulo |
| :--- | :---: | :--- | :--- | :--- |
| `scan-quick` | R→M | — | ScanSummary | clamav.js |
| `scan-full` | R→M | — | ScanSummary | clamav.js |
| `scan-target` | R→M | `targetPath: string` | ScanSummary | clamav.js |
| `cancel-scan` | R→M | — | `boolean` | clamav.js |
| `select-folder` | R→M | — | `string\|null` | main.js (dialog) |
| `quarantine-file` | R→M | `originalPath, threatName` | `{success, id}` | quarantine.js |
| `restore-file` | R→M | `id: number` | `{success}` | quarantine.js |
| `delete-quarantine-file` | R→M | `id: number` | `{success}` | quarantine.js |
| `get-quarantine-records` | R→M | — | `Array<QuarantineRecord>` | db.js |
| `get-scan-history` | R→M | — | `Array<ScanRecord>` | db.js |
| `export-history` | R→M | — | `{success, path}` | main.js |
| `read-log` | R→M | `logPath: string` | `string` (contenido) | main.js |
| `toggle-realtime` | R→M | `enable: boolean` | `boolean` (nuevo estado) | watcher.js |
| `get-realtime-status` | R→M | — | `boolean` | watcher.js |
| `toggle-antiransomware` | R→M | `enable: boolean` | `boolean` | honeypot.js |
| `get-antiransomware-status` | R→M | — | `boolean` | honeypot.js |

### 4.2 Canales Send (eventos push)

| Canal IPC | Dirección | Payload | Descripción |
| :--- | :---: | :--- | :--- |
| `log-message` | M→R | `LogEntry` | Cada línea de log en tiempo real |
| `threat-detected` | M→R | `ParsedLine` (threat) | Amenaza detectada en tiempo real |
| `ransomware-alert` | M→R | `{filePath, time}` | Honeypot alterado |
| `realtime-status-changed` | M→R | `boolean` | Cambio de estado del watcher |
| `antiransomware-status-changed` | M→R | `boolean` | Cambio de estado del honeypot |
| `splash-status` | M→Splash | `string` | Mensaje de progreso del splash |

---

## 5. Configuración ClamAV Generada

El archivo `clamd.conf` se genera dinámicamente en `config_generator.js`:

| Directiva | Valor | Descripción |
| :--- | :---: | :--- |
| `TCPSocket` | 3310 | Puerto TCP del daemon |
| `TCPAddr` | 127.0.0.1 | Solo conexiones locales |
| `DatabaseDirectory` | `{userData}/clamav_db` | Ruta de firmas |
| `MaxDirectoryRecursion` | 20 | Niveles de profundidad |
| `MaxFiles` | 10000 | Archivos por escaneo |
| `MaxFileSize` | 500M | Tamaño máximo de archivo |
| `MaxScanSize` | 500M | Tamaño máximo total |
| `ScanPE` | yes | Escanear ejecutables Windows |
| `ScanPDF` | yes | Escanear documentos PDF |
| `ScanArchive` | yes | Escanear archivos comprimidos |

---

## 6. Estructura de Directorios

```
rustguard/
├── electron/                    # Proceso Main (Backend)
│   ├── main.js                  # Hub IPC (30+ handlers)
│   ├── clamav.js                # Motor de escaneo ClamAV
│   ├── clamd_service.js         # Gestión del daemon clamd
│   ├── config_generator.js      # Generador de clamd.conf/freshclam.conf
│   ├── db.js                    # SQLite (WAL mode)
│   ├── honeypot.js              # Anti-Ransomware (honeypots)
│   ├── logger.js                # Logging por sesión
│   ├── paths.js                 # Rutas userData + seed ClamAV DB
│   ├── preload.cjs              # IPC Bridge (contextBridge)
│   ├── quarantine.js            # Gestión de cuarentena
│   ├── splash.html              # Pantalla de carga
│   └── watcher.js               # Protección en tiempo real
├── src/                         # Proceso Renderer (Frontend)
│   ├── App.jsx                  # Router de vistas + ransomware listener
│   ├── App.css                  # Estilos base
│   ├── index.css                # Variables CSS (tema oscuro)
│   ├── main.jsx                 # Entry point React
│   ├── components/              # Componentes reutilizables
│   │   ├── Layout.jsx           # Contenedor con Sidebar + Titlebar
│   │   ├── LogViewer.jsx        # Visor de logs en tiempo real
│   │   ├── RansomwareAlertModal.jsx # Modal de emergencia
│   │   ├── Sidebar.jsx          # Barra de navegación lateral
│   │   ├── ThreatModal.jsx      # Modal de amenaza detectada
│   │   └── Titlebar.jsx         # Barra de título personalizada
│   ├── pages/                   # Páginas/vistas de la app
│   │   ├── Dashboard.jsx        # Panel principal
│   │   ├── History.jsx          # Historial de escaneos
│   │   ├── Quarantine.jsx       # Bóveda de cuarentena
│   │   ├── RealTime.jsx         # Protección en tiempo real
│   │   └── Scan.jsx             # Centro de escaneo
│   ├── features/                # Escenarios BDD (Gherkin)
│   │   └── antivirus.feature    # 14 scenarios
│   └── test/                    # Pruebas unitarias
│       ├── App.test.jsx
│       ├── components/          # 6 tests de componentes
│       └── pages/               # 5 tests de páginas
├── terraform/                   # Infraestructura como Código
│   ├── main.tf                  # AWS S3 Bucket
│   ├── variables.tf             # Variables (region, environment)
│   └── outputs.tf               # Output: bucket name
├── .github/workflows/           # Pipelines CI/CD
│   ├── coverage.yml             # Cobertura → GitHub Pages
│   ├── e2e.yml                  # Playwright BDD
│   ├── mutation.yml             # Stryker → GitHub Pages
│   ├── release.yml              # Electron Builder (Windows)
│   ├── static-analysis.yml      # Semgrep + Snyk
│   └── terraform.yml            # Terraform init/fmt/plan
├── package.json                 # Configuración del proyecto
├── vite.config.js               # Configuración de Vite
├── vitest.config.js             # Configuración de Vitest
├── playwright.config.js         # Configuración de Playwright
└── stryker.config.json          # Configuración de Stryker
```

---

## Bibliografía

1. Paar, C., & Pelzl, J. (2010). *Understanding Cryptography*. Springer.
2. EICAR. (2025). *EICAR Test File*. Recuperado de https://www.eicar.org/
3. SQLite. (2025). *SQLite Documentation*. Recuperado de https://www.sqlite.org/docs.html
4. Electron. (2025). *IPC Communication*. Recuperado de https://www.electronjs.org/docs/latest/tutorial/ipc
