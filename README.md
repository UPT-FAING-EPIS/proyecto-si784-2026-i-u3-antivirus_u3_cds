# 🛡️ RustGuard - Antivirus System

RustGuard es un sistema antivirus moderno desarrollado con **React**, **Vite** y **Electron**, diseñado para ofrecer protección en tiempo real, escaneos rápidos y completos, y gestión de cuarentena de amenazas. 

Este proyecto se ha implementado con un flujo avanzado de CI/CD, automatización de infraestructura e integraciones de calidad de código y seguridad para garantizar la mayor confiabilidad y control.

---

## 🚀 Arquitectura y Tecnologías
- **Frontend:** React 19, TailwindCSS 4, Vite
- **Desktop Backend:** Electron
- **Testing:** Vitest, Testing Library, Playwright (BDD & E2E)
- **Infraestructura Automática:** Terraform y GitHub Actions
- **Seguridad y Análisis Estático:** Semgrep y Snyk

---

## ⚙️ Requisitos Previos

Antes de instalar y ejecutar RustGuard, asegúrate de cumplir con los siguientes requisitos a nivel de sistema operativo:

- **Node.js (v20 o superior)**: Entorno de ejecución requerido.
- **ClamAV**: Es necesario tener instalado el motor antivirus y que el comando `clamscan` esté disponible en tu variable de entorno `PATH`.
- **Terraform (Opcional)**: Requerido solo si deseas desplegar la infraestructura en AWS.

> 📄 *Puedes consultar más detalles sobre la instalación en el archivo [requirements.txt](./requirements.txt).*

---

## 🛠️ Instalación y Uso Local

1. **Instalar las dependencias del proyecto:**
   ```bash
   npm install
   ```

2. **Ejecutar en entorno de desarrollo (React + Electron):**
   ```bash
   npm run start
   ```

3. **Empaquetar la aplicación para producción (Genera ejecutables):**
   ```bash
   npm run dist
   ```

---

## 🧪 Pruebas (Testing)

**Pruebas Unitarias y Reporte de Cobertura:**  
Asegura que el código mantenga la cobertura esperada (>40%).
```bash
npm run test:coverage
```

**Pruebas de Mutación:**  
Evalúa la calidad de los tests unitarios inyectando mutaciones con Stryker.
```bash
npm run test:mutation
```

**Pruebas BDD (Behavior-Driven Development) y E2E:**  
Genera los pasos de BDD y los ejecuta grabando videos para validación visual mediante Playwright.
```bash
npm run test:e2e
```

---

## 🤖 Flujos de CI/CD Automatizados (GitHub Actions)

Este proyecto cuenta con múltiples *pipelines* implementados en `.github/workflows/`:

1. **Infraestructura como Código (`terraform.yml`)**: Despliega y valida los recursos necesarios en AWS.
2. **Análisis Estático (`static-analysis.yml`)**: Ejecuta **Semgrep** (exportando el reporte SARIF al dashboard de GitHub) y **Snyk** para auditar vulnerabilidades en dependencias.
3. **Cobertura de Código (`coverage.yml`)**: Ejecuta las pruebas unitarias usando `vitest` y publica un reporte HTML de cobertura a GitHub Pages.
4. **Pruebas de Mutación (`mutation.yml`)**: Utiliza `Stryker` para validar la robustez de los tests unitarios y publica el reporte a GitHub Pages.
5. **Pruebas E2E y BDD (`e2e.yml`)**: Ejecuta **Playwright** para pruebas de interfaz (incluyendo captura de videos) y valida los escenarios Gherkin generados mediante `playwright-bdd`.
6. **Release Automatizado (`release.yml`)**: Empaqueta los binarios de Windows (.exe NSIS y formato Portable) mediante `electron-builder` en base a nuevas etiquetas (tags, ej. `v1.0.0`).

---

## 📂 Estructura del Proyecto

- `src/`: Código fuente principal de la aplicación React.
- `src/features/`: Casos de prueba BDD escritos en Gherkin (`.feature`) y sus _step definitions_.
- `src/test/`: Pruebas unitarias de todos los componentes de la interfaz.
- `electron/`: Archivo de entrada y lógica del proceso principal de Electron (backend).
- `terraform/`: Definición de infraestructura en HCL para AWS.
- `.github/workflows/`: Definiciones de las GitHub Actions para integración y despliegue continuo.

---

## 📊 Reportes Generados Localmente

- **Cobertura de Vitest**: `coverage/`
- **Mutación de Stryker**: `reports/mutation/`
- **Playwright BDD & E2E**: `playwright-report/`

---

## 📜 Licencia
Propiedad del Proyecto SI784.
