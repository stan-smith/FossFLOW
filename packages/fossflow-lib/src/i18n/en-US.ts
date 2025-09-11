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
  importHintTooltip: {
    title: "Import Diagrams",
    instructionStart: "To import diagrams, click the",
    menuButton: "menu button",
    instructionMiddle: "(☰) in the top left corner, then select",
    openButton: "\"Open\"",
    instructionEnd: "to load your diagram files."
  }
};

export default locale;
