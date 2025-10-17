# FossFLOW - Herramienta de Diagramas Isométricos <img width="30" height="30" alt="fossflow" src="https://github.com/user-attachments/assets/56d78887-601c-4336-ab87-76f8ee4cde96" />

<p align="center">
 <a href="../README.md">English</a> | <a href="README.cn.md">简体中文</a> | <a href="README.es.md">Español</a> | <a href="README.pt.md">Português</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.bn.md">বাংলা</a> | <a href="README.ru.md">Русский</a>
</p>

<b>¡Hola!</b> Soy Stan, si has usado FossFLOW y te ha ayudado, <b>¡realmente agradecería si pudieras donar algo pequeño :)</b> Trabajo a tiempo completo, y encontrar tiempo para trabajar en este proyecto ya es bastante desafiante.
Si he implementado una función para ti o arreglado un error, sería genial si pudieras :) si no, no hay problema, ¡este software siempre será gratuito!


<b>¡También!</b> Si aún no lo has hecho, por favor echa un vistazo a la biblioteca subyacente en la que esto está construido por <a href="https://github.com/markmanx/isoflow">@markmanx</a> Realmente estoy sobre los hombros de un gigante aquí 🫡

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/P5P61KBXA3)

<img width="30" height="30" alt="image" src="https://github.com/user-attachments/assets/dc6ec9ca-48d7-4047-94cf-5c4f7ed63b84" /> <b> https://buymeacoffee.com/stan.smith </b>


Gracias,

-Stan

## Pruébalo en línea

Ve a  <b> --> https://stan-smith.github.io/FossFLOW/ <-- </b>


------------------------------------------------------------------------------------------------------------------------------
FossFLOW es una potente aplicación web progresiva (PWA) de código abierto para crear hermosos diagramas isométricos. Construido con React y la biblioteca <a href="https://github.com/markmanx/isoflow">Isoflow</a> (Ahora bifurcada y publicada en NPM como fossflow), se ejecuta completamente en tu navegador con soporte sin conexión.

