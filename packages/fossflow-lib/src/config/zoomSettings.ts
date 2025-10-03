export interface ZoomSettings {
  // Zoom behavior
  zoomToCursor: boolean;
}

export const DEFAULT_ZOOM_SETTINGS: ZoomSettings = {
  // Default to zoom-to-cursor for better UX
  zoomToCursor: true
};
