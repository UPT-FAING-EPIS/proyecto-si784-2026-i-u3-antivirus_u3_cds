# 🛡️ RustGuard Antivirus

> **Sistema avanzado de protección, gestión de amenazas y Self-Healing bajo principios de Clean Architecture.**

![Versión](https://img.shields.io/badge/version-v1.0%20Estable-brightgreen)
![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)
![Electron](https://img.shields.io/badge/Electron-Desktop-47848F?logo=electron&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white)
![Licencia](https://img.shields.io/badge/license-MIT-blue)

[IMAGEN: Screenshot principal del Dashboard de la aplicación]

RustGuard es una suite de seguridad de nueva generación diseñada para interceptar, neutralizar y auditar amenazas de malware en entornos locales. A través de una bóveda criptográfica asíncrona, asegura que tu estación de trabajo esté protegida contra ejecuciones no deseadas, ofreciendo a su vez capacidades de "Self-Healing" para restaurar archivos afectados por falsos positivos.

---

## ✨ Características Principales

* **🛡️ Escaneo Activo y Bajo Demanda:** Integración directa con el motor nativo de **ClamAV** para identificar firmas de malware con alta precisión.
* **🔒 Bóveda de Cuarentena (AES-256):** Los archivos infectados son desarmados y cifrados de inmediato, evitando su ejecución accidental por el sistema operativo o el usuario.
* **💊 Capacidades Self-Healing:** Restauración instantánea de los archivos bloqueados a su ubicación original si el administrador revierte el estado de cuarentena de un falso positivo.
* **⚡ Interfaz Reactiva y Moderna:** Dashboard construido con React 19 y TailwindCSS 4, ofreciendo retroalimentación visual en tiempo real sin congelar la ventana.
* **📊 Logs y Trazabilidad:** Base de datos **SQLite** embebida que mantiene un registro inmutable de todos los escaneos y eventos del sistema local.

---

## 🏗️ Arquitectura del Sistema

RustGuard está fundamentado estrictamente en **Clean Architecture**. Esto nos permite aislar el dominio de seguridad de los detalles del sistema operativo:

1. **Capa de Presentación (UI):** React 19 + Vite gestionan la experiencia gráfica del usuario, desvinculada completamente de la lógica de manipulación de archivos.
2. **Capa de Casos de Uso (Interactors):** Orquestación de escaneos, análisis de hashes y procesos de cifrado AES controlados desde la capa lógica.
3. **Capa de Infraestructura:** El proceso *Main* de **Electron** interactúa con el demonio nativo de ClamAV (`clamscan`) y el sistema local de archivos, comunicándose con la interfaz gráfica de forma segura mediante un canal **IPC** blindado (`contextBridge`).

[IMAGEN: Diagrama C4 / Clean Architecture del proyecto]

---

## 🛠️ Instalación y Despliegue Local

### Requisitos Previos
* **Node.js**: v20 o superior.
* **ClamAV**: Instalado a nivel de sistema (`sudo apt install clamav` en Linux, o a través del instalador oficial en Windows). El ejecutable `clamscan` debe estar disponible en la variable de entorno `PATH`.

### Pasos de Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone [LINK_AL_REPOSITORIO]
   cd proyecto-si784-2026-i-u3-antivirus_u3_cds
   ```

2. **Instalar dependencias del proyecto:**
   ```bash
   npm install
   ```

3. **Configurar el entorno:**
   Crea un archivo `.env` en la raíz basándote en el entorno de desarrollo, definiendo las rutas del `VAULT_PATH` y tu `AES_SECRET_KEY` si decides personalizar el cifrado.

4. **Ejecutar el entorno de desarrollo:**
   ```bash
   npm run start
   ```
   *Esto lanzará el empaquetador de Vite en modo HMR y abrirá la ventana nativa de Electron simultáneamente.*

5. **Empaquetar para Producción (Generación de Binarios):**
   ```bash
   npm run dist
   ```

---

## 💻 Uso Básico

Una vez que la aplicación ha iniciado correctamente:
1. Navega a la pestaña **Escáner** en el menú lateral.
2. Arrastra un archivo, o haz clic en el botón de examinar para seleccionar un directorio específico.
3. El sistema procesará los archivos por lotes. Si se encuentra una amenaza, la interfaz lanzará una **Alerta Crítica Roja** y el archivo será movido automáticamente a la pestaña de **Cuarentena**.

---

## 🧪 Testing y Calidad (QA)

El proyecto cuenta con una batería rigurosa de pruebas automatizadas:
* **Pruebas Unitarias (Vitest):** `npm run test:coverage`
* **Pruebas de Mutación (Stryker):** `npm run test:mutation`
* **Pruebas BDD y E2E (Playwright):** `npm run test:e2e`

---

## 🤝 Contribución

¡Las contribuciones de la comunidad Open Source son siempre bienvenidas! Para colaborar:
1. Haz un *Fork* del repositorio.
2. Crea una nueva rama para tu feature (`git checkout -b feature/NuevaCaracteristica`).
3. Asegúrate de pasar las reglas del linter (`eslint`) y mantener la cobertura de tests al 100%.
4. Abre un *Pull Request* describiendo a fondo tus cambios técnicos.

## 📄 Licencia

Este proyecto es de código abierto y está distribuido bajo la licencia **MIT**. Consulta el archivo `LICENSE` para más detalles.
