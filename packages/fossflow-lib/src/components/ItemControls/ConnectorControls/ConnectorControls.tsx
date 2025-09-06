import React, { useState } from 'react';
import { Connector, connectorStyleOptions, connectorLineTypeOptions } from 'src/types';
import {
  Box,
  Slider,
  Select,
  MenuItem,
  TextField,
  IconButton as MUIIconButton,
  FormControlLabel,
  Switch,
  Typography
} from '@mui/material';
import { useConnector } from 'src/hooks/useConnector';
import { ColorSelector } from 'src/components/ColorSelector/ColorSelector';
import { ColorPicker } from 'src/components/ColorSelector/ColorPicker';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { useScene } from 'src/hooks/useScene';
import { Close as CloseIcon } from '@mui/icons-material';
import { ControlsContainer } from '../components/ControlsContainer';
import { Section } from '../components/Section';
import { DeleteButton } from '../components/DeleteButton';

interface Props {
  id: string;
}

export const ConnectorControls = ({ id }: Props) => {
  const uiStateActions = useUiStateStore((state) => {
    return state.actions;
  });
  const connector = useConnector(id);
  const { updateConnector, deleteConnector } = useScene();
  const [useCustomColor, setUseCustomColor] = useState(!!connector?.customColor);

  // If connector doesn't exist, return null
  if (!connector) {
    return null;
  }

  return (
    <ControlsContainer>
      <Box sx={{ position: 'relative', paddingTop: '24px', paddingBottom: '24px' }}>
        {/* Close button */}
        <MUIIconButton
          aria-label="Close"
          onClick={() => {
            return uiStateActions.setItemControls(null);
          }}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 2
          }}
          size="small"
        >
          <CloseIcon />
        </MUIIconButton>
        <Section>
          <TextField
            label="Center Label (Description)"
            value={connector.description}
            onChange={(e) => {
              updateConnector(connector.id, {
                description: e.target.value as string
              });
            }}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Start Label"
            value={connector.startLabel || ''}
            onChange={(e) => {
              updateConnector(connector.id, {
                startLabel: e.target.value as string
              });
            }}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="End Label"
            value={connector.endLabel || ''}
            onChange={(e) => {
              updateConnector(connector.id, {
                endLabel: e.target.value as string
              });
            }}
            fullWidth
          />
        </Section>
        <Section title="Label Heights">
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">Start Label Height</Typography>
            <Slider
              marks
              step={10}
              min={-100}
              max={100}
              value={connector.startLabelHeight || 0}
              onChange={(e, value) => {
                updateConnector(connector.id, { startLabelHeight: value as number });
              }}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">Center Label Height</Typography>
            <Slider
              marks
              step={10}
              min={-100}
              max={100}
              value={connector.centerLabelHeight || 0}
              onChange={(e, value) => {
                updateConnector(connector.id, { centerLabelHeight: value as number });
              }}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">End Label Height</Typography>
            <Slider
              marks
              step={10}
              min={-100}
              max={100}
              value={connector.endLabelHeight || 0}
              onChange={(e, value) => {
                updateConnector(connector.id, { endLabelHeight: value as number });
              }}
            />
          </Box>
        </Section>
        <Section title="Color">
          <FormControlLabel
            control={
              <Switch
                checked={useCustomColor}
                onChange={(e) => {
                  setUseCustomColor(e.target.checked);
                  if (!e.target.checked) {
                    updateConnector(connector.id, { customColor: '' });
                  }
                }}
              />
            }
            label="Use Custom Color"
            sx={{ mb: 2 }}
          />
          {useCustomColor ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ColorPicker
                value={connector.customColor || '#000000'}
                onChange={(color) => {
                  updateConnector(connector.id, { customColor: color });
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {connector.customColor || '#000000'}
              </Typography>
            </Box>
          ) : (
            <ColorSelector
              onChange={(color) => {
                return updateConnector(connector.id, { color, customColor: '' });
              }}
              activeColor={connector.color}
            />
          )}
        </Section>
        <Section title="Width">
          <Slider
            marks
            step={10}
            min={10}
            max={30}
            value={connector.width}
            onChange={(e, newWidth) => {
              updateConnector(connector.id, { width: newWidth as number });
            }}
          />
        </Section>
        <Section title="Line Style">
          <Select
            value={connector.style || 'SOLID'}
            onChange={(e) => {
              updateConnector(connector.id, {
                style: e.target.value as Connector['style']
              });
            }}
            fullWidth
            sx={{ mb: 2 }}
          >
            {Object.values(connectorStyleOptions).map((style) => {
              return <MenuItem key={style} value={style}>{style}</MenuItem>;
            })}
          </Select>
        </Section>
        <Section title="Line Type">
          <Select
            value={connector.lineType || 'SINGLE'}
            onChange={(e) => {
              updateConnector(connector.id, {
                lineType: e.target.value as Connector['lineType']
              });
            }}
            fullWidth
          >
            {Object.values(connectorLineTypeOptions).map((type) => {
              const displayName = type === 'SINGLE' ? 'Single Line' : 
                                type === 'DOUBLE' ? 'Double Line' : 
                                'Double Line with Circle';
              return <MenuItem key={type} value={type}>{displayName}</MenuItem>;
            })}
          </Select>
        </Section>
        <Section>
          <FormControlLabel
            control={
              <Switch
                checked={connector.showArrow !== false}
                onChange={(e) => {
                  updateConnector(connector.id, {
                    showArrow: e.target.checked
                  });
                }}
              />
            }
            label="Show Arrow"
          />
        </Section>
        <Section>
          <Box>
            <DeleteButton
              onClick={() => {
                uiStateActions.setItemControls(null);
                deleteConnector(connector.id);
              }}
            />
          </Box>
        </Section>
      </Box>
    </ControlsContainer>
  );
};
