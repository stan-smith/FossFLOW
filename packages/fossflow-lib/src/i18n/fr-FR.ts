import { LocaleProps } from '../types/isoflowProps';

const locale: LocaleProps = {
  common: {
    exampleText: "Ceci est un texte d'exemple"
  },
  mainMenu: {
    undo: "Annuler",
    redo: "Refaire",
    open: "Ouvrir",
    exportJson: "Exporter en JSON",
    exportCompactJson: "Exporter en JSON compact",
    exportImage: "Exporter en image",
    clearCanvas: "Effacer le canevas",
    settings: "Paramètres",
    gitHub: "GitHub"
  },
  helpDialog: {
    title: "Raccourcis clavier et aide",
    close: "Fermer",
    keyboardShortcuts: "Raccourcis clavier",
    mouseInteractions: "Interactions de la souris",
    action: "Action",
    shortcut: "Raccourci",
    method: "Méthode",
    description: "Description",
    note: "Remarque :",
    noteContent: "Les raccourcis clavier sont désactivés lors de la saisie dans les champs de saisie, les zones de texte ou les éléments modifiables pour éviter les conflits.",
    // Keyboard shortcuts
    undoAction: "Annuler",
    undoDescription: "Annuler la dernière action",
    redoAction: "Refaire",
    redoDescription: "Refaire la dernière action annulée",
    redoAltAction: "Refaire (Alternatif)",
    redoAltDescription: "Raccourci alternatif pour refaire",
    helpAction: "Aide",
    helpDescription: "Ouvrir la boîte de dialogue d'aide avec les raccourcis clavier",
    zoomInAction: "Zoom avant",
    zoomInShortcut: "Molette de la souris vers le haut",
    zoomInDescription: "Effectuer un zoom avant sur le canevas",
    zoomOutAction: "Zoom arrière",
    zoomOutShortcut: "Molette de la souris vers le bas",
    zoomOutDescription: "Effectuer un zoom arrière sur le canevas",
    panCanvasAction: "Déplacer le canevas",
    panCanvasShortcut: "Clic gauche + Glisser",
    panCanvasDescription: "Déplacer le canevas en mode déplacement",
    contextMenuAction: "Menu contextuel",
    contextMenuShortcut: "Clic droit",
    contextMenuDescription: "Ouvrir le menu contextuel pour les éléments ou l'espace vide",
    // Mouse interactions
    selectToolAction: "Outil de sélection",
    selectToolShortcut: "Cliquer sur le bouton Sélectionner",
    selectToolDescription: "Passer en mode sélection",
    panToolAction: "Outil de déplacement",
    panToolShortcut: "Cliquer sur le bouton Déplacer",
    panToolDescription: "Passer en mode déplacement pour déplacer le canevas",
    addItemAction: "Ajouter un élément",
    addItemShortcut: "Cliquer sur le bouton Ajouter un élément",
    addItemDescription: "Ouvrir le sélecteur d'icônes pour ajouter de nouveaux éléments",
    drawRectangleAction: "Dessiner un rectangle",
    drawRectangleShortcut: "Cliquer sur le bouton Rectangle",
    drawRectangleDescription: "Passer en mode dessin de rectangles",
    createConnectorAction: "Créer un connecteur",
    createConnectorShortcut: "Cliquer sur le bouton Connecteur",
    createConnectorDescription: "Passer en mode connecteur",
    addTextAction: "Ajouter du texte",
    addTextShortcut: "Cliquer sur le bouton Texte",
    addTextDescription: "Créer une nouvelle zone de texte"
  },
  connectorHintTooltip: {
    tipCreatingConnectors: "Astuce : Créer des connecteurs",
    tipConnectorTools: "Astuce : Outils de connecteurs",
    clickInstructionStart: "Cliquez",
    clickInstructionMiddle: "sur le premier nœud ou point, puis",
    clickInstructionEnd: "sur le deuxième nœud ou point pour créer une connexion.",
    nowClickTarget: "Cliquez maintenant sur la cible pour terminer la connexion.",
    dragStart: "Glissez",
    dragEnd: "du premier nœud au deuxième nœud pour créer une connexion.",
    rerouteStart: "Pour réacheminer un connecteur,",
    rerouteMiddle: "cliquez avec le bouton gauche",
    rerouteEnd: "sur n'importe quel point le long de la ligne du connecteur et glissez pour créer ou déplacer des points d'ancrage."
  },
  lassoHintTooltip: {
    tipLasso: "Astuce : Sélection au lasso",
    tipFreehandLasso: "Astuce : Sélection au lasso libre",
    lassoDragStart: "Cliquez et glissez",
    lassoDragEnd: "pour dessiner une zone de sélection rectangulaire autour des éléments que vous souhaitez sélectionner.",
    freehandDragStart: "Cliquez et glissez",
    freehandDragMiddle: "pour dessiner une",
    freehandDragEnd: "forme libre",
    freehandComplete: "autour des éléments. Relâchez pour sélectionner tous les éléments à l'intérieur de la forme.",
    moveStart: "Une fois sélectionnés,",
    moveMiddle: "cliquez à l'intérieur de la sélection",
    moveEnd: "et glissez pour déplacer tous les éléments sélectionnés ensemble."
  },
  importHintTooltip: {
    title: "Importer des diagrammes",
    instructionStart: "Pour importer des diagrammes, cliquez sur le",
    menuButton: "bouton de menu",
    instructionMiddle: "(☰) dans le coin supérieur gauche, puis sélectionnez",
    openButton: "\"Ouvrir\"",
    instructionEnd: "pour charger vos fichiers de diagramme."
  },
  connectorRerouteTooltip: {
    title: "Astuce : Réacheminer les connecteurs",
    instructionStart: "Une fois vos connecteurs placés, vous pouvez les réacheminer comme vous le souhaitez.",
    instructionSelect: "Sélectionnez le connecteur",
    instructionMiddle: "d'abord, puis",
    instructionClick: "cliquez sur le chemin du connecteur",
    instructionAnd: "et",
    instructionDrag: "glissez",
    instructionEnd: "pour le modifier !"
  },
  settings: {
    zoom: {
      description: "Configurer le comportement du zoom lors de l'utilisation de la molette de la souris.",
      zoomToCursor: "Zoom sur le curseur",
      zoomToCursorDesc: "Lorsqu'il est activé, le zoom est centré sur la position du curseur de la souris. Lorsqu'il est désactivé, le zoom est centré sur le canevas."
    },
    hotkeys: {
      title: "Paramètres des raccourcis",
      profile: "Profil de raccourcis",
      profileQwerty: "QWERTY (Q, W, E, R, T, Y)",
      profileSmnrct: "SMNRCT (S, M, N, R, C, T)",
      profileNone: "Aucun raccourci",
      tool: "Outil",
      hotkey: "Raccourci",
      toolSelect: "Sélectionner",
      toolPan: "Déplacer",
      toolAddItem: "Ajouter un élément",
      toolRectangle: "Rectangle",
      toolConnector: "Connecteur",
      toolText: "Texte",
      note: "Remarque : Les raccourcis fonctionnent lorsque vous ne tapez pas dans des champs de texte"
    },
    pan: {
      title: "Paramètres de déplacement",
      mousePanOptions: "Options de déplacement à la souris",
      emptyAreaClickPan: "Cliquer et glisser sur une zone vide",
      middleClickPan: "Clic du milieu et glisser",
      rightClickPan: "Clic droit et glisser",
      ctrlClickPan: "Ctrl + clic et glisser",
      altClickPan: "Alt + clic et glisser",
      keyboardPanOptions: "Options de déplacement au clavier",
      arrowKeys: "Touches fléchées",
      wasdKeys: "Touches WASD",
      ijklKeys: "Touches IJKL",
      keyboardPanSpeed: "Vitesse de déplacement au clavier",
      note: "Remarque : Les options de déplacement fonctionnent en plus de l'outil de déplacement dédié"
    },
    connector: {
      title: "Paramètres des connecteurs",
      connectionMode: "Mode de création de connexion",
      clickMode: "Mode clic (Recommandé)",
      clickModeDesc: "Cliquez sur le premier nœud, puis cliquez sur le deuxième nœud pour créer une connexion",
      dragMode: "Mode glisser",
      dragModeDesc: "Cliquez et glissez du premier nœud au deuxième nœud",
      note: "Remarque : Vous pouvez modifier ce paramètre à tout moment. Le mode sélectionné sera utilisé lorsque l'outil de connecteur est actif."
    },
    iconPacks: {
      title: "Gestion des Packs d'Icônes",
      lazyLoading: "Activer le Chargement Paresseux",
      lazyLoadingDesc: "Charger les packs d'icônes à la demande pour un démarrage plus rapide",
      availablePacks: "Packs d'Icônes Disponibles",
      coreIsoflow: "Core Isoflow (Toujours Chargé)",
      alwaysEnabled: "Toujours activé",
      awsPack: "Icônes AWS",
      gcpPack: "Icônes Google Cloud",
      azurePack: "Icônes Azure",
      kubernetesPack: "Icônes Kubernetes",
      loading: "Chargement...",
      loaded: "Chargé",
      notLoaded: "Non chargé",
      iconCount: "{count} icônes",
      lazyLoadingDisabledNote: "Le chargement paresseux est désactivé. Tous les packs d'icônes sont chargés au démarrage.",
      note: "Les packs d'icônes peuvent être activés ou désactivés selon vos besoins. Les packs désactivés réduiront l'utilisation de la mémoire et amélioreront les performances."
    }
  },
  lazyLoadingWelcome: {
    title: "Nouvelle Fonctionnalité : Chargement Paresseux !",
    message: "Salut ! Suite à une forte demande, nous avons implémenté le Chargement Paresseux des icônes, donc maintenant si vous voulez activer des packs d'icônes non standard, vous pouvez les activer dans la section 'Configuration'.",
    configPath: "Cliquez sur l'icône Hamburger",
    configPath2: "en haut à gauche pour accéder à la Configuration.",
    canDisable: "Vous pouvez désactiver ce comportement si vous le souhaitez.",
    signature: "-Stan"
  }
};

export default locale;
