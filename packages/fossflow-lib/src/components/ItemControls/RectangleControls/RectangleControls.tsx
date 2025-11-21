import React, { useState } from 'react';
import { Box, IconButton as MUIIconButton, FormControlLabel, Switch, Typography } from '@mui/material';
import { useRectangle } from 'src/hooks/useRectangle';
import { ColorSelector } from 'src/components/ColorSelector/ColorSelector';
import { ColorPicker } from 'src/components/ColorSelector/ColorPicker';
import { CustomColorInput } from 'src/components/ColorSelector/CustomColorInput';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { useScene } from 'src/hooks/useScene';
import { Close as CloseIcon } from '@mui/icons-material';
import { ControlsContainer } from '../components/ControlsContainer';
import { Section } from '../components/Section';
import { DeleteButton } from '../components/DeleteButton';

interface Props {
  id: string;
}

export const RectangleControls = ({ id }: Props) => {
  const uiStateActions = useUiStateStore((state) => {
    return state.actions;
  });
  const rectangle = useRectangle(id);
  const { updateRectangle, deleteRectangle } = useScene();
  const [useCustomColor, setUseCustomColor] = useState(!!rectangle?.customColor);

  // If rectangle doesn't exist, return null
  if (!rectangle) {
    return null;
  }

  return (
    <ControlsContainer>
      <Box sx={{ position: 'relative' }}>
        {/* Close button */}
        <MUIIconButton
          aria-label="Close"
          onClick={() => {
            return uiStateActions.setItemControls(null);
          }}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2
          }}
          size="small"
        >
          <CloseIcon />
        </MUIIconButton>
        <Section title="Color">
          <FormControlLabel
            control={
              <Switch
                checked={useCustomColor}
                onChange={(e) => {
                  setUseCustomColor(e.target.checked);
                  if (!e.target.checked) {
                    updateRectangle(rectangle.id, { customColor: '' });
                  }
                }}
              />
            }
            label="Use Custom Color"
            sx={{ mb: 2 }}
          />
          {useCustomColor ? (
            <CustomColorInput
              value={rectangle.customColor || '#000000'}
              onChange={(color) => {
                updateRectangle(rectangle.id, { customColor: color });
              }}
            />
          ) : (
            <ColorSelector
              onChange={(color) => {
                updateRectangle(rectangle.id, { color, customColor: '' });
              }}
              activeColor={rectangle.color}
            />
          )}
        </Section>
        <Section>
          <Box>
            <DeleteButton
              onClick={() => {
                uiStateActions.setItemControls(null);
                deleteRectangle(rectangle.id);
              }}
            />
          </Box>
        </Section>
      </Box>
    </ControlsContainer>
  );
};
