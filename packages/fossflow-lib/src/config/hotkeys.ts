export type HotkeyProfile = 'qwerty' | 'smnrct' | 'none';

export interface HotkeyMapping {
  select: string | null;
  pan: string | null;
  addItem: string | null;
  rectangle: string | null;
  connector: string | null;
  text: string | null;
}

export const HOTKEY_PROFILES: Record<HotkeyProfile, HotkeyMapping> = {
  qwerty: {
    select: 'q',
    pan: 'w',
    addItem: 'e',
    rectangle: 'r',
    connector: 't',
    text: 'y'
  },
  smnrct: {
    select: 's',
    pan: 'm',
    addItem: 'n',
    rectangle: 'r',
    connector: 'c',
    text: 't'
  },
  none: {
    select: null,
    pan: null,
    addItem: null,
    rectangle: null,
    connector: null,
    text: null
  }
};

export const DEFAULT_HOTKEY_PROFILE: HotkeyProfile = 'smnrct';