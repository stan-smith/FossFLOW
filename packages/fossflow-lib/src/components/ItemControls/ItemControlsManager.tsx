import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { IconSelectionControls } from 'src/components/ItemControls/IconSelectionControls/IconSelectionControls';
import { NodeControls } from './NodeControls/NodeControls';
import { ConnectorControls } from './ConnectorControls/ConnectorControls';
import { TextBoxControls } from './TextBoxControls/TextBoxControls';
import { RectangleControls } from './RectangleControls/RectangleControls';

export const ItemControlsManager = () => {
  const itemControls = useUiStateStore((state) => {
    return state.itemControls;
  });

  const Controls = useMemo(() => {
    switch (itemControls?.type) {
      case 'ITEM':
        return <NodeControls key={itemControls.id} id={itemControls.id} />;
      case 'CONNECTOR':
        return <ConnectorControls key={itemControls.id} id={itemControls.id} />;
      case 'TEXTBOX':
        return <TextBoxControls key={itemControls.id} id={itemControls.id} />;
      case 'RECTANGLE':
        return <RectangleControls key={itemControls.id} id={itemControls.id} />;
      case 'ADD_ITEM':
        return <IconSelectionControls />;
      default:
        return null;
    }
  }, [itemControls]);

  return (
    <Box
      sx={{
        width: '100%'
      }}
    >
      {Controls}
    </Box>
  );
};
