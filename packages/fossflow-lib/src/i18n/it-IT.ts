import { LocaleProps } from '../types/isoflowProps';

const locale: LocaleProps = {
  common: {
    exampleText: "Questo è un testo di esempio"
  },
  mainMenu: {
    undo: "Annulla",
    redo: "Ripeti", 
    open: "Apri",
    exportJson: "Esporta come JSON",
    exportCompactJson: "Esporta come JSON compatto",
    exportImage: "Esporta come immagine",
    clearCanvas: "Pulisci la tela",
    settings: "Impostazioni",
    gitHub: "GitHub"
  },
  helpDialog: {
    title: "Scorciatoie da tastiera e aiuto",
    close: "Chiudi",
    keyboardShortcuts: "Scorciatoie da tastiera",
    mouseInteractions: "Interazioni del mouse",
    action: "Azione",
    shortcut: "Scorciatoia",
    method: "Metodo",
    description: "Descrizione",
    note: "Nota:",
    noteContent: "Le scorciatoie da tastiera sono disattivate durante la digitazione in campi di testo o elementi modificabili per evitare conflitti.",
    // Keyboard shortcuts
    undoAction: "Annulla",
    undoDescription: "Annulla l'ultima azione",
    redoAction: "Ripeti",
    redoDescription: "Ripeti l'ultima azione annullata",
    redoAltAction: "Ripeti (Alternativa)",
    redoAltDescription: "Scorciatoia alternativa per ripetere",
    helpAction: "Aiuto",
    helpDescription: "Apri la finestra di aiuto con le scorciatoie da tastiera",
    zoomInAction: "Ingrandisci",
    zoomInShortcut: "Rotella del mouse su",
    zoomInDescription: "Ingrandisci la tela",
    zoomOutAction: "Rimpicciolisci",
    zoomOutShortcut: "Rotella del mouse giù",
    zoomOutDescription: "Rimpicciolisci la tela",
    panCanvasAction: "Sposta la tela",
    panCanvasShortcut: "Clic sinistro + trascina",
    panCanvasDescription: "Muovi la tela in modalità panoramica",
    contextMenuAction: "Menu contestuale",
    contextMenuShortcut: "Tasto destro",
    contextMenuDescription: "Apri il menu contestuale per elementi o spazio vuoto",
    // Mouse interactions
    selectToolAction: "Strumento Selezione",
    selectToolShortcut: "Clicca il pulsante Selezione",
    selectToolDescription: "Passa alla modalità selezione",
    panToolAction: "Strumento Panoramica",
    panToolShortcut: "Clicca il pulsante Panoramica",
    panToolDescription: "Passa alla modalità panoramica per spostare la tela",
    addItemAction: "Aggiungi elemento",
    addItemShortcut: "Clicca il pulsante Aggiungi elemento",
    addItemDescription: "Apri il selettore di icone per aggiungere nuovi elementi",
    drawRectangleAction: "Disegna rettangolo",
    drawRectangleShortcut: "Clicca il pulsante Rettangolo",
    drawRectangleDescription: "Passa alla modalità disegno rettangolo",
    createConnectorAction: "Crea connettore",
    createConnectorShortcut: "Clicca il pulsante Connettore",
    createConnectorDescription: "Passa alla modalità connettore",
    addTextAction: "Aggiungi testo",
    addTextShortcut: "Clicca il pulsante Testo",
    addTextDescription: "Crea una nuova casella di testo"
  },
  connectorHintTooltip: {
    tipCreatingConnectors: "Suggerimento: Creazione connettori",
    tipConnectorTools: "Suggerimento: Strumenti connettore",
    clickInstructionStart: "Clicca",
    clickInstructionMiddle: "sul primo nodo o punto, poi",
    clickInstructionEnd: "sul secondo nodo o punto per creare una connessione.",
    nowClickTarget: "Ora clicca sull'obiettivo per completare la connessione.",
    dragStart: "Trascina",
    dragEnd: "dal primo nodo al secondo nodo per creare una connessione.",
    rerouteStart: "Per riorientare un connettore,",
    rerouteMiddle: "clicca con il tasto sinistro",
    rerouteEnd: "su un punto qualsiasi lungo la linea del connettore e trascina per creare o spostare i punti di ancoraggio."
  },
  lassoHintTooltip: {
    tipLasso: "Suggerimento: Selezione Lasso",
    tipFreehandLasso: "Suggerimento: Selezione Lasso a mano libera",
    lassoDragStart: "Clicca e trascina",
    lassoDragEnd: "per disegnare un riquadro di selezione rettangolare attorno agli elementi da selezionare.",
    freehandDragStart: "Clicca e trascina",
    freehandDragMiddle: "per disegnare una",
    freehandDragEnd: "forma libera",
    freehandComplete: "attorno agli elementi. Rilascia per selezionare tutti gli elementi all'interno della forma.",
    moveStart: "Una volta selezionati,",
    moveMiddle: "clicca all'interno della selezione",
    moveEnd: "e trascina per muovere tutti gli elementi selezionati insieme."
  },
  importHintTooltip: {
    title: "Importa diagrammi",
    instructionStart: "Per importare diagrammi, clicca sul",
    menuButton: "pulsante del menu",
    instructionMiddle: "(☰) in alto a sinistra, poi seleziona",
    openButton: "\"Apri\"",
    instructionEnd: "per caricare i tuoi file di diagramma."
  },
  connectorRerouteTooltip: {
    title: "Suggerimento: Riorienta connettori",
    instructionStart: "Una volta posizionati i connettori, puoi riorientarli come preferisci.",
    instructionSelect: "Seleziona prima il connettore,",
    instructionMiddle: "poi",
    instructionClick: "clicca sul percorso del connettore",
    instructionAnd: "e",
    instructionDrag: "trascina",
    instructionEnd: "per modificarlo!"
  },
  settings: {
    zoom: {
      description: "Configura il comportamento dello zoom quando si usa la rotella del mouse.",
      zoomToCursor: "Zoom sul cursore",
      zoomToCursorDesc: "Se abilitato, ingrandisci o riduci centrando sul cursore del mouse. Se disabilitato, lo zoom è centrato sulla tela."
    },
    hotkeys: {
      title: "Impostazioni scorciatoie",
      profile: "Profilo scorciatoie",
      profileQwerty: "QWERTY (Q, W, E, R, T, Y)",
      profileSmnrct: "SMNRCT (S, M, N, R, C, T)",
      profileNone: "Nessuna scorciatoia",
      tool: "Strumento",
      hotkey: "Scorciatoia",
      toolSelect: "Seleziona",
      toolPan: "Panoramica",
      toolAddItem: "Aggiungi elemento",
      toolRectangle: "Rettangolo",
      toolConnector: "Connettore",
      toolText: "Testo",
      note: "Nota: Le scorciatoie funzionano quando non stai digitando nei campi di testo"
    },
    pan: {
      title: "Impostazioni Panoramica",
      mousePanOptions: "Opzioni panoramica con mouse",
      emptyAreaClickPan: "Clicca e trascina su un'area vuota",
      middleClickPan: "Clic centrale e trascina",
      rightClickPan: "Clic destro e trascina",
      ctrlClickPan: "Ctrl + clic e trascina",
      altClickPan: "Alt + clic e trascina",
      keyboardPanOptions: "Opzioni panoramica con tastiera",
      arrowKeys: "Tasti freccia",
      wasdKeys: "Tasti WASD",
      ijklKeys: "Tasti IJKL",
      keyboardPanSpeed: "Velocità panoramica tastiera",
      note: "Nota: Le opzioni di panoramica funzionano insieme allo strumento Panoramica dedicato"
    },
    connector: {
      title: "Impostazioni Connettore",
      connectionMode: "Modalità creazione connessione",
      clickMode: "Modalità clic (consigliata)",
      clickModeDesc: "Clicca sul primo nodo, poi sul secondo per creare una connessione",
      dragMode: "Modalità trascinamento",
      dragModeDesc: "Clicca e trascina dal primo nodo al secondo per creare una connessione",
      note: "Nota: Puoi modificare questa impostazione in qualsiasi momento. La modalità selezionata verrà usata quando lo strumento Connettore è attivo."
    },
    iconPacks: {
      title: "Gestione pacchetti di icone",
      lazyLoading: "Abilita caricamento ritardato (Lazy Loading)",
      lazyLoadingDesc: "Carica i pacchetti di icone su richiesta per un avvio più rapido",
      availablePacks: "Pacchetti di icone disponibili",
      coreIsoflow: "Isoflow di base (sempre caricato)",
      alwaysEnabled: "Sempre abilitato",
      awsPack: "Icone AWS",
      gcpPack: "Icone Google Cloud",
      azurePack: "Icone Azure",
      kubernetesPack: "Icone Kubernetes",
      loading: "Caricamento...",
      loaded: "Caricato",
      notLoaded: "Non caricato",
      iconCount: "{count} icone",
      lazyLoadingDisabledNote: "Il caricamento ritardato è disabilitato. Tutti i pacchetti di icone vengono caricati all'avvio.",
      note: "I pacchetti di icone possono essere abilitati o disabilitati in base alle tue esigenze. I pacchetti disabilitati riducono l'uso di memoria e migliorano le prestazioni."
    }
  },
  lazyLoadingWelcome: {
    title: "Nuova funzione: Lazy Loading!",
    message: "Ciao! Su grande richiesta, abbiamo implementato il caricamento ritardato (Lazy Loading) delle icone. Ora, se desideri abilitare pacchetti di icone non standard, puoi farlo nella sezione 'Configurazione'.",
    configPath: "Clicca sull'icona dell'hamburger",
    configPath2: "in alto a sinistra per accedere alla Configurazione.",
    canDisable: "Puoi disattivare questo comportamento se lo desideri.",
    signature: "-Stan"
  }
};

export default locale;
