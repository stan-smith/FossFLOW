import { LocaleProps } from '../types/isoflowProps';

const locale: LocaleProps = {
  common: {
    exampleText: "Este é um texto de exemplo"
  },
  mainMenu: {
    undo: "Desfazer",
    redo: "Refazer",
    open: "Abrir",
    exportJson: "Exportar como JSON",
    exportCompactJson: "Exportar como JSON compacto",
    exportImage: "Exportar como imagem",
    clearCanvas: "Limpar a tela",
    settings: "Configurações",
    gitHub: "GitHub"
  },
  helpDialog: {
    title: "Atalhos de teclado e ajuda",
    close: "Fechar",
    keyboardShortcuts: "Atalhos de teclado",
    mouseInteractions: "Interações do mouse",
    action: "Ação",
    shortcut: "Atalho",
    method: "Método",
    description: "Descrição",
    note: "Nota:",
    noteContent: "Os atalhos de teclado são desabilitados ao digitar em campos de entrada, áreas de texto ou elementos editáveis para evitar conflitos.",
    // Keyboard shortcuts
    undoAction: "Desfazer",
    undoDescription: "Desfazer a última ação",
    redoAction: "Refazer",
    redoDescription: "Refazer a última ação desfeita",
    redoAltAction: "Refazer (Alternativo)",
    redoAltDescription: "Atalho alternativo para refazer",
    helpAction: "Ajuda",
    helpDescription: "Abrir diálogo de ajuda com atalhos de teclado",
    zoomInAction: "Aumentar zoom",
    zoomInShortcut: "Roda do mouse para cima",
    zoomInDescription: "Aumentar o zoom na tela",
    zoomOutAction: "Diminuir zoom",
    zoomOutShortcut: "Roda do mouse para baixo",
    zoomOutDescription: "Diminuir o zoom da tela",
    panCanvasAction: "Mover tela",
    panCanvasShortcut: "Clique esquerdo + Arrastar",
    panCanvasDescription: "Mover a tela no modo de movimentação",
    contextMenuAction: "Menu de contexto",
    contextMenuShortcut: "Clique direito",
    contextMenuDescription: "Abrir menu de contexto para itens ou espaço vazio",
    // Mouse interactions
    selectToolAction: "Ferramenta de seleção",
    selectToolShortcut: "Clique no botão Selecionar",
    selectToolDescription: "Mudar para o modo de seleção",
    panToolAction: "Ferramenta de movimentação",
    panToolShortcut: "Clique no botão Mover",
    panToolDescription: "Mudar para o modo de movimentação da tela",
    addItemAction: "Adicionar item",
    addItemShortcut: "Clique no botão Adicionar item",
    addItemDescription: "Abrir seletor de ícones para adicionar novos itens",
    drawRectangleAction: "Desenhar retângulo",
    drawRectangleShortcut: "Clique no botão Retângulo",
    drawRectangleDescription: "Mudar para o modo de desenho de retângulos",
    createConnectorAction: "Criar conector",
    createConnectorShortcut: "Clique no botão Conector",
    createConnectorDescription: "Mudar para o modo de conector",
    addTextAction: "Adicionar texto",
    addTextShortcut: "Clique no botão Texto",
    addTextDescription: "Criar uma nova caixa de texto"
  },
  connectorHintTooltip: {
    tipCreatingConnectors: "Dica: Criar conectores",
    tipConnectorTools: "Dica: Ferramentas de conectores",
    clickInstructionStart: "Clique",
    clickInstructionMiddle: "no primeiro nó ou ponto, depois",
    clickInstructionEnd: "no segundo nó ou ponto para criar uma conexão.",
    nowClickTarget: "Agora clique no alvo para completar a conexão.",
    dragStart: "Arraste",
    dragEnd: "do primeiro nó ao segundo nó para criar uma conexão.",
    rerouteStart: "Para redirecionar um conector,",
    rerouteMiddle: "clique com o botão esquerdo",
    rerouteEnd: "em qualquer ponto ao longo da linha do conector e arraste para criar ou mover pontos de ancoragem."
  },
  lassoHintTooltip: {
    tipLasso: "Dica: Seleção com laço",
    tipFreehandLasso: "Dica: Seleção com laço livre",
    lassoDragStart: "Clique e arraste",
    lassoDragEnd: "para desenhar uma caixa de seleção retangular ao redor dos itens que você deseja selecionar.",
    freehandDragStart: "Clique e arraste",
    freehandDragMiddle: "para desenhar uma",
    freehandDragEnd: "forma livre",
    freehandComplete: "ao redor dos itens. Solte para selecionar todos os itens dentro da forma.",
    moveStart: "Uma vez selecionados,",
    moveMiddle: "clique dentro da seleção",
    moveEnd: "e arraste para mover todos os itens selecionados juntos."
  },
  importHintTooltip: {
    title: "Importar diagramas",
    instructionStart: "Para importar diagramas, clique no",
    menuButton: "botão de menu",
    instructionMiddle: "(☰) no canto superior esquerdo, depois selecione",
    openButton: "\"Abrir\"",
    instructionEnd: "para carregar seus arquivos de diagrama."
  },
  connectorRerouteTooltip: {
    title: "Dica: Redirecionar conectores",
    instructionStart: "Uma vez que seus conectores estejam posicionados, você pode redirecioná-los como desejar.",
    instructionSelect: "Selecione o conector",
    instructionMiddle: "primeiro, depois",
    instructionClick: "clique no caminho do conector",
    instructionAnd: "e",
    instructionDrag: "arraste",
    instructionEnd: "para alterá-lo!"
  },
  settings: {
    zoom: {
      description: "Configurar o comportamento do zoom ao usar a roda do mouse.",
      zoomToCursor: "Zoom no cursor",
      zoomToCursorDesc: "Quando habilitado, o zoom é centralizado na posição do cursor do mouse. Quando desabilitado, o zoom é centralizado na tela."
    },
    hotkeys: {
      title: "Configurações de atalhos",
      profile: "Perfil de atalhos",
      profileQwerty: "QWERTY (Q, W, E, R, T, Y)",
      profileSmnrct: "SMNRCT (S, M, N, R, C, T)",
      profileNone: "Sem atalhos",
      tool: "Ferramenta",
      hotkey: "Atalho",
      toolSelect: "Selecionar",
      toolPan: "Mover",
      toolAddItem: "Adicionar item",
      toolRectangle: "Retângulo",
      toolConnector: "Conector",
      toolText: "Texto",
      note: "Nota: Os atalhos funcionam quando você não está digitando em campos de texto"
    },
    pan: {
      title: "Configurações de movimentação",
      mousePanOptions: "Opções de movimentação com mouse",
      emptyAreaClickPan: "Clicar e arrastar em área vazia",
      middleClickPan: "Clicar com o botão do meio e arrastar",
      rightClickPan: "Clicar com o botão direito e arrastar",
      ctrlClickPan: "Ctrl + clicar e arrastar",
      altClickPan: "Alt + clicar e arrastar",
      keyboardPanOptions: "Opções de movimentação com teclado",
      arrowKeys: "Teclas de seta",
      wasdKeys: "Teclas WASD",
      ijklKeys: "Teclas IJKL",
      keyboardPanSpeed: "Velocidade de movimentação com teclado",
      note: "Nota: As opções de movimentação funcionam além da ferramenta de movimentação dedicada"
    },
    connector: {
      title: "Configurações de conectores",
      connectionMode: "Modo de criação de conexão",
      clickMode: "Modo clique (Recomendado)",
      clickModeDesc: "Clique no primeiro nó, depois clique no segundo nó para criar uma conexão",
      dragMode: "Modo arrastar",
      dragModeDesc: "Clique e arraste do primeiro nó ao segundo nó",
      note: "Nota: Você pode alterar esta configuração a qualquer momento. O modo selecionado será usado quando a ferramenta de conector estiver ativa."
    },
    iconPacks: {
      title: "Gerenciamento de Pacotes de Ícones",
      lazyLoading: "Ativar Carregamento Sob Demanda",
      lazyLoadingDesc: "Carregar pacotes de ícones sob demanda para inicialização mais rápida",
      availablePacks: "Pacotes de Ícones Disponíveis",
      coreIsoflow: "Core Isoflow (Sempre Carregado)",
      alwaysEnabled: "Sempre ativado",
      awsPack: "Ícones AWS",
      gcpPack: "Ícones Google Cloud",
      azurePack: "Ícones Azure",
      kubernetesPack: "Ícones Kubernetes",
      loading: "Carregando...",
      loaded: "Carregado",
      notLoaded: "Não carregado",
      iconCount: "{count} ícones",
      lazyLoadingDisabledNote: "O carregamento sob demanda está desativado. Todos os pacotes de ícones são carregados na inicialização.",
      note: "Os pacotes de ícones podem ser ativados ou desativados conforme suas necessidades. Pacotes desativados reduzirão o uso de memória e melhorarão o desempenho."
    }
  },
  lazyLoadingWelcome: {
    title: "Novo Recurso: Carregamento Sob Demanda!",
    message: "Ei! Após demanda popular, implementamos o Carregamento Sob Demanda de ícones, então agora se você quiser ativar pacotes de ícones não padrão, você pode ativá-los na seção 'Configuração'.",
    configPath: "Clique no ícone do Menu",
    configPath2: "no canto superior esquerdo para acessar a Configuração.",
    canDisable: "Você pode desativar esse comportamento se desejar.",
    signature: "-Stan"
  }
};

export default locale;
