import { LocaleProps } from '../types/isoflowProps';

const locale: LocaleProps = {
  common: {
    exampleText: "Dies ist ein Beispiel text"
  },
  mainMenu: {
    undo: "Rückgängig",
    redo: "Wiederholen",
    open: "Öffnen",
    exportJson: "Als JSON exportieren",
    exportCompactJson: "Als kompakte JSON exportieren",
    exportImage: "Als Bild exportieren",
    clearCanvas: "Canvas zurücksetzen",
    settings: "Einstellungen",
    gitHub: "GitHub"
  },
  helpDialog: {
    title: "Tastenkürzel & Hilfe",
    close: "Schließen",
    keyboardShortcuts: "Tastenkürzel",
    mouseInteractions: "Mausinteraktionen",
    action: "Aktion",
    shortcut: "Kürzel",
    method: "Methode",
    description: "Beschreibung",
    note: "Hinweis:",
    noteContent: "Tastenkürzel sind deaktiviert, wenn in Eingabefeldern, Textbereichen oder inhaltbearbeitbaren Elementen getippt wird, um Konflikte zu vermeiden.",
    // Keyboard shortcuts
    undoAction: "Rückgängig",
    undoDescription: "Die letzte Aktion rückgängig machen",
    redoAction: "Wiederholen",
    redoDescription: "Die zuletzt rückgängig gemachte Aktion wiederholen",
    redoAltAction: "Wiederholen (Alternativ)",
    redoAltDescription: "Alternativer Tastenkürzel zum Wiederholen",
    helpAction: "Hilfe",
    helpDescription: "Hilfedialog mit Tastenkürzeln öffnen",
    zoomInAction: "Vergrößern",
    zoomInShortcut: "Mausrad nach oben",
    zoomInDescription: "Canvas vergrößern",
    zoomOutAction: "Verkleinern",
    zoomOutShortcut: "Mausrad nach unten",
    zoomOutDescription: "Canvas verkleinern",
    panCanvasAction: "Canvas verschieben",
    panCanvasShortcut: "Linksklick + Ziehen",
    panCanvasDescription: "Canvas im Verschiebe-Modus bewegen",
    contextMenuAction: "Kontextmenü",
    contextMenuShortcut: "Rechtsklick",
    contextMenuDescription: "Kontextmenü für Elemente oder leere Fläche öffnen",
    // Mouse interactions
    selectToolAction: "Auswahlwerkzeug",
    selectToolShortcut: "Auswahl-Schaltfläche klicken",
    selectToolDescription: "In den Auswahlmodus wechseln",
    panToolAction: "Verschiebewerkzeug",
    panToolShortcut: "Verschieben-Schaltfläche klicken",
    panToolDescription: "In den Verschiebe-Modus zum Bewegen des Canvas wechseln",
    addItemAction: "Element hinzufügen",
    addItemShortcut: "Element-hinzufügen-Schaltfläche klicken",
    addItemDescription: "Icon-Auswahl zum Hinzufügen neuer Elemente öffnen",
    drawRectangleAction: "Rechteck zeichnen",
    drawRectangleShortcut: "Rechteck-Schaltfläche klicken",
    drawRectangleDescription: "In den Rechteck-Zeichnungsmodus wechseln",
    createConnectorAction: "Verbindung erstellen",
    createConnectorShortcut: "Verbindungs-Schaltfläche klicken",
    createConnectorDescription: "In den Verbindungsmodus wechseln",
    addTextAction: "Text hinzufügen",
    addTextShortcut: "Text-Schaltfläche klicken",
    addTextDescription: "Ein neues Textfeld erstellen"
  },
  connectorHintTooltip: {
    tipCreatingConnectors: "Tipp: Verbindungen erstellen",
    tipConnectorTools: "Tipp: Verbindungswerkzeuge",
    clickInstructionStart: "Klicke",
    clickInstructionMiddle: "auf den ersten Knoten oder Punkt, dann",
    clickInstructionEnd: "auf den zweiten Knoten oder Punkt, um eine Verbindung herzustellen.",
    nowClickTarget: "Klicke nun auf das Ziel, um die Verbindung zu vervollständigen.",
    dragStart: "Ziehe",
    dragEnd: "vom ersten Knoten zum zweiten Knoten, um eine Verbindung herzustellen.",
    rerouteStart: "Um eine Verbindung umzuleiten,",
    rerouteMiddle: "linksklicke",
    rerouteEnd: "auf einen beliebigen Punkt entlang der Verbindungslinie und ziehe, um Ankerpunkte zu erstellen oder zu verschieben."
  },
  lassoHintTooltip: {
    tipLasso: "Tipp: Lasso-Auswahl",
    tipFreehandLasso: "Tipp: Freihand-Lasso-Auswahl",
    lassoDragStart: "Klicken und ziehen",
    lassoDragEnd: "um ein rechteckiges Auswahlfeld um die gewünschten Elemente zu zeichnen.",
    freehandDragStart: "Klicken und ziehen",
    freehandDragMiddle: "um eine",
    freehandDragEnd: "Freihandform",
    freehandComplete: "um Elemente zu zeichnen. Loslassen, um alle Elemente innerhalb der Form auszuwählen.",
    moveStart: "Nach der Auswahl,",
    moveMiddle: "in die Auswahl klicken",
    moveEnd: "und ziehen, um alle ausgewählten Elemente gemeinsam zu verschieben."
  },
  importHintTooltip: {
    title: "Diagramme importieren",
    instructionStart: "Um Diagramme zu importieren, klicke auf die",
    menuButton: "Menü-Schaltfläche",
    instructionMiddle: "(☰) in der oberen linken Ecke, dann wähle",
    openButton: "\"Öffnen\"",
    instructionEnd: "um deine Diagrammdateien zu laden."
  },
  connectorRerouteTooltip: {
    title: "Tipp: Verbindungen umleiten",
    instructionStart: "Sobald deine Verbindungen platziert sind, kannst du sie nach Belieben umleiten.",
    instructionSelect: "Wähle die Verbindung aus",
    instructionMiddle: "zuerst, dann",
    instructionClick: "auf den Verbindungspfad klicken",
    instructionAnd: "und",
    instructionDrag: "ziehen",
    instructionEnd: "um ihn zu ändern!"
  },
  connectorEmptySpaceTooltip: {
    message: "Um diese Verbindung mit einem Knoten zu verbinden,",
    instruction: "linksklicke auf das Ende der Verbindung und ziehe es zum gewünschten Knoten."
  },
  settings: {
    zoom: {
      description: "Zoom-Verhalten bei Verwendung des Mausrads konfigurieren.",
      zoomToCursor: "Zoom zum Cursor",
      zoomToCursorDesc: "Wenn aktiviert, wird beim Zoomen auf die Mauszeiger-Position zentriert. Wenn deaktiviert, wird auf den Canvas zentriert."
    },
    hotkeys: {
      title: "Tastenkürzel-Einstellungen",
      profile: "Tastenkürzel-Profil",
      profileQwerty: "QWERTY (Q, W, E, R, T, Y)",
      profileSmnrct: "SMNRCT (S, M, N, R, C, T)",
      profileNone: "Keine Tastenkürzel",
      tool: "Werkzeug",
      hotkey: "Tastenkürzel",
      toolSelect: "Auswählen",
      toolPan: "Verschieben",
      toolAddItem: "Element hinzufügen",
      toolRectangle: "Rechteck",
      toolConnector: "Verbindung",
      toolText: "Text",
      note: "Hinweis: Tastenkürzel funktionieren, wenn nicht in Textfeldern getippt wird"
    },
    pan: {
      title: "Verschiebe-Einstellungen",
      mousePanOptions: "Maus-Verschiebe-Optionen",
      emptyAreaClickPan: "Auf leere Fläche klicken und ziehen",
      middleClickPan: "Mittelklick und ziehen",
      rightClickPan: "Rechtsklick und ziehen",
      ctrlClickPan: "Strg + Klick und ziehen",
      altClickPan: "Alt + Klick und ziehen",
      keyboardPanOptions: "Tastatur-Verschiebe-Optionen",
      arrowKeys: "Pfeiltasten",
      wasdKeys: "WASD-Tasten",
      ijklKeys: "IJKL-Tasten",
      keyboardPanSpeed: "Tastatur-Verschiebegeschwindigkeit",
      note: "Hinweis: Verschiebe-Optionen funktionieren zusätzlich zum dedizierten Verschiebewerkzeug"
    },
    connector: {
      title: "Verbindungs-Einstellungen",
      connectionMode: "Verbindungserstellungsmodus",
      clickMode: "Klick-Modus (Empfohlen)",
      clickModeDesc: "Ersten Knoten klicken, dann zweiten Knoten klicken, um eine Verbindung herzustellen",
      dragMode: "Zieh-Modus",
      dragModeDesc: "Vom ersten Knoten zum zweiten Knoten klicken und ziehen",
      note: "Hinweis: Diese Einstellung kann jederzeit geändert werden. Der ausgewählte Modus wird verwendet, wenn das Verbindungswerkzeug aktiv ist."
    },
    iconPacks: {
      title: "Icon-Paket-Verwaltung",
      lazyLoading: "Lazy Loading aktivieren",
      lazyLoadingDesc: "Icon-Pakete bei Bedarf laden für schnelleren Start",
      availablePacks: "Verfügbare Icon-Pakete",
      coreIsoflow: "Core Isoflow (immer geladen)",
      alwaysEnabled: "Immer aktiviert",
      awsPack: "AWS-Icons",
      gcpPack: "Google Cloud Icons",
      azurePack: "Azure-Icons",
      kubernetesPack: "Kubernetes-Icons",
      loading: "Wird geladen...",
      loaded: "Geladen",
      notLoaded: "Nicht geladen",
      iconCount: "{count} Icons",
      lazyLoadingDisabledNote: "Lazy Loading ist deaktiviert. Alle Icon-Pakete werden beim Start geladen.",
      note: "Icon-Pakete können je nach Bedarf aktiviert oder deaktiviert werden. Deaktivierte Pakete reduzieren den Speicherverbrauch und verbessern die Leistung."
    }
  },
  lazyLoadingWelcome: {
    title: "Neue Funktion: Lazy Loading!",
    message: "Hey! Aufgrund der großen Nachfrage haben wir Lazy Loading für Icons implementiert. Zusätzliche Icon-Pakete lassen sich nun im Abschnitt 'Konfiguration' aktivieren.",
    configPath: "Klicke auf das Hamburger Menü",
    configPath2: "oben links, um auf die Konfiguration zuzugreifen.",
    canDisable: "Wenn du möchtest, kannst du dieses Verhalten deaktivieren.",
    signature: "-Stan"
  },
  settingsDialog: {
    title: "Einstellungen",
    close: "Schließen",
    tabZoom: "Zoom",
    tabLabels: "Beschriftungen"
  },
  labelSettings: {
    description: "Beschriftungsanzeige-Einstellungen konfigurieren",
    expandButtonPadding: "Erweiter-Schaltflächen-Abstand",
    expandButtonPaddingDesc: "Untenabstand wenn Erweiter-Schaltfläche sichtbar ist (verhindert Textüberlappung)",
    current: "Aktuell: {{value}} Theme-Einheiten"
  }
,
  diagramViewStatus: {
    untitledDiagram: "Unbenanntes Diagramm",
    untitledView: "Unbenannte Ansicht"
  },
  addMenu: {
    addNode: "Knoten hinzufügen",
    addRectangle: "Rechteck hinzufügen"
  }
};

export default locale;
