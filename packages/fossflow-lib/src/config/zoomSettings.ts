export interface ZoomSettings {
  // Zoom behavior
  zoomToCursor: boolean;
  // Trackpad mode: scroll=pan, pinch=zoom
  trackpadMode: boolean;
}

export const DEFAULT_ZOOM_SETTINGS: ZoomSettings = {
  // Default to zoom-to-cursor for better UX
  zoomToCursor: true,
  // Default to mouse mode (scroll=zoom) for backwards compatibility
  trackpadMode: false
};
