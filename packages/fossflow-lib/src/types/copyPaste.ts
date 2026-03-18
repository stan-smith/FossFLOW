import { ModelItem, Rectangle, TextBox, ViewItem } from "src/standaloneExports";

export interface PastedItem {
  type: "ITEM";
  item: {
    viewItem: ViewItem;
    modelItem: ModelItem;
  }
}

export interface PastedRectangle {
  type: "RECTANGLE";
  item: Rectangle
}

export interface PastedTextBox {
  type: "TEXTBOX";
  item: TextBox
}

export type PastedObject = PastedItem | PastedRectangle | PastedTextBox; 