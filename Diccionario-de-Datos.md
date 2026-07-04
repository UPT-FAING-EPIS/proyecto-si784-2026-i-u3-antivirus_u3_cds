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

Diccionario de Datos y Estructuras Constantes

Versión *1.0*

| CONTROL DE VERSIONES | | | | |
|:---:|:---|:---|:---|:---|
| Versión | Hecha por | Revisada por | Aprobada por | Fecha | Motivo |
| 1.0 | Equipo RustGuard | Mag. Patrick Cuadros Quiroga | Equipo RustGuard | 04/07/2026 | Definición Estructural (No-Relacional) |

<div style="page-break-after: always; visibility: hidden"></div>

# **INDICE GENERAL**

[1. Introducción](#1-introducción)

[2. Diccionario de Datos: Estructuras Criptográficas](#2-diccionario-de-datos-estructuras-criptográficas)

[3. Diccionario de Datos: Patrones Heurísticos (RegEx)](#3-diccionario-de-datos-patrones-heurísticos-regex)

[4. Diccionario de Datos: Variables de Entorno y Inputs](#4-diccionario-de-datos-variables-de-entorno-y-inputs)

[5. Sets de Restricción](#5-sets-de-restricción)

<div style="page-break-after: always; visibility: hidden"></div>

## 1. Introducción

El sistema **RustGuard Antivirus**, debido a su naturaleza proactiva y filosofía *Zero-Trace*, **no depende de Bases de Datos Relacionales (SQL)** o persistentes en disco para almacenar perfiles de usuario o historial de escaneos, limitando vectores de ataque al servidor.
En su lugar, emplea estructuras de datos dinámicas (Diccionarios en Python, Records en TypeScript, Objetos en JavaScript) alojadas en memoria (RAM) al momento del despliegue. Este documento mapea dichas estructuras determinantes.

---

## 2. Diccionario de Datos: Estructuras Criptográficas

Utilizado predominantemente en el Subsistema **VSCode Extension** para validación algorítmica de archivos.

### Estructura: `KNOWN_MALWARE_HASHES`
| Nombre del Campo / Clave (Key) | Tipo de Dato | Longitud / Formato | Descripción / Propósito |
| :--- | :---: | :---: | :--- |
| `[sha256_hash]` (Key) | String | 64 caracteres (Hex) | El identificador criptográfico SHA-256 único e irrefutable de un malware conocido. |
| `threat_name` (Value) | String | Variable | El nombre público o identificador común de la amenaza asignada a dicho hash. |

**Ejemplo de Registro:**
- *Key:* `275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f`
- *Value:* `EICAR-Test-File`

---

## 3. Diccionario de Datos: Patrones Heurísticos (RegEx)

Colecciones de patrones pre-compilados en memoria para los sistemas **GitHub Action** y **VSCode Extension** que inspeccionan los *buffers* de código y texto.

### Estructura: `SUSPICIOUS_PATTERNS`
*Arreglo de Objetos/Tuplas (Array of Dictionaries).*

| Campo | Tipo de Dato | Restricción | Descripción |
| :--- | :---: | :--- | :--- |
| `pattern` | RegEx Object | Patrón Válido (ECMAScript / Python `re`) | Expresión regular que detecta técnicas de inyección, base64, o droppers remotos (Ej: `Invoke-WebRequest.*iex`). |
| `threat` | String | Max 50 char | Nomenclatura del tipo de amenaza (Ej: `Trojan.PowerShell.Encoded`). |
| `description` | String | Variable | Descripción legible que será enviada al log de GitHub o al Output Panel de VSCode para la lectura humana. |

---

## 4. Diccionario de Datos: Variables de Entorno y Inputs

Estas configuraciones representan los únicos datos dinámicos que se inyectan en el sistema desde el exterior al momento del arranque.

### Estructura: `.env` (Telegram Bot)
| Variable | Tipo de Dato | Requerido | Descripción | Origen Esperado |
| :--- | :---: | :---: | :--- | :--- |
| `TELEGRAM_BOT_TOKEN` | String | SÍ | Token de autenticación HTTP proveído por la API de Telegram. | @BotFather (Bot API) |

### Estructura: `Inputs` (GitHub Action)
| Atributo (en `action.yml`) | Tipo de Dato | Requerido | Valor por Defecto | Descripción |
| :--- | :---: | :---: | :---: | :--- |
| `scan-path` | String | NO | `.` | Define la ruta relativa del repositorio donde el contenedor ejecutará el escaneo de seguridad en Python. |

---

## 5. Sets de Restricción

### Estructura: `HIGH_RISK_EXTENSIONS`
Un conjunto de datos tipo `Set<String>` utilizado en el motor para discernir cuándo una cabecera PE (Portable Executable - `0x4D 0x5A`) constituye una amenaza. 

**Tipo de Dato:** Set de Cadenas de Texto en minúsculas.
**Valores Esperados:** `['.exe', '.scr', '.pif', '.com', '.bat', '.cmd', '.vbs', '.vbe', '.ps1', ...]`
**Lógica de Intersección:** Si se halla un *Magic Number* de ejecutable en un archivo que NO pertenece a este Set de datos, se reporta como "Archivo disfrazado".

---

## Bibliografía

1. Paar, C., & Pelzl, J. (2010). *Understanding Cryptography: A Textbook for Students and Practitioners*. Springer.
2. EICAR. (2025). *European Institute for Computer Antivirus Research (EICAR) Test File*. Recuperado de https://www.eicar.org/
3. MDN Web Docs. (2025). *Regular Expressions*. Recuperado de https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
