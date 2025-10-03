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
  Typography
} from '@mui/material';
import { useModelStore } from 'src/stores/modelStore';
import {
  exportAsImage,
  downloadFile as downloadFileUtil,
  base64ToBlob,
  generateGenericFilename,
  modelFromModelStore
} from 'src/utils';
import { ModelStore, Size, Coords } from 'src/types';
import { useDiagramUtils } from 'src/hooks/useDiagramUtils';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { Isoflow } from 'src/Isoflow';
import { Loader } from 'src/components/Loader/Loader';
import { customVars } from 'src/styles/theme';
import { ColorPicker } from 'src/components/ColorSelector/ColorPicker';

interface Props {
  quality?: number;
  onClose: () => void;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const ExportImageDialog = ({ onClose, quality = 1.5 }: Props) => {
  const containerRef = useRef<HTMLDivElement>();
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  const isExporting = useRef<boolean>(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Coords | null>(null);
  const currentView = useUiStateStore((state) => state.view);
  const [imageData, setImageData] = React.useState<string>();
  const [croppedImageData, setCroppedImageData] = useState<string>();
  const [exportError, setExportError] = useState(false);
  const { getUnprojectedBounds } = useDiagramUtils();
  const uiStateActions = useUiStateStore((state) => state.actions);
  const model = useModelStore((state): Omit<ModelStore, 'actions'> => {
    return modelFromModelStore(state);
  });

  // Crop states
  const [cropToContent, setCropToContent] = useState(false);
  const [cropArea, setCropArea] = useState<CropArea | null>(null);
  const [isInCropMode, setIsInCropMode] = useState(false);

  // Use original bounds for the base image
  const bounds = useMemo(() => {
    return getUnprojectedBounds();
  }, [getUnprojectedBounds]);

  useEffect(() => {
    uiStateActions.setMode({
      type: 'INTERACTIONS_DISABLED',
      showCursor: false
    });
  }, [uiStateActions]);

  const exportImage = useCallback(() => {
    if (!containerRef.current || isExporting.current) {
      return;
    }

    isExporting.current = true;
    
    const containerSize = {
      width: bounds.width * quality,
      height: bounds.height * quality
    };
    
    exportAsImage(containerRef.current as HTMLDivElement, containerSize)
      .then((data) => {
        setImageData(data);
        isExporting.current = false;
      })
      .catch((err) => {
        console.error(err);
        setExportError(true);
        isExporting.current = false;
      });
  }, [bounds, quality]);

  // Crop the image based on selected area
  const cropImage = useCallback((cropArea: CropArea, sourceImage: string) => {
    return new Promise<string>((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate the scaling factors between display canvas (500x300) and actual image
        const displayCanvas = cropCanvasRef.current;
        if (!displayCanvas) {
          reject(new Error('Display canvas not found'));
          return;
        }

        const scaleX = img.width / displayCanvas.width;
        const scaleY = img.height / displayCanvas.height;
        
        // Calculate the actual crop area in the source image coordinates
        const actualCropArea = {
          x: cropArea.x * scaleX,
          y: cropArea.y * scaleY,
          width: cropArea.width * scaleX,
          height: cropArea.height * scaleY
        };

        // Set canvas size to the actual crop dimensions
        canvas.width = actualCropArea.width;
        canvas.height = actualCropArea.height;

        if (ctx) {
          // Draw the cropped portion from the source image
          ctx.drawImage(
            img,
            actualCropArea.x, actualCropArea.y, actualCropArea.width, actualCropArea.height,
            0, 0, actualCropArea.width, actualCropArea.height
          );
          
          resolve(canvas.toDataURL('image/png'));
        } else {
          reject(new Error('Could not get canvas context'));
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = sourceImage;
    });
  }, []);

  // Handle crop area generation - only when not in crop mode (after applying)
  useEffect(() => {
    if (cropToContent && cropArea && imageData && !isInCropMode) {
      cropImage(cropArea, imageData)
        .then(setCroppedImageData)
        .catch(console.error);
    } else if (!cropToContent || !cropArea) {
      setCroppedImageData(undefined);
    }
  }, [cropArea, imageData, cropToContent, cropImage, isInCropMode]);

  // Mouse handlers for crop selection
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isInCropMode) return;
    
    e.preventDefault();
    const canvas = cropCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setDragStart({ x, y });
    setIsDragging(true);
    setCropArea(null);
  }, [isInCropMode]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !dragStart || !isInCropMode) return;
    
