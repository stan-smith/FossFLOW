import React, { useCallback } from 'react';
import { Stack, Alert, IconButton as MUIIconButton, Box } from '@mui/material';
import { ControlsContainer } from 'src/components/ItemControls/components/ControlsContainer';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { Icon } from 'src/types';
import { Section } from 'src/components/ItemControls/components/Section';
import { Searchbox } from 'src/components/ItemControls/IconSelectionControls/Searchbox';
import { useIconFiltering } from 'src/hooks/useIconFiltering';
import { useIconCategories } from 'src/hooks/useIconCategories';
import { Close as CloseIcon } from '@mui/icons-material';
import { Icons } from './Icons';
import { IconGrid } from './IconGrid';

export const IconSelectionControls = () => {
  const uiStateActions = useUiStateStore((state) => {
    return state.actions;
  });
  const mode = useUiStateStore((state) => {
    return state.mode;
  });
  const { setFilter, filteredIcons, filter } = useIconFiltering();
  const { iconCategories } = useIconCategories();

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
            <Alert severity="info">
              You can drag and drop any item below onto the canvas.
            </Alert>
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
    </ControlsContainer>
  );
};
