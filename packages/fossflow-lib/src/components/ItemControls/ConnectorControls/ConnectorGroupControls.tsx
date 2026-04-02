import React, { memo, useCallback } from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton as MUIIconButton,
  Collapse
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { useConnector } from 'src/hooks/useConnector';
import { useColor } from 'src/hooks/useColor';
import { getConnectorLabels } from 'src/utils';
import { ControlsContainer } from '../components/ControlsContainer';
import { ConnectorControls } from './ConnectorControls';
import { ConnectorGroupControls as ConnectorGroupControlsType } from 'src/types';

interface ConnectorPickerRowProps {
  connectorId: string;
  index: number;
  isFocused: boolean;
  onToggleFocus: (id: string) => void;
}

const ConnectorPickerRow = memo(function ConnectorPickerRow({
  connectorId,
  index,
  isFocused,
  onToggleFocus
}: ConnectorPickerRowProps) {
  const connector = useConnector(connectorId);
  const colorData = useColor(connector?.color);
  const labels = connector ? getConnectorLabels(connector) : [];

  const displayColor = connector?.customColor || colorData?.value || '#9e9e9e';
  const primaryText = labels[0]?.text || `Connector ${index + 1}`;
  const styleLabel =
    connector?.style === 'DASHED'
      ? 'Dashed'
      : connector?.style === 'DOTTED'
        ? 'Dotted'
        : 'Solid';

  const handleClick = useCallback(() => {
    onToggleFocus(connectorId);
  }, [connectorId, onToggleFocus]);

  return (
    <Box>
      <ListItemButton
        onClick={handleClick}
        sx={{
          borderLeft: isFocused ? '2px solid' : '2px solid transparent',
          borderLeftColor: isFocused ? 'primary.main' : 'transparent',
          pl: 1.5
        }}
      >
        <ListItemIcon sx={{ minWidth: 32 }}>
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              backgroundColor: displayColor
            }}
          />
        </ListItemIcon>
        <ListItemText
          primary={primaryText}
          secondary={styleLabel}
          primaryTypographyProps={{ variant: 'body2', noWrap: true }}
          secondaryTypographyProps={{ variant: 'caption' }}
        />
      </ListItemButton>
      <Collapse in={isFocused} timeout="auto" unmountOnExit>
        <Box sx={{ pl: 2, pr: 1, pb: 1 }}>
          <ConnectorControls id={connectorId} embedded />
        </Box>
      </Collapse>
    </Box>
  );
});

interface Props {
  controls: ConnectorGroupControlsType;
}

export const ConnectorGroupControls = memo(function ConnectorGroupControls({
  controls
}: Props) {
  const uiStateActions = useUiStateStore((state) => {
    return state.actions;
  });

  const handleClose = useCallback(() => {
    uiStateActions.setItemControls(null);
  }, [uiStateActions]);

  const handleToggleFocus = useCallback(
    (id: string) => {
      const newFocusedId = controls.focusedId === id ? null : id;
      uiStateActions.setItemControls({ ...controls, focusedId: newFocusedId });
    },
    [controls, uiStateActions]
  );

  if (controls.ids.length === 1) {
    return <ConnectorControls id={controls.ids[0]} />;
  }

  return (
    <ControlsContainer>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          pt: 2,
          pb: 1
        }}
      >
        <Typography variant="subtitle2" color="text.primary">
          {controls.ids.length} Connectors
        </Typography>
        <MUIIconButton size="small" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </MUIIconButton>
      </Box>
      <List dense disablePadding>
        {controls.ids.map((id, index) => (
          <ConnectorPickerRow
            key={id}
            connectorId={id}
            index={index}
            isFocused={controls.focusedId === id}
            onToggleFocus={handleToggleFocus}
          />
        ))}
      </List>
    </ControlsContainer>
  );
});
