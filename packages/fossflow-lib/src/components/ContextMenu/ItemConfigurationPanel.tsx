import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Stack,
  Typography,
  TextField,
  IconButton,
  Chip,
  Slider,
  Button,
  Divider
} from '@mui/material';
import {
  Link as LinkIcon,
  ContentCopy as CopyIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { ModelItem, ViewItem, Icon } from 'src/types';
import { useModelItem } from 'src/hooks/useModelItem';
import { useIcon } from 'src/hooks/useIcon';
import { useModelStore } from 'src/stores/modelStore';
import { useScene } from 'src/hooks/useScene';
import { generateId } from 'src/utils';
import { QuickIconSelector } from '../ItemControls/NodeControls/QuickIconSelector';
import { Section } from '../ItemControls/components/Section';

interface Props {
  itemId: string;
  viewItem: ViewItem;
  onClose: () => void;
}

export const ItemConfigurationPanel = ({ itemId, viewItem, onClose }: Props) => {
  const modelItem = useModelItem(itemId);
  const { icon, iconComponent } = useIcon(modelItem?.icon);
  const scene = useScene();
  const { updateModelItem, updateViewItem, deleteViewItem } = scene;
  const modelActions = useModelStore((state) => state.actions);
  const icons = useModelStore((state) => state.icons);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newPropertyKey, setNewPropertyKey] = useState('');
  const [newPropertyValue, setNewPropertyValue] = useState('');

  const tags = modelItem?.tags ?? [];
  const customProperties = modelItem?.customProperties ?? {};
  const currentIcon = icons.find((i: Icon) => i.id === modelItem?.icon);
  const [localScale, setLocalScale] = useState(currentIcon?.scale || 1);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newName = e.target.value;
      if (modelItem && modelItem.name !== newName) {
        updateModelItem(itemId, { name: newName });
      }
    },
    [itemId, modelItem, updateModelItem]
  );

  const handleIconSelected = useCallback(
    (selectedIcon: Icon) => {
      updateModelItem(itemId, { icon: selectedIcon.id });
      setShowIconSelector(false);
    },
    [itemId, updateModelItem]
  );

  const handleAddTag = useCallback(() => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      updateModelItem(itemId, { tags: updatedTags });
      setNewTag('');
    }
  }, [newTag, tags, itemId, updateModelItem]);

  const handleRemoveTag = useCallback(
    (tagToRemove: string) => {
      const updatedTags = tags.filter((tag) => tag !== tagToRemove);
      updateModelItem(itemId, { tags: updatedTags });
    },
    [tags, itemId, updateModelItem]
  );

  const handleAddProperty = useCallback(() => {
    if (newPropertyKey.trim() && !customProperties[newPropertyKey.trim()]) {
      const updatedProperties = {
        ...customProperties,
        [newPropertyKey.trim()]: newPropertyValue.trim()
      };
      updateModelItem(itemId, { customProperties: updatedProperties });
      setNewPropertyKey('');
      setNewPropertyValue('');
    }
  }, [newPropertyKey, newPropertyValue, customProperties, itemId, updateModelItem]);

  const handleRemoveProperty = useCallback(
    (keyToRemove: string) => {
      const updatedProperties = { ...customProperties };
      delete updatedProperties[keyToRemove];
      updateModelItem(itemId, { customProperties: updatedProperties });
    },
    [customProperties, itemId, updateModelItem]
  );

  const handleUpdateProperty = useCallback(
    (key: string, value: string) => {
      const updatedProperties = {
        ...customProperties,
        [key]: value
      };
      updateModelItem(itemId, { customProperties: updatedProperties });
    },
    [customProperties, itemId, updateModelItem]
  );

  const handleIconScaleChange = useCallback(
    (e: Event, newScale: number | number[]) => {
      const scale = newScale as number;
      setLocalScale(scale);
      const updatedIcons = icons.map((i: Icon) =>
        i.id === modelItem?.icon ? { ...i, scale } : i
      );
      modelActions.set({ icons: updatedIcons });
    },
    [icons, modelItem?.icon, modelActions]
  );

  const handleLabelHeightChange = useCallback(
    (e: Event, newHeight: number | number[]) => {
      const labelHeight = newHeight as number;
      updateViewItem(itemId, { labelHeight });
    },
    [itemId, updateViewItem]
  );

  const handleCopy = useCallback(() => {
    if (!modelItem) return;

    const newModelItemId = generateId();
    const newViewItemId = generateId();

    // Create new item at offset position
    scene.placeIcon({
      modelItem: {
        ...modelItem,
        id: newModelItemId,
        name: `${modelItem.name} (Copy)`
      },
      viewItem: {
        ...viewItem,
        id: newViewItemId,
        tile: { x: viewItem.tile.x + 1, y: viewItem.tile.y + 1 }
      }
    });
    onClose();
  }, [modelItem, viewItem, scene, onClose]);

  const handleDelete = useCallback(() => {
    deleteViewItem(itemId);
    onClose();
  }, [itemId, deleteViewItem, onClose]);

  const handleLink = useCallback(() => {
    // Placeholder for link functionality - could open connector mode
    // For now, just a no-op
  }, []);

  if (!modelItem) {
    return null;
  }

  if (showIconSelector) {
    return (
      <Box sx={{ bgcolor: 'background.paper', maxHeight: 600, overflowY: 'auto' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Select Icon</Typography>
            <IconButton onClick={() => setShowIconSelector(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>
        <QuickIconSelector
          currentIconId={modelItem.icon}
          onIconSelected={handleIconSelected}
          onClose={() => setShowIconSelector(false)}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.paper', maxHeight: 600, overflowY: 'auto' }}>
      {/* Item Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50'
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Icon */}
          <Box
            sx={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.200',
              borderRadius: 1
            }}
          >
            {iconComponent ? (
              <Box sx={{ width: 32, height: 32 }}>{iconComponent}</Box>
            ) : (
              <Typography variant="caption" color="text.secondary">
                No Icon
              </Typography>
            )}
          </Box>

          {/* Name Badge */}
          <Box
            sx={{
              flex: 1,
              bgcolor: 'grey.300',
              borderRadius: 1,
              px: 1.5,
              py: 0.5
            }}
          >
            <Typography variant="body2" fontWeight={600}>
              {modelItem.name || 'Untitled'}
            </Typography>
          </Box>

          {/* Action Icons */}
          <Stack direction="row" spacing={0.5}>
            <IconButton size="small" onClick={handleLink} title="Link">
              <LinkIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleCopy} title="Copy">
              <CopyIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleDelete} title="Delete" color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      {/* Configuration Sections */}
      <Section title="Name">
        <TextField
          fullWidth
          value={modelItem.name}
          onChange={handleNameChange}
          size="small"
        />
      </Section>

      <Section title="Icon">
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 60,
              height: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.100',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            {iconComponent ? (
              <Box sx={{ width: 50, height: 50 }}>{iconComponent}</Box>
            ) : (
              <Typography variant="caption" color="text.secondary">
                No Icon
              </Typography>
            )}
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setShowIconSelector(true)}
          >
            Change Icon
          </Button>
        </Stack>
      </Section>

      <Section title="Tags">
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                onDelete={() => handleRemoveTag(tag)}
              />
            ))}
          </Stack>
          <Stack direction="row" spacing={1}>
            <TextField
              size="small"
              placeholder="Add tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddTag();
                }
              }}
              sx={{ flex: 1 }}
            />
            <IconButton size="small" onClick={handleAddTag} disabled={!newTag.trim()}>
              <AddIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Section>

      <Section title="Custom Properties">
        <Stack spacing={1}>
          {Object.entries(customProperties).map(([key, value]) => (
            <Stack key={key} direction="row" spacing={1} alignItems="center">
              <TextField
                size="small"
                value={key}
                label="Key"
                disabled
                sx={{ flex: 1 }}
              />
              <TextField
                size="small"
                value={value}
                label="Value"
                onChange={(e) => handleUpdateProperty(key, e.target.value)}
                sx={{ flex: 1 }}
              />
              <IconButton
                size="small"
                onClick={() => handleRemoveProperty(key)}
                color="error"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          ))}
          <Stack direction="row" spacing={1}>
            <TextField
              size="small"
              placeholder="Property key"
              value={newPropertyKey}
              onChange={(e) => setNewPropertyKey(e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              size="small"
              placeholder="Property value"
              value={newPropertyValue}
              onChange={(e) => setNewPropertyValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddProperty();
                }
              }}
              sx={{ flex: 1 }}
            />
            <IconButton
              size="small"
              onClick={handleAddProperty}
              disabled={!newPropertyKey.trim()}
            >
              <AddIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Section>

      <Divider />

      <Section title="Icon Size">
        <Slider
          marks
          step={0.1}
          min={0.3}
          max={2.5}
          value={localScale}
          onChange={handleIconScaleChange}
        />
      </Section>

      <Section title="Label Height">
        <Slider
          marks
          step={20}
          min={60}
          max={280}
          value={viewItem.labelHeight ?? 120}
          onChange={handleLabelHeightChange}
        />
      </Section>
    </Box>
  );
};

