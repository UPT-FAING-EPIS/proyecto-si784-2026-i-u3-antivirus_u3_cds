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

1. [Introducción](#1-introducción)
2. [Posicionamiento](#2-posicionamiento)
3. [Descripciones de los Interesados y Usuarios](#3-descripciones-de-los-interesados-y-usuarios)
4. [Descripción Global del Producto](#4-descripción-global-del-producto)
5. [Características del Producto](#5-características-del-producto)
6. [Restricciones y Requisitos No Funcionales](#6-restricciones-y-requisitos-no-funcionales)

<div style="page-break-after: always; visibility: hidden"></div>

## 1. Introducción

### Propósito
El propósito de este Documento de Visión es proporcionar una perspectiva integral de alto nivel sobre el producto **RustGuard - Antivirus System**. Define el marco conceptual, los objetivos estratégicos, las necesidades del mercado y las características principales del sistema, alineando las expectativas técnicas y de negocio para todos los stakeholders, desde el equipo de desarrollo hasta la junta directiva.

### Alcance
RustGuard es una solución de seguridad de punto final (Endpoint Security) diseñada para ejecutarse como una aplicación de escritorio. Proporciona protección en tiempo real, análisis heurísticos y basados en firmas, y gestión de cuarentena mediante una interfaz gráfica moderna (React/Electron). El producto abarca tanto el agente local instalado en los equipos de los usuarios como la infraestructura de soporte orquestada automáticamente en AWS mediante Terraform.

### Definiciones, Acrónimos y Abreviaturas
* **ClamAV:** Motor antivirus de código abierto utilizado para la detección de troyanos, virus y otros programas maliciosos.
* **Electron:** Framework que permite el desarrollo de aplicaciones de escritorio multiplataforma utilizando tecnologías web (HTML, CSS, JavaScript).
* **CI/CD:** Integración Continua y Despliegue Continuo, prácticas de DevOps para automatizar las pruebas y la entrega de software.
* **Quarantine (Cuarentena):** Entorno de aislamiento seguro donde los archivos sospechosos son almacenados cifrados para evitar la propagación de malware.
* **SARIF:** Static Analysis Results Interchange Format, formato estándar para la salida de herramientas de análisis estático.

## 2. Posicionamiento

### Oportunidad de Negocio / Operativa
El mercado actual de software antivirus está saturado de soluciones monolíticas, consumidoras intensivas de recursos y con interfaces de usuario obsoletas. Existe una oportunidad emergente para soluciones ligeras, transparentes y construidas con stacks tecnológicos modernos que faciliten la integración con flujos de trabajo de DevOps, al tiempo que ofrecen a los usuarios finales una experiencia fluida e intuitiva sin sacrificar las capacidades de detección de grado empresarial.

### Declaración del Problema
El problema de **la alta latencia, consumo excesivo de recursos e interfaces no intuitivas en el software antivirus tradicional** afecta a **los usuarios finales corporativos y administradores de sistemas**. El impacto de esto es **una degradación en el rendimiento de las estaciones de trabajo, desactivación deliberada de la seguridad por parte de los usuarios y un aumento en la vulnerabilidad ante ciberataques (ej. ransomware, troyanos)**. Una solución exitosa sería **implementar un sistema antivirus de arquitectura modular y ligera, con un frontend optimizado que delegue eficientemente los procesos pesados, garantizando seguridad continua y mínima intrusión operativa**.

### Declaración de Posicionamiento del Producto
Para **organizaciones y usuarios profesionales** que **requieren protección constante en sus equipos sin comprometer el rendimiento**, el **RustGuard - Antivirus System** es una **solución de seguridad de escritorio moderna** que **integra motores de escaneo probados con una interfaz de usuario web-native de alta velocidad**. A diferencia de **los antivirus heredados (legacy) y suites de seguridad monolíticas**, nuestro producto **aprovecha tecnologías como Electron y React junto a una estricta automatización DevSecOps para ofrecer escaneos rápidos, gestión ágil de cuarentena y reportes precisos con una huella de sistema optimizada**.

## 3. Descripciones de los Interesados (Stakeholders) y Usuarios

### Resumen de Stakeholders

| Nombre | Representa a | Rol en el proyecto |
| :--- | :--- | :--- |
| **Usuario Final / Empleado** | Fuerzas de trabajo operativas | Utiliza la aplicación pasiva y activamente para escanear sus archivos descargados y medios extraíbles. |
| **Ingeniero de DevOps / Infraestructura** | Equipo Técnico de TI | Despliega los pipelines de CI/CD, monitorea la infraestructura aprovisionada por Terraform y gestiona los releases. |
| **Arquitecto de Seguridad** | Departamento de Ciberseguridad | Define las políticas de escaneo, audita los reportes de Semgrep/Snyk y verifica la efectividad de las firmas de ClamAV. |
| **Product Owner** | Negocio y Dirección | Prioriza el backlog de características y asegura que la interfaz y funcionalidades cumplan los objetivos estratégicos. |

### Entorno de Usuario
Los usuarios finales interactuarán con el sistema primordialmente en sistemas operativos de escritorio (Windows, macOS, distribuciones Linux) durante sus actividades laborales cotidianas. El entorno requiere que la interfaz de RustGuard sea no intrusiva y opere mayormente en la bandeja del sistema (System Tray), notificando únicamente incidentes críticos. Por otro lado, los ingenieros de DevOps y seguridad interactuarán con repositorios (GitHub) e infraestructuras en la nube (AWS) a través de terminales y consolas web para la monitorización de la salud del ciclo de vida del software.

## 4. Descripción Global del Producto

### Perspectiva del Producto
RustGuard se concibe como un agente de *endpoint* autónomo pero altamente integrable. A nivel local, interactúa directamente con el sistema de archivos del sistema operativo anfitrión y procesos de bajo nivel para invocar a ClamAV. A nivel corporativo, su desarrollo y despliegue están íntimamente ligados a un ecosistema centralizado en GitHub Actions y aprovisionamiento en AWS, permitiendo en un futuro la integración de la telemetría del agente con plataformas SIEM (Security Information and Event Management) de terceros.

### Suposiciones y Dependencias
* **Dependencias de Software Base:** Se asume que los equipos de destino tienen instaladas las librerías base necesarias para la ejecución de binarios compilados de Electron y el entorno en tiempo de ejecución (Node.js/V8 integrado).
* **Motor Analítico:** El sistema depende de la disponibilidad y mantenimiento continuo de la base de datos de firmas de virus de ClamAV.
* **Conectividad:** Aunque el escaneo puede ser offline, la actualización de firmas de virus y el reporte de telemetría asumen conectividad periódica a Internet o a un servidor de red local seguro.
* **Permisos del Sistema:** El usuario de instalación o el software automatizado de distribución (MDM) deberá conceder los permisos de lectura/escritura a nivel raíz o unidad lógica para permitir escaneos profundos (Deep Scans).

## 5. Características del Producto (Features)

* **Protección en Tiempo Real (Real-Time Shield):** Monitoreo activo de directorios críticos y descargas entrantes, interceptando y escaneando operaciones de E/S de archivos.
* **Escaneo Bajo Demanda (On-Demand Scanning):** Capacidad del usuario para lanzar análisis rápidos (memoria y rutas comunes), completos (todo el disco) o personalizados (carpetas específicas).
* **Gestión Segura de Cuarentena (Vault):** Aislamiento automático de archivos infectados, cifrando el payload original e imposibilitando su ejecución hasta que el administrador lo apruebe o elimine de forma segura.
* **Actualización Automática de Firmas (Auto-Updater):** Proceso en segundo plano que sincroniza las bases de datos de definiciones de malware contra los repositorios de ClamAV sin requerir intervención manual.
* **Pipeline DevSecOps Integrado:** Generación de compilaciones automatizadas, pruebas BDD/E2E visuales (Playwright) y reportes de vulnerabilidades estáticas (Semgrep) antes de cada lanzamiento.
* **Interfaz de Usuario Web-Native:** Panel de control responsivo, moderno (TailwindCSS) y reactivo (React 19) que brinda métricas, historial de análisis y alertas en una experiencia fluida.

## 6. Restricciones y Requisitos No Funcionales (Atributos de Calidad)

* **Rendimiento:**
  * El servicio de escaneo en segundo plano no debe exceder el 5% del uso de la CPU durante el monitoreo inactivo.
  * Los análisis bajo demanda rápidos deben completarse en menos de 5 minutos en discos de estado sólido (SSD) modernos.
  * La interfaz de React debe arrancar e hidratarse en menos de 2 segundos desde la llamada del sistema.
* **Confiabilidad y Disponibilidad:**
  * El demonio principal de Electron debe incluir un mecanismo de *watchdog* que lo reinicie automáticamente ante un fallo crítico (crash).
  * Tolerancia a fallos en la actualización de firmas: Si el servidor principal de ClamAV falla, el sistema utilizará el último snapshot válido sin bloquear la funcionalidad offline.
* **Seguridad:**
  * Acceso de administración local protegido para evitar que software malicioso deshabilite la protección (Tamper Protection).
  * Todos los binarios liberados deben estar firmados digitalmente para evitar ataques de cadena de suministro.
  * Privacidad: No se enviará el contenido de los archivos escaneados a la nube; todo el análisis se realizará localmente (On-Premise en el *endpoint*).
* **Mantenibilidad y Extensibilidad:**
  * Adopción de una separación estricta de dominios, aislando el puente IPC (Inter-Process Communication) del núcleo de escaneo.
  * Cobertura de pruebas unitarias superior al 40% (monitoreada por Vitest) y pruebas de mutación continuas (Stryker) para garantizar código resiliente a cambios refactorizados.
