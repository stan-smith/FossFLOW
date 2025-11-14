import { LocaleProps } from '../types/isoflowProps';

const locale: LocaleProps = {
  common: {
    exampleText: "To jest przykładowy tekst"
  },
  mainMenu: {
    undo: "Cofnij",
    redo: "Ponów", 
    open: "Otwórz",
    exportJson: "Eksportuj do JSON",
    exportCompactJson: "Eksportuj jako kompaktowy JSON",
    exportImage: "Eksportuj do obrazu",
    clearCanvas: "Wyczyść obszar roboczy",
    settings: "Ustawienia",
    gitHub: "GitHub"
  },
  helpDialog: {
    title: "Skróty klawiaturowe i Pomoc",
    close: "Zamknij",
    keyboardShortcuts: "Skróty klawiaturowe",
    mouseInteractions: "Interakcje myszy",
    action: "Operacja",
    shortcut: "Skrót",
    method: "Metoda",
    description: "Opis",
    note: "Uwagi:",
    noteContent: "Skróty klawiaturowe są wyłączone podczas wpisywania danych w polach wprowadzania danych, obszarach tekstowych lub elementach z edytowalną treścią, aby zapobiec konfliktom.",
    // Keyboard shortcuts
    undoAction: "Cofnij",
    undoDescription: "Cofnij do ostatniej operacji",
    redoAction: "Powtórz",
    redoDescription: "Ponów ostatnia operację",
    redoAltAction: "Powtórz (alternatywa)",
    redoAltDescription: "Alternatywny skrót do ponownego wykonania",
    helpAction: "Pomoc",
    helpDescription: "Otwórz okno dialogowe pomocy za pomocą skrótów klawiaturowych",
    zoomInAction: "Powiększ",
    zoomInShortcut: "Kółko myszy w górę",
    zoomInDescription: "Powiększ obszar roboczy",
    zoomOutAction: "Pomniejsz",
    zoomOutShortcut: "Kółko muszy w dół",
    zoomOutDescription: "Pomniejsz obszar roboczy",
    panCanvasAction: "Przesuwanie obszaru roboczego",
    panCanvasShortcut: "Kliknij lewym przyciskiem myszy + przeciągnij",
    panCanvasDescription: "Przesuwaj obszar roboczy w trybie przesuwania",
    contextMenuAction: "Menu kontekstowe",
    contextMenuShortcut: "Prawy przycisk myszy",
    contextMenuDescription: "Otwórz menu kontekstowe dla elementów lub pustej przestrzeni",
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
    title: "Importuj Diagramy",
    instructionStart: "Aby zaimportować diagramy, kliknij przycisk",
    menuButton: "Przycisk menu",
    instructionMiddle: "(☰) w lewym górnym rogu, a następnie wybierz",
    openButton: "\"Otwórz\"",
    instructionEnd: "aby załadować pliki diagramów."
  },
  connectorRerouteTooltip: {
    title: "Wskazówka: Zmiana trasy połączenia",
    instructionStart: "Po umieszczeniu połączenia można je dowolnie przekierowywać..",
    instructionSelect: "Wybierz połączenie",
    instructionMiddle: "następnie",
    instructionClick: "kliknij na ścieżkę połączenia",
    instructionAnd: "i",
    instructionDrag: "przesuń",
    instructionEnd: "aby zmienić!"
  },
  settings: {
    zoom: {
      description: "Skonfiguruj zachowanie powiększania podczas korzystania z kółka myszy.",
      zoomToCursor: "Powiększ do kursora",
      zoomToCursorDesc: "Po włączeniu funkcji powiększanie/pomniejszanie odbywa się w oparciu o położenie kursora myszy. Po wyłączeniu funkcji <strong>Powiększ do kursora</strong> odbywa się w oparciu o położenie obszaru roboczego."
    },
    hotkeys: {
      title: "Ustawienia skrótów klawiszowych",
      profile: "Profil skrótów klawiszowych",
      profileQwerty: "QWERTY (Q, W, E, R, T, Y)",
      profileSmnrct: "SMNRCT (S, M, N, R, C, T)",
      profileNone: "bez skrótów",
      tool: "Narzędzie",
      hotkey: "Skrót",
      toolSelect: "Wybór",
      toolPan: "Przesuwanie",
      toolAddItem: "Dodaj pozycję",
      toolRectangle: "Prostokąt",
      toolConnector: "Połączenia",
      toolText: "Tekst",
      note: "Uwaga: Skróty klawiszowe działają, gdy nie wpisujesz tekstu w polach tekstowych."
    },
    pan: {
      title: "Ustawienia przesuwania",
      mousePanOptions: "Opcje przesuwania myszą",
      emptyAreaClickPan: "Kliknij i przesuń obszar",
      middleClickPan: "Kliknij środkowym przyciskiem myszy i przeciągnij",
      rightClickPan: "Kliknij prawym przyciskiem myszy i przeciągnij",
      ctrlClickPan: "Ctrl + kliknij i przeciągnij",
      altClickPan: "Alt + kliknij i przeciągnij",
      keyboardPanOptions: "Opcje przesuwania klawiaturą",
      arrowKeys: "Klawisze strzałek",
      wasdKeys: "Klawisze WASD",
      ijklKeys: "Klawisze IJKL",
      keyboardPanSpeed: "Szybkość przesuwu klawiatury",
      note: "Uwaga: Opcje przesuwania działają dodatkowo w stosunku do dedykowanego narzędzia przesuwania."
    },
    connector: {
      title: "Ustawienia połączeń",
      connectionMode: "Tryb tworzenia połączenia",
      clickMode: "Tryb kliknięcia (zalecany)",
      clickModeDesc: "Kliknij pierwszy węzeł, a następnie kliknij drugi węzeł, aby utworzyć połączenie.",
      dragMode: "DTryb przeciągania",
      dragModeDesc: "Kliknij i przeciągnij od pierwszego węzła do drugiego węzła.",
      note: "Uwaga: To ustawienie można zmienić w dowolnym momencie. Wybrany tryb będzie używany, gdy narzędzie Połączeń jest aktywne.."
    },
    iconPacks: {
      title: "Zarządzanie pakietami ikon",
      lazyLoading: "Włącz opóźnione ładowanie",
      lazyLoadingDesc: "Wczytuj pakiety ikon na żądanie, aby przyspieszyć uruchamianie",
      availablePacks: "Dostępne pakiety ikon",
      coreIsoflow: "Core Isoflow (Zawsze wczytane)",
      alwaysEnabled: "Zawsze włączone",
      awsPack: "AWS Icons",
      gcpPack: "Google Cloud Icons",
      azurePack: "Azure Icons",
      kubernetesPack: "Kubernetes Icons",
      loading: "Wczytywanie...",
      loaded: "Wczytane",
      notLoaded: "Niewczytane",
      iconCount: "{count} icon",
      lazyLoadingDisabledNote: "Opóźnione ładowanie jest wyłączone. Wszystkie pakiety ikon są ładowane podczas uruchamiania.",
      note: "Pakiety ikon można włączać lub wyłączać w zależności od potrzeb. Wyłączone pakiety zmniejszają zużycie pamięci i poprawiają wydajność."
    }
  },
  lazyLoadingWelcome: {
    title: "Nowa funkcja: Opóźnione ładowanie!",
    message: "Hej! W odpowiedzi na liczne prośby wprowadziliśmy funkcję opóźnionego ładowania ikon, więc teraz, jeśli chcesz włączyć niestandardowe pakiety ikon, możesz to zrobić w sekcji „Ustawienia”.",
    configPath: "Kliknij ikonę manu.",
    configPath2: "w lewym górnym rogu, aby uzyskać dostęp do ustawień.",
    canDisable: "Jeśli chcesz, możesz wyłączyć tę funkcję..",
    signature: "-Stan"
  }
};

export default locale;
