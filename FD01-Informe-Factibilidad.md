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

Informe de Factibilidad

Versión *2.0*

| CONTROL DE VERSIONES | | | | |
|:---:|:---|:---|:---|:---|
| Versión | Hecha por | Revisada por | Aprobada por | Fecha | Motivo |
| 1.0 | LLica Mamani, Jimmy Mijair | Sierra Ruiz, Iker Alberto | LLica Mamani, Jimmy Mijair | 02/06/2026 | Versión Inicial |
| 2.0 | Equipo RustGuard | Mag. Patrick Cuadros Quiroga | Equipo RustGuard | 04/07/2026 | Versión Extendida e Integrada |

<div style="page-break-after: always; visibility: hidden"></div>

# **INDICE GENERAL**

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Introducción y Alcance](#2-introducción-y-alcance)
3. [Factibilidad Técnica y Arquitectura](#3-factibilidad-técnica-y-arquitectura)
4. [Factibilidad Económica](#4-factibilidad-económica)
5. [Factibilidad Operativa y Legal](#5-factibilidad-operativa-y-legal)
6. [Gestión de Riesgos y Cronograma](#6-gestión-de-riesgos-y-cronograma)
7. [Conclusión y Dictamen Final](#7-conclusión-y-dictamen-final)

<div style="page-break-after: always; visibility: hidden"></div>

## 1. Resumen Ejecutivo

El presente informe evalúa la viabilidad técnica, económica y operativa del proyecto **RustGuard - Antivirus System**. RustGuard es una solución de seguridad moderna de escritorio concebida para brindar protección en tiempo real, análisis rigurosos bajo demanda y una gestión eficiente de la cuarentena de amenazas. Construido sobre un stack tecnológico de vanguardia que integra **React 19**, **Vite** y **Electron**, y orquestado mediante un sólido flujo de CI/CD, este sistema busca redefinir la experiencia del usuario final sin comprometer el rigor en la detección de malware a través del motor **ClamAV**. Tras un análisis exhaustivo, el veredicto preliminar determina que el proyecto cuenta con un alto grado de viabilidad, respaldado por la madurez de sus herramientas open source y una arquitectura escalable, aunque sujeto al control estricto del consumo de recursos locales inherentes al uso de tecnologías web en entornos de escritorio.

## 2. Introducción y Alcance

En la actualidad, las estaciones de trabajo y equipos de usuario final representan uno de los vectores más críticos en los ciberataques. Las soluciones antivirus tradicionales suelen pecar de interfaces poco intuitivas, alto consumo de recursos y falta de adaptabilidad a flujos de trabajo modernos. **RustGuard** nace para mitigar esta brecha, proporcionando una solución robusta y visualmente atractiva capaz de escanear y poner en cuarentena archivos sospechosos en entornos locales, aprovechando motores de detección probados.

El alcance del sistema incluye la interfaz de usuario (desarrollada con React y TailwindCSS), el backend de integración local (mediante Electron) para interactuar con los procesos del sistema operativo, el aprovisionamiento de infraestructura remota de soporte vía Terraform en AWS, y la completa automatización de pruebas y despliegue (GitHub Actions). Quedan fuera del alcance inicial (Out of Scope) el desarrollo de un motor de análisis heurístico propietario, delegando esta función a ClamAV, así como la implementación de firewalls a nivel de red o soluciones EDR (Endpoint Detection and Response) corporativas centralizadas.

## 3. Factibilidad Técnica y Arquitectura

### Evaluación del Stack Tecnológico
La elección del stack se fundamenta en la necesidad de iterar rápidamente y mantener una interfaz de usuario altamente interactiva. 
* **React 19, Vite y TailwindCSS 4:** Garantizan el renderizado óptimo y una experiencia de usuario fluida, disminuyendo el tiempo de desarrollo del frontend.
* **Electron:** Permite empaquetar aplicaciones web como binarios de escritorio multiplataforma, otorgando acceso a la API del sistema operativo (sistemas de archivos, procesos), crucial para un antivirus.
* **ClamAV:** Motor de código abierto consolidado para la detección de troyanos, virus y malware, que actúa como el núcleo analítico de la solución.
* **Terraform y GitHub Actions:** Aseguran una infraestructura inmutable y un ciclo de vida de desarrollo seguro, integrando análisis de vulnerabilidades automatizado con **Semgrep** y **Snyk**.

### Arquitectura del Sistema
El sistema emplea un patrón de diseño basado en componentes acoplados a una arquitectura de comunicación inter-procesos (IPC). El Frontend (React) actúa únicamente como capa de presentación, comunicándose a través de puentes IPC seguros con el Proceso Principal de Electron (Backend). Este último es el encargado de orquestar la ejecución de comandos del sistema (`clamscan`), manejar el sistema de archivos para la cuarentena y asegurar que la interfaz permanezca no bloqueante durante los análisis prolongados. La arquitectura promueve la separación de responsabilidades, asegurando que las vulnerabilidades del frontend no comprometan los privilegios del backend.

### Requisitos No Funcionales
* **Rendimiento:** El uso de Electron demanda una gestión eficiente de la memoria RAM. Se implementarán técnicas de paginación y delegación asíncrona de procesos pesados para no afectar el rendimiento del equipo host.
* **Seguridad de la Información:** Se aplica el principio de menor privilegio en los puentes IPC. El código es auditado continuamente mediante Semgrep y Snyk.
* **Tolerancia a Fallos:** Ante caídas del motor de ClamAV, el proceso principal de Electron debe reiniciar el demonio automáticamente sin interrumpir la interfaz gráfica.
* **Escalabilidad:** El despliegue de infraestructura en AWS mediante Terraform permite escalar fácilmente cualquier servicio auxiliar requerido en el futuro, como servidores de actualización de firmas o telemetría.

## 4. Factibilidad Económica

La adopción de tecnologías mayoritariamente Open Source reduce drásticamente las barreras de entrada financieras, situando la viabilidad económica en un panorama altamente favorable.

| Categoría | Concepto | Costo Estimado (USD) |
| :--- | :--- | :--- |
| **CapEx (Hardware/Software)** | Equipos de desarrollo, licencias de IDEs y dependencias propietarias puntuales. | $ 2,500.00 |
| **CapEx (Desarrollo Inicial)** | Horas-hombre invertidas en diseño de arquitectura, desarrollo y configuración de CI/CD. | $ 15,000.00 |
| **OpEx (Mantenimiento)** | Soporte técnico, actualizaciones, monitorización y horas-hombre operativas mensuales. | $ 1,500.00 / mes |
| **OpEx (Infraestructura)** | Recursos en AWS (Terraform), runners de GitHub Actions, bases de datos accesorias. | $ 300.00 / mes |
| **Retorno de Inversión (ROI)** | Beneficios derivados de la automatización, reducción de incidentes de seguridad y posible comercialización de licencias premium. | ROI estimado > 120% al 2do año |

*Nota: Los costos operativos son significativamente menores gracias a las pruebas automatizadas (Playwright, Vitest) y despliegues automáticos que reducen el tiempo de administración manual.*

## 5. Factibilidad Operativa y Legal

El impacto en el flujo de trabajo de los usuarios será positivo, ya que la aplicación se ejecuta en segundo plano y ofrece reportes intuitivos sobre el estado de la máquina, requiriendo mínima intervención humana. Desde la perspectiva de los administradores y desarrolladores, el ciclo de vida del software es totalmente predecible gracias a los múltiples flujos de CI/CD (pruebas de mutación con Stryker, análisis BDD), lo que reduce la fricción en el paso a producción. 

La mantenibilidad está garantizada por una extensa suite de pruebas (Unitarias, Mutación y E2E). En cuanto al aspecto legal, el proyecto utiliza herramientas Open Source bajo licencias permisivas (MIT/Apache 2.0). Sin embargo, al depender de ClamAV, se debe cumplir estrictamente con los términos de la GPL (General Public License) respecto a la distribución de binarios, asegurando que RustGuard no modifique el núcleo protegido sin liberar el código resultante. Además, se deberá incluir un EULA (End User License Agreement) informando sobre la recopilación de telemetría anonimizada y respetando normativas de privacidad como la Ley de Protección de Datos Personales.

## 6. Gestión de Riesgos y Cronograma

### Matriz de Riesgos

| Riesgo | Probabilidad | Impacto | Estrategia de Mitigación |
| :--- | :--- | :--- | :--- |
| **Sobrecarga de recursos por Electron** | Alta | Medio | Perfilado de memoria constante; evitar re-renderizados innecesarios en React; optimizar el uso de hilos subyacentes. |
| **Falsos positivos de ClamAV** | Media | Medio | Permitir al usuario crear excepciones granulares; mantener las bases de firmas actualizadas. |
| **Vulnerabilidades en dependencias (NPM)** | Alta | Alto | Ejecución estricta y automática de Snyk en cada *Pull Request* para bloquear código vulnerable. |
| **Complejidad de despliegue en múltiples SO** | Media | Alto | Uso extensivo de GitHub Actions con matrices de pruebas en Windows, Linux y macOS antes de liberar binarios. |

### Cronograma de Hitos
1. **Mes 1:** Diseño de arquitectura, configuración de repositorio, pipelines CI/CD y despliegue base de Terraform.
2. **Mes 2:** Desarrollo de la interfaz gráfica en React 19 e integración del puente IPC con Electron.
3. **Mes 3:** Integración con motor ClamAV, gestión de cuarentena y reportes de escaneo.
4. **Mes 4:** Implementación de pruebas BDD/E2E con Playwright, auditoría de seguridad integral y lanzamiento Release automatizado.

## 7. Conclusión y Dictamen Final

Tras el análisis integral de las dimensiones técnica, económica y operativa, se dictamina que el proyecto **RustGuard - Antivirus System** es **ALTAMENTE FACTIBLE** y **DEBE PROCEDER**. 

La arquitectura seleccionada equilibra inteligentemente la agilidad en el desarrollo de la interfaz a través de tecnologías web modernas y la solidez requerida para interactuar con procesos nativos del sistema mediante Electron y ClamAV. Económicamente, el modelo presenta un riesgo inicial muy bajo debido al uso extensivo de herramientas de código abierto y a la automatización de la infraestructura. La única salvedad técnica crítica es el monitoreo exhaustivo de los recursos de hardware consumidos por la aplicación de escritorio; sin embargo, con las estrategias de mitigación implementadas y el riguroso enfoque de DevSecOps con testing exhaustivo, este riesgo está bajo un estricto control. El proyecto representa una inversión tecnológica segura y robusta con una propuesta de valor imprescindible para la protección de endpoints.
