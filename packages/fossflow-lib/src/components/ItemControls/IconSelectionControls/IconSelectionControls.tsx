import React, { useCallback, useRef, useState } from 'react';
import { Stack, Alert, IconButton as MUIIconButton, Box, Button, FormControlLabel, Checkbox, Typography } from '@mui/material';
import { ControlsContainer } from 'src/components/ItemControls/components/ControlsContainer';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { useModelStore } from 'src/stores/modelStore';
import { Icon } from 'src/types';
import { Section } from 'src/components/ItemControls/components/Section';
import { Searchbox } from 'src/components/ItemControls/IconSelectionControls/Searchbox';
import { useIconFiltering } from 'src/hooks/useIconFiltering';
import { useIconCategories } from 'src/hooks/useIconCategories';
import { Close as CloseIcon, FileUpload as FileUploadIcon } from '@mui/icons-material';
import { Icons } from './Icons';
import { IconGrid } from './IconGrid';
import { generateId } from 'src/utils';

export const IconSelectionControls = () => {
  const uiStateActions = useUiStateStore((state) => {
    return state.actions;
  });
  const mode = useUiStateStore((state) => {
    return state.mode;
  });
  const iconCategoriesState = useUiStateStore((state) => state.iconCategoriesState);
  const modelActions = useModelStore((state) => state.actions);
  const currentIcons = useModelStore((state) => state.icons);
  const { setFilter, filteredIcons, filter } = useIconFiltering();
  const { iconCategories } = useIconCategories();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [treatAsIsometric, setTreatAsIsometric] = useState(true);
  const [showAlert, setShowAlert] = useState(() => {
    // Check localStorage to see if user has dismissed the alert
    return localStorage.getItem('fossflow-show-drag-hint') !== 'false';
  });


  const onMouseDown = useCallback(
    (icon: Icon) => {
      if (mode.type !== 'PLACE_ICON') return;

      uiStateActions.setMode({
        type: 'PLACE_ICON',
        showCursor: true,
        id: icon.id
      });
    },
    [mode, uiStateActions]
  );

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const dismissAlert = useCallback(() => {
    setShowAlert(false);
    localStorage.setItem('fossflow-show-drag-hint', 'false');
  }, []);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newIcons: Icon[] = [];
    const existingNames = new Set(currentIcons.map(icon => icon.name.toLowerCase()));

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        console.warn(`Skipping non-image file: ${file.name}`);
        continue;
      }

      // Generate unique name
      let baseName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
      let finalName = baseName;
      let counter = 1;
      
      while (existingNames.has(finalName.toLowerCase())) {
        finalName = `${baseName}_${counter}`;
        counter++;
      }
      
      existingNames.add(finalName.toLowerCase());

      // Load and scale the image
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const originalDataUrl = e.target?.result as string;
          
          // For SVG files, use as-is since they scale naturally
          if (file.type === 'image/svg+xml') {
            resolve(originalDataUrl);
            return;
          }
          
          // For raster images, scale them to fit in a square bounding box
          const img = new Image();
          img.onload = () => {
            // Create canvas for scaling
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve(originalDataUrl); // Fallback to original
              return;
            }
            
            // Use a square target size for consistent display
            // This ensures all icons have the same bounding box
            const TARGET_SIZE = 128; // Square size for consistency
            
            // Calculate scaling to fit within square while maintaining aspect ratio
            // Remove the upper limit (1) to allow upscaling of small images
            const scale = Math.min(TARGET_SIZE / img.width, TARGET_SIZE / img.height);
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;
            
            // Set canvas to square size
            canvas.width = TARGET_SIZE;
            canvas.height = TARGET_SIZE;
            
            // Clear canvas with transparent background
            ctx.clearRect(0, 0, TARGET_SIZE, TARGET_SIZE);
            
            // Calculate position to center the image in the square
            const x = (TARGET_SIZE - scaledWidth) / 2;
            const y = (TARGET_SIZE - scaledHeight) / 2;
            
            // Enable image smoothing for better quality
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            // Draw scaled and centered image
            ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
            
            // Convert to data URL (using PNG for transparency)
            resolve(canvas.toDataURL('image/png'));
          };
          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = originalDataUrl;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      newIcons.push({
        id: generateId(),
        name: finalName,
        url: dataUrl,
        collection: 'imported',
        isIsometric: treatAsIsometric  // Use user's preference
      });
    }

    if (newIcons.length > 0) {
      // Add new icons to the model
      const updatedIcons = [...currentIcons, ...newIcons];
      modelActions.set({ icons: updatedIcons });
      
      // Update icon categories to include imported collection
      const hasImported = iconCategoriesState.some(cat => cat.id === 'imported');
      if (!hasImported) {
        uiStateActions.setIconCategoriesState([
          ...iconCategoriesState,
          { id: 'imported', isExpanded: true }
        ]);
      }
    }

    // Reset input
    event.target.value = '';
  }, [currentIcons, modelActions, iconCategoriesState, uiStateActions, treatAsIsometric]);

  return (
    <ControlsContainer
      header={
        <Section
          sx={{
            top: 0,
            pt: 6,
            pb: 3,
            position: 'relative',
            paddingTop: '32px'
          }}
        >
          {/* Close button */}
          <MUIIconButton
            aria-label="Close"
            onClick={() => {
              return uiStateActions.setItemControls(null);
            }}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 2,
              padding: 0,
              background: 'none'
            }}
            size="small"
          >
            <CloseIcon />
          </MUIIconButton>
          <Stack spacing={2}>
            <Box sx={{ marginTop: '8px' }}>
              <Searchbox value={filter} onChange={setFilter} />
            </Box>
          </Stack>
        </Section>
      }
    >
      {filteredIcons && (
        <Section>
          <IconGrid icons={filteredIcons} onMouseDown={onMouseDown} />
        </Section>
      )}
      {!filteredIcons && (
        <Icons iconCategories={iconCategories} onMouseDown={onMouseDown} />
      )}
      
      <Section>
        <Box sx={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: 1, 
          p: 1.5,
          backgroundColor: '#f5f5f5'
        }}>
          <Button
            variant="outlined"
            startIcon={<FileUploadIcon />}
            onClick={handleImportClick}
            fullWidth
          >
            Import Icons
          </Button>
          <FormControlLabel
            control={
              <Checkbox
                checked={treatAsIsometric}
                onChange={(e) => setTreatAsIsometric(e.target.checked)}
                size="small"
              />
            }
            label={
              <Typography variant="body2">
                Treat as isometric (3D view)
              </Typography>
            }
            sx={{ mt: 1, ml: 0 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            Uncheck for flat icons (logos, UI elements)
          </Typography>
        </Box>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
        
        {showAlert && (
          <Alert 
            severity="info" 
            onClose={dismissAlert}
            sx={{ cursor: 'pointer', mt: 1 }}
          >
            You can drag and drop any item below onto the canvas.
          </Alert>
        )}
      </Section>
    </ControlsContainer>
  );
};
