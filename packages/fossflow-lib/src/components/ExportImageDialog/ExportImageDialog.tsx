import React, {
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useState
} from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Button,
  Stack,
  Alert,
  Checkbox,
  FormControlLabel,
  Typography,
  CircularProgress
} from '@mui/material';
import { useModelStore } from 'src/stores/modelStore';
import {
  exportAsImage,
  downloadFile as downloadFileUtil,
  base64ToBlob,
  generateGenericFilename,
  modelFromModelStore
} from 'src/utils';
import { ModelStore } from 'src/types';
import { useDiagramUtils } from 'src/hooks/useDiagramUtils';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { Isoflow } from 'src/Isoflow';
import { customVars } from 'src/styles/theme';
import { ColorPicker } from 'src/components/ColorSelector/ColorPicker';

interface Props {
  quality?: number;
  onClose: () => void;
}

// Configuration constants for the export process
const CONFIG = {
  STABLE_FRAMES: 2,                     // Number of frames to consider for stability
  TIMEOUT_MS: 3000,                     // Timeout for the entire export process
  IMG_TIMEOUT_MS: 2000,                 // Timeout for individual image loading
  DEBOUNCE_DELAY: 10,                   // Debounce delay for input changes
  PREVIEW_HEIGHT: 300,                  // Height of the preview area
  MIME_TYPE: 'image/png;charset=utf-8', // MIME type for the exported image
  DATA_URL_PREFIX_LEN: 22               // Length of 'data:image/png;base64,'
} as const;

/**
 * Wait until the hidden render container has "stabilized" (layout no longer changing,
 * images loaded) or timeout reached. This avoids guessing with setTimeout.
 *
 * The way Isoflow handles rendering and image loading may introduce specific timing
 * considerations that depends heavily on the available resources, so this function aims
 * to provide a reliable way to wait for the render process to stabilize before proceeding.
 */
const waitForRenderStable = async (
  el: HTMLElement,
  options: { stableFrames?: number; timeoutMs?: number } = {}
): Promise<boolean> => {
  const { stableFrames = 3, timeoutMs = 4000 } = options;

  try {
    // Wait for images inside (SVG <img> etc.)
    const imgs = Array.from(el.querySelectorAll('img')) as HTMLImageElement[];
    const imagePromises = imgs.map((img) => {
      if (img.complete && img.naturalWidth > 0) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        const timeoutId = setTimeout(() => {
          cleanup();
          resolve(); // Resolve even on timeout
        }, CONFIG.IMG_TIMEOUT_MS);

        const cleanup = () => {
          clearTimeout(timeoutId);
          img.removeEventListener('load', onLoad);
          img.removeEventListener('error', onError);
        };

        const onLoad = () => {
          cleanup();
          resolve();
        };

        const onError = () => {
          cleanup();
          resolve(); // Still resolve to not block the process
        };

        img.addEventListener('load', onLoad, { once: true });
        img.addEventListener('error', onError, { once: true });
      });
    });

    await Promise.all(imagePromises);

    // Wait for layout to stabilize
    let lastRect = el.getBoundingClientRect();
    let stableCount = 0;
    const start = performance.now();

    while (performance.now() - start < timeoutMs && stableCount < stableFrames) {
      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          // Double RAF for more reliable frame timing
          requestAnimationFrame(resolve);
        });
      });

      const rect = el.getBoundingClientRect();
      if (
        Math.abs(rect.width - lastRect.width) < 0.1 &&
        Math.abs(rect.height - lastRect.height) < 0.1 &&
        Math.abs(rect.top - lastRect.top) < 0.1 &&
        Math.abs(rect.left - lastRect.left) < 0.1
      ) {
        stableCount += 1;
      } else {
        stableCount = 0;
        lastRect = rect;
      }
    }

    return stableCount >= stableFrames;
  } catch (error) {
    console.warn('Error during render stabilization:', error);
    return false;
  }
};

type ExportState = 'idle' | 'exporting' | 'success' | 'error';

