import { LocaleProps } from '../types/isoflowProps';

const locale: LocaleProps = {
  common: {
    exampleText: "这是一段示例文本"
  },
  mainMenu: {
    undo: "撤销",
    redo: "重做", 
    open: "打开",
    exportJson: "导出为 JSON",
    exportCompactJson: "导出为紧凑 JSON",
    exportImage: "导出为图片",
    clearCanvas: "清空画布",
    settings: "设置",
    gitHub: "GitHub"
  },
  helpDialog: {
    title: "键盘快捷键和帮助",
    close: "关闭",
    keyboardShortcuts: "键盘快捷键",
    mouseInteractions: "鼠标交互",
    action: "操作",
    shortcut: "快捷键",
    method: "方法",
    description: "描述",
    note: "注意：",
    noteContent: "在输入框、文本区域或可编辑内容元素中键入时，键盘快捷键会被禁用，以防止冲突。",
    // Keyboard shortcuts
    undoAction: "撤销",
    undoDescription: "撤销上一个操作",
    redoAction: "重做",
    redoDescription: "重做上一个撤销的操作",
    redoAltAction: "重做（备选）",
    redoAltDescription: "备选重做快捷键",
    helpAction: "帮助",
    helpDescription: "打开包含键盘快捷键的帮助对话框",
    zoomInAction: "放大",
    zoomInShortcut: "鼠标滚轮向上",
    zoomInDescription: "放大画布",
    zoomOutAction: "缩小",
    zoomOutShortcut: "鼠标滚轮向下",
    zoomOutDescription: "缩小画布",
    panCanvasAction: "平移画布",
    panCanvasShortcut: "左键拖拽",
    panCanvasDescription: "在平移模式下移动画布",
    contextMenuAction: "上下文菜单",
    contextMenuShortcut: "右键点击",
    contextMenuDescription: "为项目或空白区域打开上下文菜单",
    // Mouse interactions
    selectToolAction: "选择工具",
    selectToolShortcut: "点击选择按钮",
    selectToolDescription: "切换到选择模式",
    panToolAction: "平移工具",
    panToolShortcut: "点击平移按钮",
    panToolDescription: "切换到平移模式以移动画布",
    addItemAction: "添加项目",
    addItemShortcut: "点击添加项目按钮",
    addItemDescription: "打开图标选择器以添加新项目",
    drawRectangleAction: "绘制矩形",
    drawRectangleShortcut: "点击矩形按钮",
    drawRectangleDescription: "切换到矩形绘制模式",
    createConnectorAction: "创建连接器",
    createConnectorShortcut: "点击连接器按钮",
    createConnectorDescription: "切换到连接器模式",
    addTextAction: "添加文本",
    addTextShortcut: "点击文本按钮",
    addTextDescription: "创建新的文本框"
  },
  connectorHintTooltip: {
    tipCreatingConnectors: "提示：创建连接器",
    tipConnectorTools: "提示：连接器工具",
    clickInstructionStart: "点击",
    clickInstructionMiddle: "第一个节点或点，然后",
    clickInstructionEnd: "第二个节点或点来创建连接。",
    nowClickTarget: "现在点击目标以完成连接。",
    dragStart: "拖拽",
    dragEnd: "从第一个节点到第二个节点来创建连接。",
    rerouteStart: "要重新规划连接器线路，请",
    rerouteMiddle: "左键点击",
    rerouteEnd: "连接器线上的任何点并拖拽以创建或移动锚点。"
  },
  lassoHintTooltip: {
    tipLasso: "提示：套索选择",
    tipFreehandLasso: "提示：自由套索选择",
    lassoDragStart: "点击并拖拽",
    lassoDragEnd: "以绘制矩形选择框来选中您想选择的项目。",
    freehandDragStart: "点击并拖拽",
    freehandDragMiddle: "以绘制",
    freehandDragEnd: "自由形状",
    freehandComplete: "围绕项目。释放以选择形状内的所有项目。",
    moveStart: "选择后，",
    moveMiddle: "在选择区域内点击",
    moveEnd: "并拖拽以一起移动所有选中的项目。"
  },
  importHintTooltip: {
    title: "导入图表",
    instructionStart: "要导入图表，请点击左上角的",
    menuButton: "菜单按钮",
    instructionMiddle: "（☰），然后选择",
    openButton: "\"打开\"",
    instructionEnd: "来加载您的图表文件。"
  },
  connectorRerouteTooltip: {
    title: "提示：重新规划连接器路径",
    instructionStart: "连接器放置后，您可以随意重新规划路径。",
    instructionSelect: "先选择连接器",
    instructionMiddle: "，然后",
    instructionClick: "点击连接器路径",
    instructionAnd: "并",
    instructionDrag: "拖拽",
    instructionEnd: "即可更改！"
  },
  settings: {
    zoom: {
      description: "配置使用鼠标滚轮时的缩放行为。",
      zoomToCursor: "光标缩放",
      zoomToCursorDesc: "启用时，以鼠标光标位置为中心进行缩放。禁用时，以画布中心进行缩放。"
    },
    hotkeys: {
      title: "快捷键设置",
      profile: "快捷键配置",
      profileQwerty: "QWERTY（Q、W、E、R、T、Y）",
      profileSmnrct: "SMNRCT（S、M、N、R、C、T）",
      profileNone: "无快捷键",
      tool: "工具",
      hotkey: "快捷键",
      toolSelect: "选择",
      toolPan: "平移",
      toolAddItem: "添加项目",
      toolRectangle: "矩形",
      toolConnector: "连接器",
      toolText: "文本",
      note: "注意：在文本输入框中输入时快捷键不生效"
    },
    pan: {
      title: "平移设置",
      mousePanOptions: "鼠标平移选项",
      emptyAreaClickPan: "点击并拖拽空白区域",
      middleClickPan: "中键点击并拖拽",
      rightClickPan: "右键点击并拖拽",
      ctrlClickPan: "Ctrl + 点击并拖拽",
      altClickPan: "Alt + 点击并拖拽",
      keyboardPanOptions: "键盘平移选项",
      arrowKeys: "方向键",
      wasdKeys: "WASD 键",
      ijklKeys: "IJKL 键",
      keyboardPanSpeed: "键盘平移速度",
      note: "注意：平移选项可与专用的平移工具一起使用"
    },
    connector: {
      title: "连接器设置",
      connectionMode: "连接创建模式",
      clickMode: "点击模式（推荐）",
      clickModeDesc: "先点击第一个节点，然后点击第二个节点来创建连接",
      dragMode: "拖拽模式",
      dragModeDesc: "从第一个节点点击并拖拽到第二个节点",
      note: "注意：您可以随时更改此设置。所选模式将在连接器工具激活时使用。"
    },
    iconPacks: {
      title: "图标包管理",
      lazyLoading: "启用延迟加载",
      lazyLoadingDesc: "按需加载图标包以加快启动速度",
      availablePacks: "可用图标包",
      coreIsoflow: "核心 Isoflow（始终加载）",
      alwaysEnabled: "始终启用",
      awsPack: "AWS 图标",
      gcpPack: "Google Cloud 图标",
      azurePack: "Azure 图标",
      kubernetesPack: "Kubernetes 图标",
      loading: "加载中...",
      loaded: "已加载",
      notLoaded: "未加载",
      iconCount: "{count} 个图标",
      lazyLoadingDisabledNote: "延迟加载已禁用。所有图标包将在启动时加载。",
      note: "可以根据需要启用或禁用图标包。禁用的图标包将减少内存使用并提高性能。"
    }
  },
  lazyLoadingWelcome: {
    title: "新功能：延迟加载！",
    message: "嘿！应大家的要求，我们实现了图标的延迟加载功能，现在如果您想启用非标准图标包，可以在「配置」部分中启用它们。",
    configPath: "点击左上角的汉堡菜单图标",
    configPath2: "以访问配置。",
    canDisable: "如果您愿意，可以禁用此行为。",
    signature: "-Stan"
  }
};

export default locale;
