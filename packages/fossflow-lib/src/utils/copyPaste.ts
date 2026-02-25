import { ModelItem, ViewItem } from "src/standaloneExports";

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

type PastedObject = {
  viewItem: ViewItem;
  modelItem: ModelItem;
};

export const isPastedValid = (value: unknown): value is PastedObject[] => (
  Array.isArray(value) &&
  value.every(
    item =>
    typeof item === 'object' &&
    item !== null &&
    'viewItem' in item &&
    'modelItem' in item
  )
);