export const ExportImageDialog = ({ onClose, quality = 1.5 }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout>(null); // Color picker needs debouncing
  const exportRequestId = useRef(0);
  const currentView = useUiStateStore((state) => state.view);
  const [imageData, setImageData] = useState<string>();
  const [exportState, setExportState] = useState<ExportState>('idle');
  const [showGrid, setShowGrid] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState<string>(
    customVars.customPalette.diagramBg
  );

  const { getUnprojectedBounds } = useDiagramUtils();
  const uiStateActions = useUiStateStore((state) => state.actions);
  const model = useModelStore((state): Omit<ModelStore, 'actions'> => {
    return modelFromModelStore(state);
  });

  const unprojectedBounds = useMemo(() => {
    return getUnprojectedBounds();
  }, [getUnprojectedBounds]);

  useEffect(() => {
    uiStateActions.setMode({
      type: 'INTERACTIONS_DISABLED',
      showCursor: false
    });
  }, [uiStateActions]);

  const exportImage = useCallback(async () => {
    if (!containerRef.current) {
      // Defer to next tick, because container is still null.
      // In the next iteration, the container has a reference in any case.
      setTimeout(exportImage, 0);
      return;
    }

    const currentRequestId = ++exportRequestId.current;
    setExportState('exporting');

    try {
      // Wait for the container to stabilize
      const isStable = await waitForRenderStable(containerRef.current, {
        stableFrames: CONFIG.STABLE_FRAMES,
        timeoutMs: CONFIG.TIMEOUT_MS
      });

      if (exportRequestId.current !== currentRequestId) return; // Superseded

      if (!isStable) {
        console.warn('Render did not stabilize within timeout, proceeding anyway');
      }

      const data = await exportAsImage(containerRef.current);

      if (exportRequestId.current === currentRequestId) {
        setImageData(data);
        setExportState('success');
      }
    } catch (err) {
      if (exportRequestId.current === currentRequestId) {
        console.error('Export error:', err);
        setExportState('error');
      }
    }
  }, [containerRef]);

  const handleShowGridChange = useCallback((checked: boolean) => {
    setShowGrid(checked);
  }, []);

  const handleBackgroundColorChange = useCallback((color: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      setBackgroundColor(color);
    }, CONFIG.DEBOUNCE_DELAY);
  }, []);

  const downloadFile = useCallback(() => {
    if (!imageData) return;
    try {
      // Two times faster than using replace.
      const base64Data = imageData.substring(CONFIG.DATA_URL_PREFIX_LEN);
      const blob = base64ToBlob(base64Data, CONFIG.MIME_TYPE);
      downloadFileUtil(blob, generateGenericFilename('png'));
    } catch (error) {
      console.error('Download error:', error);
      setExportState('error');
    }
  }, [imageData]);

  useEffect(() => {
    setImageData(undefined);
    setExportState('idle');
    exportImage();
  }, [showGrid, backgroundColor, exportImage]);

  useEffect(() => {
    if (quality <= 0) {
      // Multiplication with 0 breaks the sizing.
      throw new Error('Invalid quality: value must be greater than 0');
    }

    // Cleanup debounce timer on unmount
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const isExporting = exportState === 'exporting';
  const hasError = exportState === 'error';

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: 400 }
      }}
    >
      <DialogTitle>Export as image</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Alert severity="info">
            <strong>
              Certain browsers may not support exporting images properly.
            </strong>{' '}
            <br />
            For best results, please use the latest version of either Chrome or
            Firefox.
          </Alert>

          {/* Hidden render container */}
          <Box
            sx={{
              position: 'absolute',
              width: 0,
              height: 0,
              overflow: 'hidden',
              pointerEvents: 'none'
            }}
            aria-hidden="true"
          >
            <Box
              ref={containerRef}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0
              }}
              style={{
                width: unprojectedBounds.width * quality,
                height: unprojectedBounds.height * quality
              }}
            >
              <Isoflow
                editorMode="NON_INTERACTIVE"
                initialData={{
                  ...model,
                  fitToView: true,
                  view: currentView
                }}
                renderer={{
                  showGrid,
                  backgroundColor
                }}
              />
            </Box>
          </Box>

          <Stack alignItems="center" spacing={2}>
            {/* Preview area */}
            <Box
              sx={{
                position: 'relative',
                minHeight: CONFIG.PREVIEW_HEIGHT,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: 'grey.50'
              }}
            >
              {isExporting && (
                <Stack alignItems="center" spacing={2}>
                  <CircularProgress size={40} />
                  <Typography variant="body2" color="text.secondary">
                    Generating preview...
                  </Typography>
                </Stack>
              )}

              {imageData && !isExporting && (
                <Box
                  component="img"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: CONFIG.PREVIEW_HEIGHT,
                    objectFit: 'contain'
                  }}
                  src={imageData}
                  alt="Export preview"
                />
              )}
            </Box>

            {/* Options */}
            <Box sx={{ width: '100%' }}>
              <Box component="fieldset" sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
                <Typography variant="subtitle2" component="legend" sx={{ px: 1 }}>
                  Export Options
                </Typography>

                {/* <Stack spacing={1}> */}
                <FormControlLabel
                  label="Show grid"
                  control={
                    <Checkbox
                      size="small"
                      checked={showGrid}
                      onChange={(event) => handleShowGridChange(event.target.checked)}
                      disabled={isExporting}
                    />
                  }
                />
                <FormControlLabel
                  label="Background color"
                  control={
                    <ColorPicker
                      value={backgroundColor}
                      onChange={handleBackgroundColorChange}
                      disabled={isExporting}
                    />
                  }
                />
                {/* </Stack> */}
              </Box>
            </Box>

            {/* Action buttons */}
            <Stack sx={{ width: '100%' }} alignItems="flex-end">
              <Stack direction="row" spacing={2}>
                <Button variant="outlined" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={downloadFile}
                  disabled={!imageData || isExporting}
                  startIcon={isExporting ? <CircularProgress size={16} /> : undefined}
                >
                  {isExporting ? 'Generating...' : 'Download PNG'}
                </Button>
              </Stack>
            </Stack>
          </Stack>

          {hasError && (
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={exportImage}>
                  Retry
                </Button>
              }
            >
              Could not export image. This might be due to browser limitations or content that cannot be captured.
            </Alert>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};