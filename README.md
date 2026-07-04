<div align="center">
  <img src="https://img.shields.io/badge/RustGuard-Ecosystem-blue?style=for-the-badge" alt="RustGuard Logo">
  <h1>🛡️ RustGuard Antivirus Suite</h1>
  <p>
    <strong>El Ecosistema Omnicanal de Seguridad Proactiva y Análisis de Malware (Zero-Trace) bajo principios de Clean Architecture.</strong>
  </p>
  
  ![Versión](https://img.shields.io/badge/version-v1.0%20Estable-brightgreen)
  ![TypeScript](https://img.shields.io/badge/TypeScript-VS%20Code-3178C6?logo=typescript&logoColor=white)
  ![Python](https://img.shields.io/badge/Python-Action-3776AB?logo=python&logoColor=white)
  ![Node.js](https://img.shields.io/badge/Node.js-Bot-339933?logo=node.js&logoColor=white)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

[IMAGEN: Banner o diagrama general arquitectónico del ecosistema RustGuard]

RustGuard no es un antivirus tradicional; es una suite de seguridad distribuida diseñada para integrarse nativamente en los entornos diarios de trabajo de un desarrollador. Compuesta por tres módulos independientes, traslada la seguridad al editor de código, a los flujos de CI/CD, y a la mensajería instantánea, garantizando que el malware se intercepte mucho antes de llegar a entornos de producción.

---

## ✨ Características Principales

* **🛡️ Ecosistema Distribuido:** Protección simultánea en tres frentes: Editor Local (VS Code), Servidores (GitHub Actions) y Comunicaciones (Telegram).
* **🔍 Análisis Heurístico Multicapa:** Utiliza expresiones regulares (RegEx), validación de cabeceras de binarios (PE headers) y firmas criptográficas (SHA-256).
* **🧹 Filosofía Zero-Trace:** En la integración del bot, los archivos descargados son destruidos instantáneamente del disco del servidor tras su análisis, evitando la contaminación.
* **🧠 Integración Nativa (ClamAV):** Integración profunda con el motor Open Source de ClamAV para la validación forense de archivos dudosos o encriptados.
* **⚡ Patrón Fail-Fast:** En los flujos de Integración Continua (CI), el sistema detiene inmediatamente los pipelines si detecta inyecciones de código malicioso o credenciales expuestas (DevSecOps).

---

## 🏗️ Arquitectura del Sistema

Todo el ecosistema RustGuard ha sido diseñado siguiendo estrictamente los principios de **Clean Architecture**, asegurando un alto nivel de testabilidad, desacoplamiento y mantenimiento profesional a nivel de ingeniería:

1. **RustGuard Local Scanner (VS Code Extension):** Escrito en *TypeScript*. Abstrae la API del editor gráfico de la lógica de evaluación de firmas estáticas.
2. **RustGuard Sandbox (Telegram Bot):** Desarrollado en *Node.js* puro con Inyección de Dependencias, separando los Webhooks (Infraestructura) del Motor de Análisis (Casos de Uso).
3. **RustGuard DevSecOps (GitHub Action):** Implementado en *Python 3.10*. Modula las políticas de seguridad y reglas YARA para que actúen sobre los runners de forma agnóstica.

---

## 🛠️ Instalación y Despliegue Local

Cada módulo tiene su propio ciclo de vida e instrucciones precisas en su directorio respectivo. A continuación, se muestra el flujo general de despliegue para testear la suite completa:

### Requisitos Previos Generales
* Node.js v18+ y npm/yarn.
* Python 3.10+ y `pip`.
* Motor ClamAV (`clamscan`) instalado y expuesto en el `PATH` de tu sistema operativo.

### Instalación por Módulo

1. **Clonar el repositorio:**
   ```bash
   git clone [LINK_AL_REPOSITORIO]
   cd proyecto-si784-2026-i-u3-antivirus_u3_cds
   ```

2. **Desplegar Bot de Telegram (`RustGuard-BotTelegram/`):**
   ```bash
   cd RustGuard-BotTelegram
   npm install
   # Recuerda copiar .env.example a .env e insertar tu token de Telegram
   npm run start
   ```

3. **Compilar Extensión de VS Code (`RustGuard-VSCode/`):**
   ```bash
   cd RustGuard-VSCode
   npm install
   # Empaquetar y generar el archivo .vsix para instalar en tu IDE local
   npm run package
   ```

4. **Probar el Action Localmente (`RustGuard-Action/`):**
   ```bash
   cd RustGuard-Action
   pip install -r requirements.txt
   # Ejecutar el scanner de prueba manual
   python scanner.py ./demo_test_repo
   ```

---

## 💻 Uso Básico

* **Telegram:** Abre un chat con tu bot (`@TuRustGuardBot`), sube cualquier archivo (pdf, zip, exe) y el bot lo escaneará en un entorno seguro, emitiendo un reporte al instante.
* **VS Code:** Haz clic derecho sobre cualquier archivo sospechoso en tu explorador lateral y selecciona la opción *RustGuard: Scan File*.
* **GitHub Actions:** Integra nuestro script `action.yml` a tu pipeline `.github/workflows/ci.yml` para bloquear automáticamente cualquier *Pull Request* que contenga payloads ofuscados o credenciales en texto plano.

---

## 🤝 Contribución

Somos una comunidad activa que fomenta las buenas prácticas. Para contribuir a cualquiera de los tres módulos de la suite:

1. Haz un *Fork* del repositorio.
2. Crea una rama para tu feature o corrección (`git checkout -b feature/MejoraHeuristica`).
3. Sube tus cambios asegurando pasar las pruebas unitarias y de mutación (ej. Stryker) de cada sub-proyecto (`git commit -m 'feat: añade nueva regla RegEx'`).
4. Haz *Push* y abre un *Pull Request* explicando el valor técnico para que podamos revisar el código.

## 📄 Licencia

Este ecosistema está protegido y distribuido libremente bajo la licencia **MIT**. Para más detalles sobre su distribución, por favor consulta el archivo `LICENSE` incluido en la raíz de este repositorio.
