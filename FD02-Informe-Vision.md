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

Informe de Visión de Producto

Versión *2.0*

| CONTROL DE VERSIONES | | | | |
|:---:|:---|:---|:---|:---|
| Versión | Hecha por | Revisada por | Aprobada por | Fecha | Motivo |
| 1.0 | Sierra Ruiz, Iker Alberto | LLica Mamani, Jimmy Mijair | Sierra Ruiz, Iker Alberto | 02/06/2026 | Versión Inicial |
| 2.0 | Equipo RustGuard | Mag. Patrick Cuadros Quiroga | Equipo RustGuard | 04/07/2026 | Integración de la Suite Omnicanal |

<div style="page-break-after: always; visibility: hidden"></div>

# **INDICE GENERAL**

[1. Introducción](#1-introducción)

[2. Posicionamiento](#2-posicionamiento)

&nbsp;&nbsp;[2.1 Oportunidad de Negocio](#21-oportunidad-de-negocio)

&nbsp;&nbsp;[2.2 Declaración de Posicionamiento](#22-declaración-de-posicionamiento)

[3. Descripciones de los Interesados y Usuarios](#3-descripciones-de-los-interesados-y-usuarios)

[4. Capacidades del Producto](#4-capacidades-del-producto)

[5. Restricciones](#5-restricciones)

<div style="page-break-after: always; visibility: hidden"></div>

## 1. Introducción

El **Informe de Visión de Producto** define las bases conceptuales, el mercado objetivo y las metas estratégicas a gran escala de **RustGuard Antivirus**. Este documento sirve para alienar los esfuerzos del equipo de desarrollo de manera que cada subsistema (VSCode, GitHub Action, Telegram) comparta un objetivo común: la democratización y descentralización de la seguridad de software (DevSecOps y Seguridad al Usuario Final).

---

## 2. Posicionamiento

### 2.1 Oportunidad de Negocio
Con el auge del teletrabajo y los repositorios Open Source globales, el malware se ha camuflado eficientemente en herramientas cotidianas.
* Los atacantes comprometen pipelines inyectando `curl | bash` u ocultando payloads base64 en pull requests.
* El malware se transfiere fácilmente a través de grupos y chats corporativos en Telegram.
* Los desarrolladores pueden ejecutar código malicioso por error desde su editor local al revisar repositorios dudosos.
RustGuard aprovecha estas brechas para brindar una protección *Omnicanal* (en tránsito, en nube y en local), presentándose como una suite modular en lugar de un monolito pesado.

### 2.2 Declaración de Posicionamiento
Para organizaciones de software y usuarios modernos que requieren seguridad ágil y no intrusiva, **RustGuard Antivirus** es una suite modular de seguridad preventiva que provee escaneo heurístico y de firmas directamente en las plataformas de trabajo continuo (GitHub, VSCode, Telegram). A diferencia de los antivirus de disco tradicionales, RustGuard actúa proactivamente bajo un modelo *Shift-Left*, filtrando el malware *antes* de que llegue a compilarse o a dañar el ecosistema local, de forma ligera, con costo $0 y respeto absoluto por la privacidad (Zero-Trace).

---

## 3. Descripciones de los Interesados y Usuarios

Se identifican tres perfiles primarios basados en la arquitectura del sistema:

| Perfil | Rol en el Sistema | Necesidades Principales | Interacción Principal |
| :--- | :--- | :--- | :--- |
| **Administrador de DevOps** | Gestor de Repositorios | Evitar la fuga de secretos o inyecciones (Supply Chain Attacks) en las ramas `main`. | **GitHub Action**: Configuración de `scan-path` y revisión de Logs de CI/CD en GitHub. |
| **Programador / Desarrollador** | Escritura de Código Local | Chequeos locales rápidos sin salir de su flujo (IDE), evitando instalar suites pesadas. | **VS Code Extension**: Clic derecho en el explorador, leyendo Output Channels descriptivos. |
| **Usuario General / Analista** | Recepción de Archivos | Saber con inmediatez si un archivo recibido es confiable antes de ejecutarlo. | **Telegram Bot**: Uso del comando `/start` e interacción vía drag-and-drop de archivos en chat. |

---

## 4. Capacidades del Producto

Las ventajas competitivas y capacidades inter-sistemas que diferencian a RustGuard:

1. **Motores Híbridos Desacoplados:**
   - Heurística y RegEx Nativa (TS/Python) para detectar ofuscaciones de código, macros de office y fugas de credenciales.
   - Integración nativa con ClamAV (Node.js) para aprovechamiento de bases de datos de malware de escala mundial.
2. **Inspección de PE (Portable Executable):**
   - Capacidad en VS Code de buscar magic numbers (`MZ` / `0x4D 0x5A`) en binarios para frustrar intentos de camuflaje de extensiones.
3. **Flujos de Trabajo Bloqueantes (Fail-Fast):**
   - La acción de GitHub arroja explícitamente `exit(1)` en caso de amenaza, impidiendo un merge o deploy peligroso.
4. **Privacidad Automatizada (Zero-Trace):**
   - Todo archivo procesado en el servidor del bot de Telegram se borra obligatoriamente tras el dictamen, minimizando el riesgo legal.

---

## 5. Restricciones

- **Limites de Rendimiento en Sandbox:** El sistema en VS Code no procesará reglas RegEx de texto en archivos superiores a 10MB para prevenir consumos exorbitantes de memoria (Out Of Memory).
- **Dependencia de ClamAV:** El bot de Telegram requiere que el sistema servidor tenga el binario y bases de firmas correctamente actualizados (`freshclam`) localmente en sus carpetas `bin` relativas o variables del sistema.
- **Topes de API:** La manipulación de archivos grandes en Telegram está restringida por las normativas de la propia API de Telegram (generalmente archivos < 20MB para bots comunes).

---

## Bibliografía

1. McGraw, G. (2006). *Software Security: Building Security In*. Addison-Wesley Professional.
2. OWASP Foundation. (2025). *OWASP Top 10 Proactive Controls*. Recuperado de https://owasp.org/www-project-proactive-controls/
3. Microsoft. (2025). *Visual Studio Code Extension API*. Recuperado de https://code.visualstudio.com/api
