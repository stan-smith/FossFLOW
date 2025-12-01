import React, { useCallback, useRef, useEffect } from 'react';
import { Box, Paper } from '@mui/material';
import { Coords } from 'src/types';
import { useModelItem } from 'src/hooks/useModelItem';
import { useScene } from 'src/hooks/useScene';
import { useViewItem } from 'src/hooks/useViewItem';
import { CommentEditor } from './CommentEditor';
import { ItemConfigurationPanel } from './ItemConfigurationPanel';

interface Props {
  itemId: string;
  position: Coords;
  anchorEl?: HTMLElement;
  onClose: () => void;
}

const ItemConfigurationPanelWrapper = ({ itemId, onClose }: { itemId: string; onClose: () => void }) => {
  const viewItem = useViewItem(itemId);
  
  if (!viewItem) {
    return null;
  }

  return <ItemConfigurationPanel itemId={itemId} viewItem={viewItem} onClose={onClose} />;
};

export const EnhancedContextMenu = ({
  itemId,
  position,
  anchorEl,
  onClose
}: Props) => {
  const modelItem = useModelItem(itemId);
  const { updateModelItem } = useScene();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleCommentChange = useCallback(
    (value: string) => {
      if (modelItem && modelItem.description !== value) {
        updateModelItem(itemId, { description: value });
      }
    },
    [itemId, modelItem, updateModelItem]
  );

  const handleCommentDone = useCallback(() => {
    // Comment is already saved via onChange, just close
    onClose();
  }, [onClose]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        anchorEl &&
        !anchorEl.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    // Add event listener after a short delay to avoid immediate close
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [anchorEl, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (!modelItem) {
    return null;
  }

  // Calculate position to avoid going off-screen
  const [adjustedX, adjustedY] = (() => {
    const menuWidth = 400; // Approximate width
    const menuHeight = 600; // Approximate max height
    const padding = 10;

    let x = position.x;
    let y = position.y;

    // Check right edge
    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - padding;
    }

    // Check left edge
    if (x < padding) {
      x = padding;
    }

    // Check bottom edge
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - padding;
    }

    // Check top edge
    if (y < padding) {
      y = padding;
    }

    return [x, y];
  })();

  return (
    <Paper
      ref={menuRef}
      elevation={8}
      sx={{
        position: 'fixed',
        left: adjustedX,
        top: adjustedY,
        width: 400,
        maxHeight: 600,
        zIndex: 1300,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <CommentEditor
        value={modelItem.description}
        onChange={handleCommentChange}
        onDone={handleCommentDone}
        itemName={modelItem.name}
      />
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <ItemConfigurationPanelWrapper itemId={itemId} onClose={onClose} />
      </Box>
    </Paper>
  );
};

