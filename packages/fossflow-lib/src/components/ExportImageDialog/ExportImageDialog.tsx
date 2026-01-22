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
  Slider,
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
import { useModelStore } from 'src/stores/modelStore';
import {
  exportAsImage,
  exportAsSVG,
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
  const containerRef = useRef<HTMLDivElement>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  const isExporting = useRef<boolean>(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Coords | null>(null);
  const currentView = useUiStateStore((state) => state.view);
  const [imageData, setImageData] = React.useState<string>();
  const [svgData, setSvgData] = useState<string>();
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

  // Scale/DPI state
  const [exportScale, setExportScale] = useState<number>(2);
  const [scaleMode, setScaleMode] = useState<'preset' | 'custom'>('preset');

  // DPI presets
  const dpiPresets = [
    { label: '1x (72 DPI)', value: 1 },
    { label: '2x (144 DPI)', value: 2 },
    { label: '3x (216 DPI)', value: 3 },
    { label: '4x (288 DPI)', value: 4 }
  ];

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

  const [transparentBackground, setTransparentBackground] = useState(false);

  const [backgroundColor, setBackgroundColor] = useState<string>(
    customVars.customPalette.diagramBg
  );

  const exportImage = useCallback(async () => {
    if (!containerRef.current || isExporting.current) {
      return;
    }

    isExporting.current = true;

    // Base size without scale (scale is applied via CSS transform)
    const containerSize = {
      width: bounds.width,
      height: bounds.height
    };

    const bgColor = transparentBackground ? 'transparent' : backgroundColor;

    try {
      // Export both PNG and SVG in parallel
      const [pngData, svgDataResult] = await Promise.all([
        exportAsImage(containerRef.current as HTMLDivElement, containerSize, exportScale, bgColor),
        exportAsSVG(containerRef.current as HTMLDivElement, containerSize, bgColor)
      ]);

      setImageData(pngData);
      setSvgData(svgDataResult);
      isExporting.current = false;
    } catch (err) {
      console.error(err);
      setExportError(true);
      isExporting.current = false;
    }
  }, [bounds, exportScale, transparentBackground, backgroundColor]);

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
      
      // Draw checkerboard if transparent background
      if (transparentBackground) {
        const squareSize = 10;
        for (let y = 0; y < canvas.height; y += squareSize) {
          for (let x = 0; x < canvas.width; x += squareSize) {
            ctx.fillStyle = (x / squareSize + y / squareSize) % 2 === 0 ? '#f0f0f0' : 'transparent';
            ctx.fillRect(x, y, squareSize, squareSize);
          }
        }
      }
      
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
  }, [imageData, isInCropMode, cropArea, transparentBackground]);

  const [showGrid, setShowGrid] = useState(false);
  const handleShowGridChange = (checked: boolean) => {
    setShowGrid(checked);
  };

  const [expandLabels, setExpandLabels] = useState(true);
  const handleExpandLabelsChange = (checked: boolean) => {
    setExpandLabels(checked);
  };

  const handleTransparentBackgroundChange = (checked: boolean) => {
    setTransparentBackground(checked);
    if (checked) {
      setBackgroundColor('transparent');
    } else {
      setBackgroundColor(customVars.customPalette.diagramBg);
    }
  };

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
      setSvgData(undefined);
      setExportError(false);
      isExporting.current = false;
      const timer = setTimeout(() => {
        exportImage();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [showGrid, backgroundColor, expandLabels, exportImage, cropToContent, exportScale, transparentBackground]);

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

  const downloadSvgFile = useCallback(async () => {
    if (!svgData) return;

    try {
      // Fetch the data URL as a blob to handle encoding properly
      const response = await fetch(svgData);
      const blob = await response.blob();
      downloadFileUtil(blob, generateGenericFilename('svg'));
    } catch (error) {
      console.error('SVG download failed:', error);
      setExportError(true);
    }
  }, [svgData]);

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
                    width: bounds.width,
                    height: bounds.height
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
                      objectFit: 'contain',
                      backgroundImage: transparentBackground ? 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)' : undefined,
                      backgroundSize: transparentBackground ? '20px 20px' : undefined,
                      backgroundPosition: transparentBackground ? '0 0, 0 10px, 10px -10px, -10px 0px' : undefined
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
                      disabled={transparentBackground}
                    />
                  }
                />

                <FormControlLabel
                  label="Transparent background"
                  control={
                    <Checkbox
                      size="small"
                      checked={transparentBackground}
                      onChange={(event) => {
                        handleTransparentBackgroundChange(event.target.checked);
                      }}
                    />
                  }
                />

                <Box sx={{ mt: 2, mb: 1 }}>
                  <Typography variant="caption" component="div" sx={{ mb: 1 }}>
                    Export Quality (DPI)
                  </Typography>

                  <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                    <Select
                      value={scaleMode === 'preset' ? exportScale : 'custom'}
                      onChange={(event) => {
                        const value = event.target.value;
                        if (value === 'custom') {
                          setScaleMode('custom');
                        } else {
                          setScaleMode('preset');
                          setExportScale(Number(value));
                        }
                      }}
                    >
                      {dpiPresets.map((preset) => (
                        <MenuItem key={preset.value} value={preset.value}>
                          {preset.label}
                        </MenuItem>
                      ))}
                      <MenuItem value="custom">Custom</MenuItem>
                    </Select>
                  </FormControl>

                  {scaleMode === 'custom' && (
                    <Box sx={{ px: 1 }}>
                      <Typography variant="caption" gutterBottom>
                        Scale: {exportScale.toFixed(1)}x ({(exportScale * 72).toFixed(0)} DPI)
                      </Typography>
                      <Slider
                        value={exportScale}
                        onChange={(_, value) => setExportScale(value as number)}
                        min={1}
                        max={5}
                        step={0.1}
                        marks={[
                          { value: 1, label: '1x' },
                          { value: 2, label: '2x' },
                          { value: 3, label: '3x' },
                          { value: 4, label: '4x' },
                          { value: 5, label: '5x' }
                        ]}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `${value.toFixed(1)}x`}
                      />
                    </Box>
                  )}
                </Box>
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
                    variant="outlined"
                    onClick={downloadSvgFile}
                    disabled={!svgData || (cropToContent && isInCropMode && !croppedImageData)}
                  >
                    Download as SVG
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