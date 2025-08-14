export interface PanSettings {
  // Mouse pan options
  middleClickPan: boolean;
  rightClickPan: boolean;
  ctrlClickPan: boolean;
  altClickPan: boolean;
  emptyAreaClickPan: boolean;
  
  // Keyboard pan options
  arrowKeysPan: boolean;
  wasdPan: boolean;
  ijklPan: boolean;
  
  // Pan speed
  keyboardPanSpeed: number;
}

export const DEFAULT_PAN_SETTINGS: PanSettings = {
  // Mouse options - start with common defaults
  middleClickPan: true,
  rightClickPan: false,
  ctrlClickPan: false,
  altClickPan: false,
  emptyAreaClickPan: true,
  
  // Keyboard options
  arrowKeysPan: true,
  wasdPan: false,
  ijklPan: false,
  
  // Pan speed (pixels per key press)
  keyboardPanSpeed: 20
};