export interface LabelSettings {
  expandButtonPadding: number; // Padding in theme units when expand button is visible
  backgroundOpacity: number; // Background opacity (0-1), default 1.0
}

export const DEFAULT_LABEL_SETTINGS: LabelSettings = {
  expandButtonPadding: 0, // Default 0 theme units (no extra padding)
  backgroundOpacity: 1.0 // Default fully opaque
};
