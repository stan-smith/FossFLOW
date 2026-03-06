import { useScene } from "src/hooks/useScene";
import { Coords } from "src/types";
import { CoordsUtils } from "./CoordsUtils";
import { findNearestUnoccupiedTile } from "./findNearestUnoccupiedTile";
import { PastedItem, PastedObject, PastedRectangle, PastedTextBox } from "src/types/copyPaste";

export const copyObject = async (obj: Object) => {
  await navigator.clipboard.writeText(JSON.stringify(obj));
}

export const getPastedObject = async () => {
  try {
    return JSON.parse(await navigator.clipboard.readText());
  } catch (error) {
    console.error(error)
  }
}

export const getTargetTileFunction = (firstPastedObject: PastedObject, mouseTile: Coords, scene: ReturnType<typeof useScene>) => 
    (currentItemTile: Coords) => {
      const { type, item } = firstPastedObject;
      const firstTile = type === "ITEM" ? 
        item.viewItem.tile 
        : 
        type === "RECTANGLE" ?
          item.from
          :
          item.tile;
      const tileDelta =  CoordsUtils.subtract(mouseTile, firstTile);
      return findNearestUnoccupiedTile(CoordsUtils.add(currentItemTile, tileDelta), scene) || { x: 0, y: 0 };
    }

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;
const isString = (value: unknown): value is string => typeof value === "string";
const isNumber = (value: unknown): value is number => typeof value === "number" && !Number.isNaN(value);

function isPoint(value: unknown): value is { x: number; y: number } {
  return (
    isObject(value) &&
    isNumber(value.x) &&
    isNumber(value.y)
  );
}

function isPastedItem(value: unknown): value is PastedItem {
  if (!isObject(value)) return false;

  const { type, item } = value;
  if ( type !== "ITEM" || !isObject(item) ) return false;
  
  const { modelItem, viewItem } = item;
  if ( !isObject(modelItem) || !isObject(viewItem) ) return false;

  return (
    isString(modelItem.name) &&
    (modelItem.description === undefined || isString(modelItem.description)) &&
    (modelItem.icon === undefined || isString(modelItem.icon))
  ) &&
  (  
    isPoint(viewItem.tile) &&
    (viewItem.labelHeight === undefined || isNumber(viewItem.labelHeight))
  );
}

function isPastedRectangle(value: unknown): value is PastedRectangle {
  if (!isObject(value)) return false;
  
  const { type, item } = value;
  if ( type !== "RECTANGLE") return false;

  return (
    isObject(item) &&
    isPoint(item.from) &&
    isPoint(item.to) &&
    (item.color === undefined || isString(item.color)) &&
    (item.customColor === undefined || isString(item.customColor))
  );
}

function isPastedTextBox(value: unknown): value is PastedTextBox {
  if (!isObject(value)) return false;

  const { type, item } = value;
  if ( type !== "TEXTBOX") return false;

  return (
    isObject(item) &&
    isPoint(item.tile) &&
    isString(item.content) &&
    (item.fontSize === undefined || isNumber(item.fontSize)) &&
    (item.orientation === undefined ||
      item.orientation === "X" ||
      item.orientation === "Y")
  );
}

export function isPastedValid(
  value: unknown
): value is PastedObject[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isPastedItem(item) ||
        isPastedRectangle(item) ||
        isPastedTextBox(item)
    )
  );
}