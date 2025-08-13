import chroma from 'chroma-js';
import { Icon, EditorModeEnum, Mode } from 'src/types';
import { v4 as uuid } from 'uuid';

export const generateId = () => {
  return uuid();
};

export const clamp = (num: number, min: number, max: number) => {
  return Math.max(Math.min(num, max), min);
};

export const getRandom = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const roundToOneDecimalPlace = (num: number) => {
  return Math.round(num * 10) / 10;
};

interface GetColorVariantOpts {
  alpha?: number;
  grade?: number;
}

export const getColorVariant = (
  color: string,
  variant: 'light' | 'dark',
  { alpha = 1, grade = 1 }: GetColorVariantOpts
) => {
  switch (variant) {
    case 'light':
      return chroma(color).brighten(grade).alpha(alpha).css();
    case 'dark':
      return chroma(color).darken(grade).saturate(grade).alpha(alpha).css();
    default:
      return chroma(color).alpha(alpha).css();
  }
};

export const setWindowCursor = (cursor: string) => {
  window.document.body.style.cursor = cursor;
};

export const toPx = (value: number | string) => {
  return `${value}px`;
};

export const categoriseIcons = (icons: Icon[]) => {
  const categories: { name?: string; icons: Icon[] }[] = [];

  icons.forEach((icon) => {
    const collection = categories.find((cat) => {
      return cat.name === icon.collection;
    });

    if (!collection) {
      categories.push({ name: icon.collection, icons: [icon] });
    } else {
      collection.icons.push(icon);
    }
  });

  return categories;
};

export const getStartingMode = (
  editorMode: keyof typeof EditorModeEnum
): Mode => {
  switch (editorMode) {
    case 'EDITABLE':
      return { type: 'CURSOR', showCursor: true, mousedownItem: null };
    case 'EXPLORABLE_READONLY':
      return { type: 'PAN', showCursor: false };
    case 'NON_INTERACTIVE':
      return { type: 'INTERACTIONS_DISABLED', showCursor: false };
    default:
      throw new Error('Invalid editor mode.');
  }
};

export function getItemByIdOrThrow<T extends { id: string }>(
  values: T[],
  id: string
): { value: T; index: number } {
  const index = values.findIndex((val) => {
    return val.id === id;
  });

  if (index === -1) {
    throw new Error(`Item with id "${id}" not found.`);
  }

  return { value: values[index], index };
}

export function getItemById<T extends { id: string }>(
  values: T[],
  id: string
): { value: T; index: number } | null {
  const index = values.findIndex((val) => {
    return val.id === id;
  });

  if (index === -1) {
    return null;
  }

  return { value: values[index], index };
}

export function getItemByIndexOrThrow<T>(items: T[], index: number): T {
  const item = items[index];

  if (!item) {
    throw new Error(`Item with index "${index}" not found.`);
  }

  return item;
}
