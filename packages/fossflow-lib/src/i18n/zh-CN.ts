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
  importHintTooltip: {
    title: "导入图表",
    instructionStart: "要导入图表，请点击左上角的",
    menuButton: "菜单按钮",
    instructionMiddle: "（☰），然后选择",
    openButton: "\"打开\"",
    instructionEnd: "来加载您的图表文件。"
  }
};

export default locale;
