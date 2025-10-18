import { LocaleProps } from '../types/isoflowProps';

const locale: LocaleProps = {
  common: {
    exampleText: "Este es un texto de ejemplo"
  },
  mainMenu: {
    undo: "Deshacer",
    redo: "Rehacer",
    open: "Abrir",
    exportJson: "Exportar como JSON",
    exportCompactJson: "Exportar como JSON compacto",
    exportImage: "Exportar como imagen",
    clearCanvas: "Limpiar el lienzo",
    settings: "Configuración",
    gitHub: "GitHub"
  },
  helpDialog: {
    title: "Atajos de teclado y ayuda",
    close: "Cerrar",
    keyboardShortcuts: "Atajos de teclado",
    mouseInteractions: "Interacciones del ratón",
    action: "Acción",
    shortcut: "Atajo",
    method: "Método",
    description: "Descripción",
    note: "Nota:",
    noteContent: "Los atajos de teclado se desactivan al escribir en campos de entrada, áreas de texto o elementos editables para evitar conflictos.",
    // Keyboard shortcuts
    undoAction: "Deshacer",
    undoDescription: "Deshacer la última acción",
    redoAction: "Rehacer",
    redoDescription: "Rehacer la última acción deshecha",
    redoAltAction: "Rehacer (Alternativo)",
    redoAltDescription: "Atajo alternativo para rehacer",
    helpAction: "Ayuda",
    helpDescription: "Abrir diálogo de ayuda con atajos de teclado",
    zoomInAction: "Acercar",
    zoomInShortcut: "Rueda del ratón hacia arriba",
    zoomInDescription: "Acercar en el lienzo",
    zoomOutAction: "Alejar",
    zoomOutShortcut: "Rueda del ratón hacia abajo",
    zoomOutDescription: "Alejar del lienzo",
    panCanvasAction: "Desplazar lienzo",
    panCanvasShortcut: "Clic izquierdo + Arrastrar",
    panCanvasDescription: "Desplazar el lienzo en modo desplazamiento",
    contextMenuAction: "Menú contextual",
    contextMenuShortcut: "Clic derecho",
    contextMenuDescription: "Abrir menú contextual para elementos o espacio vacío",
    // Mouse interactions
    selectToolAction: "Herramienta de selección",
    selectToolShortcut: "Clic en botón Seleccionar",
    selectToolDescription: "Cambiar al modo de selección",
    panToolAction: "Herramienta de desplazamiento",
    panToolShortcut: "Clic en botón Desplazar",
    panToolDescription: "Cambiar al modo de desplazamiento para mover el lienzo",
    addItemAction: "Añadir elemento",
    addItemShortcut: "Clic en botón Añadir elemento",
    addItemDescription: "Abrir selector de iconos para añadir nuevos elementos",
    drawRectangleAction: "Dibujar rectángulo",
    drawRectangleShortcut: "Clic en botón Rectángulo",
    drawRectangleDescription: "Cambiar al modo de dibujo de rectángulos",
    createConnectorAction: "Crear conector",
    createConnectorShortcut: "Clic en botón Conector",
    createConnectorDescription: "Cambiar al modo de conector",
    addTextAction: "Añadir texto",
    addTextShortcut: "Clic en botón Texto",
    addTextDescription: "Crear un nuevo cuadro de texto"
  },
  connectorHintTooltip: {
    tipCreatingConnectors: "Consejo: Crear conectores",
    tipConnectorTools: "Consejo: Herramientas de conectores",
    clickInstructionStart: "Haz clic",
    clickInstructionMiddle: "en el primer nodo o punto, luego",
    clickInstructionEnd: "en el segundo nodo o punto para crear una conexión.",
    nowClickTarget: "Ahora haz clic en el objetivo para completar la conexión.",
    dragStart: "Arrastra",
    dragEnd: "desde el primer nodo al segundo nodo para crear una conexión.",
    rerouteStart: "Para cambiar la ruta de un conector,",
    rerouteMiddle: "haz clic izquierdo",
    rerouteEnd: "en cualquier punto a lo largo de la línea del conector y arrastra para crear o mover puntos de anclaje."
  },
  lassoHintTooltip: {
    tipLasso: "Consejo: Selección de lazo",
    tipFreehandLasso: "Consejo: Selección de lazo libre",
    lassoDragStart: "Haz clic y arrastra",
    lassoDragEnd: "para dibujar un cuadro de selección rectangular alrededor de los elementos que deseas seleccionar.",
    freehandDragStart: "Haz clic y arrastra",
    freehandDragMiddle: "para dibujar una",
    freehandDragEnd: "forma libre",
    freehandComplete: "alrededor de los elementos. Suelta para seleccionar todos los elementos dentro de la forma.",
    moveStart: "Una vez seleccionados,",
    moveMiddle: "haz clic dentro de la selección",
    moveEnd: "y arrastra para mover todos los elementos seleccionados juntos."
  },
  importHintTooltip: {
    title: "Importar diagramas",
    instructionStart: "Para importar diagramas, haz clic en el",
    menuButton: "botón de menú",
    instructionMiddle: "(☰) en la esquina superior izquierda, luego selecciona",
    openButton: "\"Abrir\"",
    instructionEnd: "para cargar tus archivos de diagrama."
  },
  connectorRerouteTooltip: {
    title: "Consejo: Cambiar ruta de conectores",
    instructionStart: "Una vez que tus conectores estén colocados, puedes cambiar su ruta como desees.",
    instructionSelect: "Selecciona el conector",
    instructionMiddle: "primero, luego",
    instructionClick: "haz clic en la ruta del conector",
    instructionAnd: "y",
    instructionDrag: "arrastra",
    instructionEnd: "para cambiarlo!"
  },
  settings: {
    zoom: {
      description: "Configura el comportamiento del zoom al usar la rueda del ratón.",
      zoomToCursor: "Zoom al cursor",
      zoomToCursorDesc: "Cuando está habilitado, el zoom se centra en la posición del cursor del ratón. Cuando está deshabilitado, el zoom se centra en el lienzo."
    },
    hotkeys: {
      title: "Configuración de atajos",
      profile: "Perfil de atajos",
      profileQwerty: "QWERTY (Q, W, E, R, T, Y)",
      profileSmnrct: "SMNRCT (S, M, N, R, C, T)",
      profileNone: "Sin atajos",
      tool: "Herramienta",
      hotkey: "Atajo",
      toolSelect: "Seleccionar",
      toolPan: "Desplazar",
      toolAddItem: "Añadir elemento",
      toolRectangle: "Rectángulo",
      toolConnector: "Conector",
      toolText: "Texto",
      note: "Nota: Los atajos funcionan cuando no estás escribiendo en campos de texto"
    },
    pan: {
      title: "Configuración de desplazamiento",
      mousePanOptions: "Opciones de desplazamiento con ratón",
      emptyAreaClickPan: "Clic y arrastrar en área vacía",
      middleClickPan: "Clic central y arrastrar",
      rightClickPan: "Clic derecho y arrastrar",
      ctrlClickPan: "Ctrl + clic y arrastrar",
      altClickPan: "Alt + clic y arrastrar",
      keyboardPanOptions: "Opciones de desplazamiento con teclado",
      arrowKeys: "Teclas de flechas",
      wasdKeys: "Teclas WASD",
      ijklKeys: "Teclas IJKL",
      keyboardPanSpeed: "Velocidad de desplazamiento con teclado",
      note: "Nota: Las opciones de desplazamiento funcionan además de la herramienta de desplazamiento dedicada"
    },
    connector: {
      title: "Configuración de conectores",
      connectionMode: "Modo de creación de conexiones",
      clickMode: "Modo clic (Recomendado)",
      clickModeDesc: "Haz clic en el primer nodo, luego haz clic en el segundo nodo para crear una conexión",
      dragMode: "Modo arrastrar",
      dragModeDesc: "Haz clic y arrastra desde el primer nodo hasta el segundo nodo",
      note: "Nota: Puedes cambiar esta configuración en cualquier momento. El modo seleccionado se usará cuando la herramienta de conector esté activa."
    },
    iconPacks: {
      title: "Gestión de Paquetes de Iconos",
      lazyLoading: "Activar Carga Diferida",
      lazyLoadingDesc: "Cargar paquetes de iconos bajo demanda para un inicio más rápido",
      availablePacks: "Paquetes de Iconos Disponibles",
      coreIsoflow: "Core Isoflow (Siempre Cargado)",
      alwaysEnabled: "Siempre activado",
      awsPack: "Iconos AWS",
      gcpPack: "Iconos Google Cloud",
      azurePack: "Iconos Azure",
      kubernetesPack: "Iconos Kubernetes",
      loading: "Cargando...",
      loaded: "Cargado",
      notLoaded: "No cargado",
      iconCount: "{count} iconos",
      lazyLoadingDisabledNote: "La carga diferida está desactivada. Todos los paquetes de iconos se cargan al iniciar.",
      note: "Los paquetes de iconos se pueden activar o desactivar según tus necesidades. Los paquetes desactivados reducirán el uso de memoria y mejorarán el rendimiento."
    }
  },
  lazyLoadingWelcome: {
    title: "Nueva Funcionalidad: ¡Carga Diferida!",
    message: "¡Hola! Después de la demanda popular, hemos implementado la Carga Diferida de iconos, así que ahora si quieres activar paquetes de iconos no estándar puedes activarlos en la sección 'Configuración'.",
    configPath: "Haz clic en el icono de Hamburguesa",
    configPath2: "en la esquina superior izquierda para acceder a la Configuración.",
    canDisable: "Puedes desactivar este comportamiento si lo deseas.",
    signature: "-Stan"
  }
};

export default locale;
