export type HotkeyProfile = 'qwerty' | 'smnrct' | 'none';
export interface HotkeyMapping {
    select: string | null;
    pan: string | null;
    addItem: string | null;
    rectangle: string | null;
    connector: string | null;
    text: string | null;
    lasso: string | null;
    freehandLasso: string | null;
}
export declare const HOTKEY_PROFILES: Record<HotkeyProfile, HotkeyMapping>;
export declare const DEFAULT_HOTKEY_PROFILE: HotkeyProfile;
