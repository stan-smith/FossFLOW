import React from 'react';
import { Connector, connectorStyleOptions } from 'src/types';
import {
  Box,
  Slider,
  Select,
  MenuItem,
  TextField,
  IconButton as MUIIconButton
} from '@mui/material';
import { useConnector } from 'src/hooks/useConnector';
import { ColorSelector } from 'src/components/ColorSelector/ColorSelector';
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

  // If connector doesn't exist, return null
  if (!connector) {
    return null;
  }

  return (
    <ControlsContainer>
      <Box sx={{ position: 'relative', paddingTop: '24px' }}>
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
            label="Description"
            value={connector.description}
            onChange={(e) => {
              updateConnector(connector.id, {
                description: e.target.value as string
              });
            }}
          />
        </Section>
        <Section>
          <ColorSelector
            onChange={(color) => {
              return updateConnector(connector.id, { color });
            }}
            activeColor={connector.color}
          />
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
        <Section title="Style">
          <Select
            value={connector.style}
            onChange={(e) => {
              updateConnector(connector.id, {
                style: e.target.value as Connector['style']
              });
            }}
          >
            {Object.values(connectorStyleOptions).map((style) => {
              return <MenuItem value={style}>{style}</MenuItem>;
            })}
          </Select>
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
