# 🛡️ RustGuard DevSecOps Antivirus

[![GitHub Action Status](https://img.shields.io/badge/GitHub%20Actions-Active-success?logo=github)](https://github.com/features/actions)
[![Security Rating](https://img.shields.io/badge/Security-A%2B-brightgreen)](https://github.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**RustGuard** es un escáner de seguridad diseñado específicamente para ejecutarse como una [GitHub Action](https://github.com/features/actions), que audita los repositorios en tiempo real en busca de archivos, firmas y patrones de código maliciosos. Previene que el código peligroso o credenciales expuestas se filtren en la base de código.

**Creado por:** Iker Sierra y Jimmy Llica.

---

## 🚀 Características

RustGuard analiza profundamente el código fuente e identifica múltiples categorías de amenazas:

*   **Fuga de Credenciales (Secret Scanning):** Detecta llaves privadas (RSA/DSA/EC/OPENSSH), tokens de acceso de AWS, contraseñas quemadas (hardcodeadas), tokens de GitHub (PATs) y claves API de plataformas como OpenAI.
*   **Ejecución de Payloads Remotos:** Identifica patrones de descarga y ejecución en cadena, como `curl ... | bash`, `wget ... > tmp && chmod +x` y ejecuciones silenciosas mediante PowerShell (`Invoke-WebRequest | Invoke-Expression`).
*   **Ofuscación Avanzada:** Descubre intentos de ocultar código malicioso en Python, PHP y JavaScript mediante el uso abusivo de técnicas como `eval(base64_decode(...))` o `exec()`.
*   **Detección de Binarios y Extensiones Peligrosas:** Bloquea archivos ejecutables encubiertos, scripts peligrosos (`.exe`, `.scr`, `.pif`, `.vbs`, etc.) y archivos con doble extensión sospechosa (ej. `documento.pdf.exe`).
*   **Archivos de Prueba Estandarizados:** Implementa la detección del archivo de prueba antivirus estándar EICAR.

## 🛠️ Uso

Integrar RustGuard en tu pipeline de CI/CD es sumamente sencillo. Agrega el siguiente paso a tu flujo de trabajo de GitHub Actions (`.github/workflows/main.yml`):

```yaml
name: DevSecOps Security Scan
on: [push, pull_request]

jobs:
  rustguard_scan:
    runs-on: ubuntu-latest
    name: Escaneo de Seguridad con RustGuard
    steps:
      - name: Descargar el código fuente
        uses: actions/checkout@v3

      - name: Ejecutar RustGuard Antivirus
        uses: IkerASierraR/action_rustguard@main
        with:
          # Opcional: Ruta relativa al directorio a escanear (por defecto: '.')
          scan-path: '.'
```

## ⚙️ Configuración (Inputs)

| Input | Requerido | Por defecto | Descripción |
| :--- | :---: | :---: | :--- |
| `scan-path` | ❌ No | `.` (Raíz) | Ruta relativa al directorio específico que deseas escanear dentro del repositorio. |

## 🔎 ¿Cómo funciona?

Cuando la acción de GitHub es disparada:

1.  **Montaje en Contenedor:** RustGuard se levanta en un contenedor ligero basado en `python:3.10-slim`.
2.  **Análisis Heurístico y de Firmas:** El núcleo del escáner (`scanner.py`) inspecciona cada archivo dentro del `scan-path` ignorando carpetas de caché predecibles (`.git`, `node_modules`, etc.).
3.  **Resultado Inmediato:** Si se detecta alguna amenaza, RustGuard interrumpirá el flujo con un código de error (`exit(1)`), bloqueando el pipeline y listando detalladamente qué archivos y qué tipo de amenazas fueron encontradas directamente en los logs de tu GitHub Action.

## 👥 Autores

Desarrollado y mantenido con ❤️ por:
*   **Iker Sierra**
*   **Jimmy Llica**

---

> *"Asegurando el código, una Action a la vez."*