![Screenshot_20250630_160954](https://github.com/user-attachments/assets/e7f254ad-625f-4b8a-8efc-5293b5be9d55)

- **📝 [FOSSFLOW_TODO.md](https://github.com/stan-smith/FossFLOW/blob/master/FOSSFLOW_TODO.md)** - Problemas actuales y hoja de ruta con mapeos de código base, la mayoría de las quejas son con la biblioteca isoflow en sí.
- **🤝 [CONTRIBUTORS.md](https://github.com/stan-smith/FossFLOW/blob/master/CONTRIBUTORS.md)** - Cómo contribuir al proyecto.

## Actualizaciones Recientes (Octubre 2025)

### Soporte Multilingüe
- **8 Idiomas Soportados** - Traducción completa de la interfaz en inglés, chino (simplificado), español, portugués (brasileño), francés, hindi, bengalí y ruso
- **Selector de Idioma** - Selector de idioma fácil de usar en el encabezado de la aplicación
- **Traducción Completa** - Todos los menús, diálogos, configuraciones, información sobre herramientas y contenido de ayuda traducidos
- **Consciente de la Localización** - Detecta y recuerda automáticamente tu preferencia de idioma

### Herramienta de Conector Mejorada
- **Creación Basada en Clics** - Nuevo modo predeterminado: haz clic en el primer nodo, luego en el segundo nodo para conectar
- **Opción de Modo de Arrastre** - El arrastre y colocación original sigue disponible a través de configuración
- **Selección de Modo** - Cambia entre los modos de clic y arrastre en Configuración → pestaña Conectores
- **Mejor Fiabilidad** - El modo de clic proporciona una creación de conexión más predecible

### Importación de Iconos Personalizados
- **Importa Tus Propios Iconos** - Sube iconos personalizados (PNG, JPG, SVG) para usar en tus diagramas
- **Escalado Automático** - Los iconos se escalan automáticamente a tamaños consistentes para una apariencia profesional
- **Alternar Isométrico/Plano** - Elige si los iconos importados aparecen como 3D isométrico o 2D plano
- **Persistencia Inteligente** - Los iconos personalizados se guardan con los diagramas y funcionan en todos los métodos de almacenamiento
- **Recursos de Iconos** - Encuentra iconos gratuitos en:
  - [Iconify Icon Sets](https://icon-sets.iconify.design/) - Miles de iconos SVG gratuitos
  - [Flaticon Isometric Icons](https://www.flaticon.com/free-icons/isometric) - Paquetes de iconos isométricos de alta calidad

### Soporte de Almacenamiento en Servidor
- **Almacenamiento Persistente** - Diagramas guardados en el sistema de archivos del servidor, persisten entre sesiones del navegador
- **Acceso Multi-dispositivo** - Accede a tus diagramas desde cualquier dispositivo cuando uses implementación Docker
- **Detección Automática** - La interfaz de usuario muestra automáticamente el almacenamiento del servidor cuando está disponible
- **Protección contra Sobrescritura** - Diálogo de confirmación al guardar con nombres duplicados
- **Integración Docker** - Almacenamiento en servidor habilitado por defecto en implementaciones Docker

### Funciones de Interacción Mejoradas
- **Teclas de Acceso Rápido Configurables** - Tres perfiles (QWERTY, SMNRCT, Ninguno) para selección de herramientas con indicadores visuales
- **Controles de Panorámica Avanzados** - Múltiples métodos de panorámica incluyendo arrastre de área vacía, clic medio/derecho, teclas modificadoras (Ctrl/Alt) y navegación por teclado (Flechas/WASD/IJKL)
- **Alternar Flechas de Conector** - Opción para mostrar/ocultar flechas en conectores individuales
- **Selección de Herramienta Persistente** - La herramienta de conector permanece activa después de crear conexiones
- **Diálogo de Configuración** - Configuración centralizada para teclas de acceso rápido y controles de panorámica

### Mejoras de Docker y CI/CD
- **Compilaciones Docker Automatizadas** - Flujo de trabajo de GitHub Actions para implementación automática de Docker Hub en commits
- **Soporte Multi-arquitectura** - Imágenes Docker para `linux/amd64` y `linux/arm64`
- **Imágenes Pre-construidas** - Disponibles en `stnsmith/fossflow:latest`

### Arquitectura Monorepo
- **Repositorio único** para biblioteca y aplicación
- **NPM Workspaces** para gestión de dependencias optimizada
- **Proceso de compilación unificado** con `npm run build` en la raíz

### Correcciones de Interfaz
- Se corrigió el problema de visualización de iconos de la barra de herramientas del editor Quill
- Se resolvieron advertencias de clave React en menús contextuales
- Se mejoró el estilo del editor de markdown

## Características

- 🎨 **Diagramación Isométrica** - Crea impresionantes diagramas técnicos en estilo 3D
- 💾 **Autoguardado** - Tu trabajo se guarda automáticamente cada 5 segundos
- 📱 **Soporte PWA** - Instala como una aplicación nativa en Mac y Linux
- 🔒 **Privacidad Primero** - Todos los datos se almacenan localmente en tu navegador
- 📤 **Importar/Exportar** - Comparte diagramas como archivos JSON
- 🎯 **Almacenamiento de Sesión** - Guardado rápido sin diálogos
- 🌐 **Soporte Sin Conexión** - Trabaja sin conexión a internet
- 🗄️ **Almacenamiento en Servidor** - Almacenamiento persistente opcional cuando se usa Docker (habilitado por defecto)
- 🌍 **Multilingüe** - Soporte completo para 8 idiomas: English, 简体中文, Español, Português, Français, हिन्दी, বাংলা, Русский


## 🐳 Implementación Rápida con Docker

```bash
# Usando Docker Compose (recomendado - incluye almacenamiento persistente)
docker compose up

# O ejecutar directamente desde Docker Hub con almacenamiento persistente
docker run -p 80:80 -v $(pwd)/diagrams:/data/diagrams stnsmith/fossflow:latest
```

El almacenamiento en servidor está habilitado por defecto en Docker. Tus diagramas se guardarán en `./diagrams` en el host.

Para deshabilitar el almacenamiento en servidor, establece `ENABLE_SERVER_STORAGE=false`:
```bash
docker run -p 80:80 -e ENABLE_SERVER_STORAGE=false stnsmith/fossflow:latest
```

## Inicio Rápido (Desarrollo Local)

```bash
# Clonar el repositorio
git clone https://github.com/stan-smith/FossFLOW
cd FossFLOW

# Instalar dependencias
npm install

# Compilar la biblioteca (requerido la primera vez)
npm run build:lib

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Monorepo

Este es un monorepo que contiene dos paquetes:

- `packages/fossflow-lib` - Biblioteca de componentes React para dibujar diagramas de red (construida con Webpack)
- `packages/fossflow-app` - Aplicación Web Progresiva para crear diagramas isométricos (construida con RSBuild)

### Comandos de Desarrollo

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo de la aplicación
npm run dev:lib      # Modo watch para desarrollo de biblioteca

# Compilación
npm run build        # Compilar biblioteca y aplicación
npm run build:lib    # Compilar solo biblioteca
npm run build:app    # Compilar solo aplicación

# Pruebas y Linting
npm test             # Ejecutar pruebas unitarias
npm run lint         # Verificar errores de linting

# Pruebas E2E (Selenium)
cd e2e-tests
./run-tests.sh       # Ejecutar pruebas end-to-end (requiere Docker y Python)

# Publicación
npm run publish:lib  # Publicar biblioteca en npm
```

## Cómo Usar

### Crear Diagramas

1. **Agregar Elementos**:
   - Presiona el botón "+" en el menú superior derecho, la biblioteca de componentes aparecerá a la izquierda
   - Arrastra y suelta componentes de la biblioteca al lienzo
   - O haz clic derecho en la cuadrícula y selecciona "Agregar nodo"

2. **Conectar Elementos**:
   - Selecciona la herramienta Conector (presiona 'C' o haz clic en el icono del conector)
   - **Modo de clic** (predeterminado): Haz clic en el primer nodo, luego haz clic en el segundo nodo
   - **Modo de arrastre** (opcional): Haz clic y arrastra desde el primer nodo al segundo
   - Cambia de modo en Configuración → pestaña Conectores

3. **Guardar Tu Trabajo**:
   - **Guardado Rápido** - Guarda en la sesión del navegador
   - **Exportar** - Descargar como archivo JSON
   - **Importar** - Cargar desde archivo JSON

### Opciones de Almacenamiento

- **Almacenamiento de Sesión**: Guardados temporales eliminados cuando se cierra el navegador
- **Exportar/Importar**: Almacenamiento permanente como archivos JSON
- **Autoguardado**: Guarda automáticamente los cambios cada 5 segundos en la sesión

## Contribuir

¡Damos la bienvenida a las contribuciones! Por favor consulta [CONTRIBUTORS.md](../CONTRIBUTORS.md) para las pautas.

## Documentación

- [FOSSFLOW_ENCYCLOPEDIA.md](../FOSSFLOW_ENCYCLOPEDIA.md) - Guía completa del código base
- [FOSSFLOW_TODO.md](../FOSSFLOW_TODO.md) - Problemas actuales y hoja de ruta
- [CONTRIBUTORS.md](../CONTRIBUTORS.md) - Pautas de contribución

## Licencia

MIT
