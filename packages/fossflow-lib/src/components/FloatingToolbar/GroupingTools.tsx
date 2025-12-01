import React, { useMemo } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { GroupAdd, GroupRemove } from '@mui/icons-material';
import { ItemReference } from 'src/types';
import { useScene } from 'src/hooks/useScene';
import { useTranslation } from 'src/stores/localeStore';
import { useSceneStore } from 'src/stores/sceneStore';
import { getGroupsForItems } from 'src/utils/grouping';
import { generateId } from 'src/utils';

interface Props {
  items: ItemReference[];
}

export const GroupingTools = ({ items }: Props) => {
  const scene = useScene();
  const groupsState = useSceneStore((state) => state.groups || {});
  const setSceneState = useSceneStore((state) => state.actions.set);
  const { t } = useTranslation();

  // Filter to only ITEM type for grouping
  const itemItems = useMemo(() => items.filter((item) => item.type === 'ITEM'), [items]);
  const itemIds = useMemo(() => itemItems.map((item) => item.id), [itemItems]);

  // Get current scene state
  const currentScene = useMemo(() => {
    return {
      connectors: {},
      textBoxes: {},
      groups: groupsState
    };
  }, [groupsState]);

  // Check if any selected items are in a group
  const groups = useMemo(() => {
    return getGroupsForItems(itemItems, currentScene);
  }, [itemItems, currentScene]);

  const handleGroup = () => {
    if (itemIds.length < 2) {
      return;
    }

    const groupId = generateId();
    const group = {
      id: groupId,
      name: `Group ${groupId.slice(0, 8)}`,
      itemIds: [...itemIds]
    };

    scene.transaction(() => {
      setSceneState({
        groups: {
          ...groupsState,
          [groupId]: group
        }
      }, false);
    });
  };

  const handleUngroup = () => {
    if (groups.length === 0) {
      return;
    }

    // Ungroup all groups containing selected items
    scene.transaction(() => {
      const currentGroups = { ...groupsState };
      groups.forEach((group) => {
        delete currentGroups[group.id];
      });
      setSceneState({ groups: currentGroups }, false);
    });
  };

  if (itemIds.length < 2 && groups.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 0.5,
        alignItems: 'center',
        borderRight: 1,
        borderColor: 'divider',
        pr: 1,
        mr: 1
      }}
    >
      {itemIds.length >= 2 && (
        <Tooltip title={t('floatingToolbar.group.create') || 'Group'}>
          <IconButton size="small" onClick={handleGroup}>
            <GroupAdd />
          </IconButton>
        </Tooltip>
      )}
      {groups.length > 0 && (
        <Tooltip title={t('floatingToolbar.group.ungroup') || 'Ungroup'}>
          <IconButton size="small" onClick={handleUngroup}>
            <GroupRemove />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

