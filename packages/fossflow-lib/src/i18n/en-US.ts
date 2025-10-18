import { LocaleProps } from '../types/isoflowProps';

const locale: LocaleProps = {
  common: {
    exampleText: "This is an example text"
  },
  mainMenu: {
    undo: "Undo",
    redo: "Redo", 
    open: "Open",
    exportJson: "Export as JSON",
    exportCompactJson: "Export as Compact JSON",
    exportImage: "Export as image",
    clearCanvas: "Clear the canvas",
    settings: "Settings",
    gitHub: "GitHub"
  },
  helpDialog: {
    title: "Keyboard Shortcuts & Help",
    close: "Close",
    keyboardShortcuts: "Keyboard Shortcuts",
    mouseInteractions: "Mouse Interactions",
    action: "Action",
    shortcut: "Shortcut",
    method: "Method",
    description: "Description",
    note: "Note:",
    noteContent: "Keyboard shortcuts are disabled when typing in input fields, text areas, or content-editable elements to prevent conflicts.",
    // Keyboard shortcuts
    undoAction: "Undo",
    undoDescription: "Undo the last action",
    redoAction: "Redo",
    redoDescription: "Redo the last undone action",
    redoAltAction: "Redo (Alternative)",
    redoAltDescription: "Alternative redo shortcut",
    helpAction: "Help",
    helpDescription: "Open help dialog with keyboard shortcuts",
    zoomInAction: "Zoom In",
    zoomInShortcut: "Mouse Wheel Up",
    zoomInDescription: "Zoom in on the canvas",
    zoomOutAction: "Zoom Out",
    zoomOutShortcut: "Mouse Wheel Down",
    zoomOutDescription: "Zoom out from the canvas",
    panCanvasAction: "Pan Canvas",
    panCanvasShortcut: "Left-click + Drag",
    panCanvasDescription: "Pan the canvas when in Pan mode",
    contextMenuAction: "Context Menu",
    contextMenuShortcut: "Right-click",
    contextMenuDescription: "Open context menu for items or empty space",
    // Mouse interactions
    selectToolAction: "Select Tool",
    selectToolShortcut: "Click Select button",
    selectToolDescription: "Switch to selection mode",
    panToolAction: "Pan Tool",
    panToolShortcut: "Click Pan button",
    panToolDescription: "Switch to pan mode for moving canvas",
    addItemAction: "Add Item",
    addItemShortcut: "Click Add item button",
    addItemDescription: "Open icon picker to add new items",
    drawRectangleAction: "Draw Rectangle",
    drawRectangleShortcut: "Click Rectangle button",
    drawRectangleDescription: "Switch to rectangle drawing mode",
    createConnectorAction: "Create Connector",
    createConnectorShortcut: "Click Connector button",
    createConnectorDescription: "Switch to connector mode",
    addTextAction: "Add Text",
    addTextShortcut: "Click Text button",
    addTextDescription: "Create a new text box"
  },
  connectorHintTooltip: {
    tipCreatingConnectors: "Tip: Creating Connectors",
    tipConnectorTools: "Tip: Connector Tools",
    clickInstructionStart: "Click",
    clickInstructionMiddle: "on the first node or point, then",
    clickInstructionEnd: "on the second node or point to create a connection.",
    nowClickTarget: "Now click on the target to complete the connection.",
    dragStart: "Drag",
    dragEnd: "from the first node to the second node to create a connection.",
    rerouteStart: "To reroute a connector,",
    rerouteMiddle: "left-click",
    rerouteEnd: "on any point along the connector line and drag to create or move anchor points."
  },
  lassoHintTooltip: {
    tipLasso: "Tip: Lasso Selection",
    tipFreehandLasso: "Tip: Freehand Lasso Selection",
    lassoDragStart: "Click and drag",
    lassoDragEnd: "to draw a rectangular selection box around items you want to select.",
    freehandDragStart: "Click and drag",
    freehandDragMiddle: "to draw a",
    freehandDragEnd: "freeform shape",
    freehandComplete: "around items. Release to select all items inside the shape.",
    moveStart: "Once selected,",
    moveMiddle: "click inside the selection",
    moveEnd: "and drag to move all selected items together."
  },
  importHintTooltip: {
    title: "Import Diagrams",
    instructionStart: "To import diagrams, click the",
    menuButton: "menu button",
    instructionMiddle: "(☰) in the top left corner, then select",
    openButton: "\"Open\"",
    instructionEnd: "to load your diagram files."
  },
  connectorRerouteTooltip: {
    title: "Tip: Reroute Connectors",
    instructionStart: "Once your connectors are placed you can reroute them as you please.",
    instructionSelect: "Select the connector",
    instructionMiddle: "first, then",
    instructionClick: "click on the connector path",
    instructionAnd: "and",
    instructionDrag: "drag",
    instructionEnd: "to change it!"
  },
  settings: {
    zoom: {
      description: "Configure zoom behavior when using the mouse wheel.",
      zoomToCursor: "Zoom to Cursor",
      zoomToCursorDesc: "When enabled, zoom in/out centered on the mouse cursor position. When disabled, zoom is centered on the canvas."
    },
    hotkeys: {
      title: "Hotkey Settings",
      profile: "Hotkey Profile",
      profileQwerty: "QWERTY (Q, W, E, R, T, Y)",
      profileSmnrct: "SMNRCT (S, M, N, R, C, T)",
      profileNone: "No Hotkeys",
      tool: "Tool",
      hotkey: "Hotkey",
      toolSelect: "Select",
      toolPan: "Pan",
      toolAddItem: "Add Item",
      toolRectangle: "Rectangle",
      toolConnector: "Connector",
      toolText: "Text",
      note: "Note: Hotkeys work when not typing in text fields"
    },
    pan: {
      title: "Pan Settings",
      mousePanOptions: "Mouse Pan Options",
      emptyAreaClickPan: "Click and drag on empty area",
      middleClickPan: "Middle click and drag",
      rightClickPan: "Right click and drag",
      ctrlClickPan: "Ctrl + click and drag",
      altClickPan: "Alt + click and drag",
      keyboardPanOptions: "Keyboard Pan Options",
      arrowKeys: "Arrow keys",
      wasdKeys: "WASD keys",
      ijklKeys: "IJKL keys",
      keyboardPanSpeed: "Keyboard Pan Speed",
      note: "Note: Pan options work in addition to the dedicated Pan tool"
    },
    connector: {
      title: "Connector Settings",
      connectionMode: "Connection Creation Mode",
      clickMode: "Click Mode (Recommended)",
      clickModeDesc: "Click the first node, then click the second node to create a connection",
      dragMode: "Drag Mode",
      dragModeDesc: "Click and drag from the first node to the second node",
      note: "Note: You can change this setting at any time. The selected mode will be used when the Connector tool is active."
    },
    iconPacks: {
      title: "Icon Pack Management",
      lazyLoading: "Enable Lazy Loading",
      lazyLoadingDesc: "Load icon packs on demand for faster startup",
      availablePacks: "Available Icon Packs",
      coreIsoflow: "Core Isoflow (Always Loaded)",
      alwaysEnabled: "Always enabled",
      awsPack: "AWS Icons",
      gcpPack: "Google Cloud Icons",
      azurePack: "Azure Icons",
      kubernetesPack: "Kubernetes Icons",
      loading: "Loading...",
      loaded: "Loaded",
      notLoaded: "Not loaded",
      iconCount: "{count} icons",
      lazyLoadingDisabledNote: "Lazy loading is disabled. All icon packs are loaded at startup.",
      note: "Icon packs can be enabled or disabled based on your needs. Disabled packs will reduce memory usage and improve performance."
    }
  },
  lazyLoadingWelcome: {
    title: "New Feature: Lazy Loading!",
    message: "Hey! After popular demand, we have implemented Lazy Loading of icons, so now if you want to enable non-standard icon packs you can enable them in the 'Configuration' section.",
    configPath: "Click on the Hamburger icon",
    configPath2: "in the top left to access Configuration.",
    canDisable: "You can disable this behaviour if you wish.",
    signature: "-Stan"
  }
};

export default locale;