    e.preventDefault();
    const canvas = cropCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newCropArea: CropArea = {
      x: Math.min(dragStart.x, x),
      y: Math.min(dragStart.y, y),
      width: Math.abs(x - dragStart.x),
      height: Math.abs(y - dragStart.y)
    };

    setCropArea(newCropArea);
  }, [isDragging, dragStart, isInCropMode]);

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    
    e.preventDefault();
    setIsDragging(false);
    setDragStart(null);
  }, [isDragging]);

  // Add mouse leave handler to stop dragging when leaving canvas
  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  // Draw crop overlay
  useEffect(() => {
    const canvas = cropCanvasRef.current;
    if (!canvas || !imageData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Calculate scaling factors between canvas and actual image
      const scaleX = img.width / canvas.width;
      const scaleY = img.height / canvas.height;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the image scaled to fit canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Draw crop overlay if in crop mode
      if (isInCropMode) {
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Clear crop area and draw border only if there's a valid selection
        if (cropArea && cropArea.width > 5 && cropArea.height > 5) {
          // Clear the selected area (remove overlay)
          ctx.clearRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
          
          // Redraw the original image in the selected area
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Redraw the overlay everywhere except the selected area
          ctx.save();
          ctx.globalCompositeOperation = 'source-over';
          ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
          
          // Top area
          if (cropArea.y > 0) {
            ctx.fillRect(0, 0, canvas.width, cropArea.y);
          }
          // Bottom area
          if (cropArea.y + cropArea.height < canvas.height) {
            ctx.fillRect(0, cropArea.y + cropArea.height, canvas.width, canvas.height - (cropArea.y + cropArea.height));
          }
          // Left area
          if (cropArea.x > 0) {
            ctx.fillRect(0, cropArea.y, cropArea.x, cropArea.height);
          }
          // Right area
          if (cropArea.x + cropArea.width < canvas.width) {
            ctx.fillRect(cropArea.x + cropArea.width, cropArea.y, canvas.width - (cropArea.x + cropArea.width), cropArea.height);
          }
          
          ctx.restore();
          
          // Draw crop border
          ctx.strokeStyle = '#2196f3';
          ctx.lineWidth = 2;
          ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
        }
        
        // Add instruction text only when no selection or dragging
        if (!cropArea || cropArea.width <= 5 || cropArea.height <= 5) {
          ctx.fillStyle = 'white';
          ctx.font = '14px Arial';
          ctx.textAlign = 'left';
          ctx.fillText('Click and drag to select crop area', 10, 25);
        }
      }
    };
    
    img.src = imageData;
  }, [imageData, isInCropMode, cropArea]);

  const [showGrid, setShowGrid] = useState(false);
  const handleShowGridChange = (checked: boolean) => {
    setShowGrid(checked);
  };

  const [expandLabels, setExpandLabels] = useState(true);
  const handleExpandLabelsChange = (checked: boolean) => {
    setExpandLabels(checked);
  };

  const [backgroundColor, setBackgroundColor] = useState<string>(
    customVars.customPalette.diagramBg
  );
  const handleBackgroundColorChange = (color: string) => {
    setBackgroundColor(color);
  };

  const handleCropToContentChange = (checked: boolean) => {
    setCropToContent(checked);
    if (checked) {
      setIsInCropMode(true);
      setCropArea(null);
      setCroppedImageData(undefined);
      setIsDragging(false);
      setDragStart(null);
    } else {
      setIsInCropMode(false);
      setCropArea(null);
      setCroppedImageData(undefined);
      setIsDragging(false);
      setDragStart(null);
    }
  };

  const handleRecrop = () => {
    setIsInCropMode(true);
    setCropArea(null);
    setCroppedImageData(undefined);
    setIsDragging(false);
    setDragStart(null);
  };

  const handleAcceptCrop = () => {
    setIsInCropMode(false);
  };

  // Reset image data when non-crop options change
  useEffect(() => {
    if (!cropToContent) {
      setImageData(undefined);
      setExportError(false);
      isExporting.current = false;
      const timer = setTimeout(() => {
        exportImage();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [showGrid, backgroundColor, expandLabels, exportImage, cropToContent]);

  useEffect(() => {
    if (!imageData) {
      const timer = setTimeout(() => {
        exportImage();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [exportImage, imageData]);

  const downloadFile = useCallback(() => {
    const dataToDownload = croppedImageData || imageData;
    if (!dataToDownload) return;

    const data = base64ToBlob(
      dataToDownload.replace('data:image/png;base64,', ''),
      'image/png;charset=utf-8'
    );

    downloadFileUtil(data, generateGenericFilename('png'));
  }, [imageData, croppedImageData]);

  const displayImage = croppedImageData || imageData;

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Export as image</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Alert severity="info">
            <strong>
              Browser Compatibility Notice
            </strong>
            <br />
            For best results, please use Chrome or Edge. Firefox currently has 
            compatibility issues with the export feature.
          </Alert>

          {!imageData && (
            <>
              <Box
                sx={{
                  position: 'absolute',
                  width: 0,
                  height: 0,
                  overflow: 'hidden'
                }}
              >
                <Box
                  ref={containerRef}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0
                  }}
                  style={{
                    width: bounds.width * quality,
                    height: bounds.height * quality
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
                      backgroundColor,
                      expandLabels
                    }}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  position: 'relative',
                  top: 0,
                  left: 0,
                  width: 500,
                  height: 300,
                  bgcolor: 'common.white'
                }}
              >
                <Loader size={2} />
              </Box>
            </>
          )}
          <Stack alignItems="center" spacing={2}>
            {displayImage && (
              <Box sx={{ position: 'relative', maxWidth: '100%' }}>
                {cropToContent && !croppedImageData ? (
                  <Box>
                    <canvas
                      ref={cropCanvasRef}
                      width={500}
                      height={300}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '300px',
                        cursor: isInCropMode ? (isDragging ? 'grabbing' : 'crosshair') : 'default',
                        border: isInCropMode ? '2px solid #2196f3' : 'none',
                        userSelect: 'none'
                      }}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseLeave}
                      onContextMenu={(e) => e.preventDefault()}
                    />
                    {isInCropMode && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="primary">
                          Click and drag to select the area you want to export
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box
                    component="img"
                    sx={{
                      maxWidth: '100%',
                      maxHeight: '300px',
                      objectFit: 'contain'
                    }}
                    src={displayImage}
                    alt="preview"
                  />
                )}
              </Box>
            )}
            <Box sx={{ width: '100%' }}>
              <Box component="fieldset">
                <Typography variant="caption" component="legend">
                  Options
                </Typography>

                <FormControlLabel
                  label="Show grid"
                  control={
                    <Checkbox
                      size="small"
                      checked={showGrid}
                      onChange={(event) => {
                        handleShowGridChange(event.target.checked);
                      }}
                    />
                  }
                />
                <FormControlLabel
                  label="Expand descriptions"
                  control={
                    <Checkbox
                      size="small"
                      checked={expandLabels}
                      onChange={(event) => {
                        handleExpandLabelsChange(event.target.checked);
                      }}
                    />
                  }
                />
                <FormControlLabel
                  label="Crop to content"
                  control={
                    <Checkbox
                      size="small"
                      checked={cropToContent}
                      onChange={(event) => {
                        handleCropToContentChange(event.target.checked);
                      }}
                    />
                  }
                />
                <FormControlLabel
                  label="Background color"
                  control={
                    <ColorPicker
                      value={backgroundColor}
                      onChange={handleBackgroundColorChange}
                    />
                  }
                />
              </Box>

              {/* Crop controls */}
              {cropToContent && imageData && (
                <Box sx={{ mt: 2 }}>
                  {croppedImageData ? (
                    <Stack direction="row" spacing={1}>
                      <Button variant="outlined" size="small" onClick={handleRecrop}>
                        Recrop
                      </Button>
                      <Typography variant="caption" sx={{ alignSelf: 'center' }}>
                        Crop applied successfully
                      </Typography>
                    </Stack>
                  ) : cropArea ? (
                    <Stack direction="row" spacing={1}>
                      <Button variant="contained" size="small" onClick={handleAcceptCrop}>
                        Apply Crop
                      </Button>
                      <Button variant="outlined" size="small" onClick={() => setCropArea(null)}>
                        Clear Selection
                      </Button>
                    </Stack>
                  ) : isInCropMode ? (
                    <Typography variant="caption" color="text.secondary">
                      Select an area to crop, or uncheck "Crop to content" to use full image
                    </Typography>
                  ) : null}
                </Box>
              )}
            </Box>

            {displayImage && (
              <Stack sx={{ width: '100%' }} alignItems="flex-end">
                <Stack direction="row" spacing={2}>
                  <Button variant="text" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={downloadFile}
                    disabled={cropToContent && isInCropMode && !croppedImageData}
                  >
                    Download as PNG
                  </Button>
                </Stack>
              </Stack>
            )}
          </Stack>

          {exportError && (
            <Alert severity="error">Could not export image</Alert>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};