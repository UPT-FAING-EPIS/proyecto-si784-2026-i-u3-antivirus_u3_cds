<div align="center">
  <h1>🛡️ RustGuard Antivirus Suite</h1>
  <p><em>El Ecosistema Omnicanal de Seguridad Proactiva y Análisis de Malware (Zero-Trace)</em></p>
  
  <!-- Badges -->
  [![Versión](https://img.shields.io/badge/version-v1.0%20Estable-blue.svg)]([LINK])
  [![Tecnologías](https://img.shields.io/badge/tech-Python%20%7C%20Node.js%20%7C%20TypeScript-brightgreen.svg)]([LINK])
  [![Estado](https://img.shields.io/badge/status-En%20Desarrollo-success.svg)]([LINK])
  [![Arquitectura](https://img.shields.io/badge/architecture-Clean%20Architecture-orange.svg)]([LINK])
  [![Licencia](https://img.shields.io/badge/License-MIT-yellow.svg)]([LINK])

  [IMAGEN: Banner principal o Logo de RustGuard]
</div>

---

## 📌 Características Principales

RustGuard traslada la seguridad directamente a los entornos donde operas diariamente, aplicando un modelo de *Shift-Left Security*:

*   **Auditoría Pasiva en pipelines CI/CD:** Escaneo automatizado en eventos `push` o `pull_request` para detectar fuga de credenciales (AWS, JWT) y código ofuscado.
*   **Sandbox Zero-Trace:** Análisis de archivos en tiempo real vía Telegram utilizando *ClamAV*, garantizando que ningún archivo sospechoso persista en memoria.
*   **Inspección Autónoma en IDE:** Antivirus ligero integrado en VS Code que inspecciona cabeceras binarias ejecutables (PE) y valida firmas SHA-256.
*   **Alertas Tempranas (Fail-Fast):** Capacidad para bloquear Pull Requests de forma instantánea ante la más mínima vulnerabilidad.

## 🏛️ Arquitectura

RustGuard está diseñado siguiendo los principios de **Clean Architecture**, asegurando un alto nivel de desacoplamiento, mantenibilidad y escalabilidad. 

La solución separa estrictamente las capas de presentación (los clientes: GitHub Action, Telegram Bot y VS Code) de la lógica de dominio (Motores de Análisis Heurístico y Firmas). Esto permite que el ecosistema crezca de forma modular y que cada componente pueda ser testeado de manera independiente.

[IMAGEN: Diagrama de la Arquitectura del Sistema / Diagrama de Flujo]

## 🛠️ Tecnologías Utilizadas

*   **Motor DevSecOps:** Python 3.10, Docker.
*   **Sandbox Messaging:** Node.js, API de Telegram (Telegraf), ClamAV.
*   **Local IDE Scanner:** TypeScript, VS Code API.

## 🚀 Instalación y Despliegue

La suite está compuesta por submódulos independientes. A continuación, un ejemplo para desplegar el entorno local (asumiendo que tienes instalado Docker, Python y Node.js):

```bash
# 1. Clonar el ecosistema
git clone https://github.com/UPT-FAING-EPIS/proyecto-si784-2026-i-u3-antivirus_u3_cds.git
cd proyecto-si784-2026-i-u3-antivirus_u3_cds

# 2. Desplegar el Bot Sandbox con Docker
cd RustGuard-Sandbox
docker build -t rustguard-sandbox .
docker run -d --name rustguard-bot -e TELEGRAM_TOKEN="TU_TOKEN_AQUI" rustguard-sandbox

# 3. Preparar la extensión de VS Code
cd ../RustGuard-IDE
npm install
```

## 💻 Uso Básico

Dependiendo del módulo que desees utilizar:

*   **VS Code Scanner:** En el explorador de archivos del IDE, haz clic derecho sobre cualquier archivo sospechoso y selecciona *"Analizar con RustGuard"*.
*   **Telegram Bot:** Envía un documento directamente al chat del bot. El motor lo procesará en su entorno aislado y emitirá un reporte automático antes de borrarlo definitivamente.

## 🤝 Contribución

¡Las contribuciones hacen que la comunidad Open Source sea un lugar increíble para aprender, inspirar y crear! Si deseas contribuir:

1. Haz un Fork del proyecto.
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`).
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`).
4. Haz Push a la rama (`git push origin feature/AmazingFeature`).
5. Abre un Pull Request.

Asegúrate de revisar nuestras [Pautas de Contribución]([LINK_A_CONTRIBUTING.md]) antes de empezar.

## 📄 Licencia

Iker Alberto Sierra Ruiz
Jimmy Llica Mamani
