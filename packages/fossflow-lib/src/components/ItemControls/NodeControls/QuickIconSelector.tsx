import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Box, Stack, Typography, Divider, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { Icon } from 'src/types';
import { useModelStore } from 'src/stores/modelStore';
import { IconGrid } from '../IconSelectionControls/IconGrid';
import { Section } from '../components/Section';

interface Props {
  onIconSelected: (icon: Icon) => void;
  onClose?: () => void;
  currentIconId?: string;
}

// Store recently used icons in localStorage
const RECENT_ICONS_KEY = 'fossflow-recent-icons';
const MAX_RECENT_ICONS = 12;

const getRecentIcons = (): string[] => {
  try {
    const stored = localStorage.getItem(RECENT_ICONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const addToRecentIcons = (iconId: string) => {
  const recent = getRecentIcons();
  // Remove if already exists and add to front
  const filtered = recent.filter(id => id !== iconId);
  const updated = [iconId, ...filtered].slice(0, MAX_RECENT_ICONS);
  localStorage.setItem(RECENT_ICONS_KEY, JSON.stringify(updated));
};

export const QuickIconSelector = ({ onIconSelected, onClose, currentIconId }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  
  const icons = useModelStore((state) => state.icons);
  const items = useModelStore((state) => state.items);

  // Get recently used icons
  const recentIconIds = useMemo(() => getRecentIcons(), []);
  const recentIcons = useMemo(() => {
    return recentIconIds
      .map(id => icons.find(icon => icon.id === id))
      .filter(Boolean) as Icon[];
  }, [recentIconIds, icons]);

  // Get most commonly used icons in current diagram
  const commonIcons = useMemo(() => {
    const iconUsage = new Map<string, number>();
    
    // Count icon usage
    items.forEach(item => {
      if (item.icon) {
        iconUsage.set(item.icon, (iconUsage.get(item.icon) || 0) + 1);
      }
    });

    // Sort by usage and get top icons
    const sorted = Array.from(iconUsage.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([iconId]) => icons.find(icon => icon.id === iconId))
      .filter(Boolean) as Icon[];

    return sorted;
  }, [items, icons]);

  // Filter icons based on search
  const filteredIcons = useMemo(() => {
    if (!searchTerm) {
      // Show recent icons when no search
      if (recentIcons.length > 0) {
        return recentIcons;
      }
      // Show common icons if no recent
      if (commonIcons.length > 0) {
        return commonIcons;
      }
      // Show first 20 icons as fallback
      return icons.slice(0, 20);
    }

    const regex = new RegExp(searchTerm, 'gi');
    return icons.filter(icon => regex.test(icon.name));
  }, [searchTerm, icons, recentIcons, commonIcons]);

  // Focus search input on mount
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const itemsPerRow = 4; // Adjust based on your grid layout
      const totalItems = filteredIcons.length;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHoveredIndex(prev => 
            Math.min(prev + itemsPerRow, totalItems - 1)
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHoveredIndex(prev => 
            Math.max(prev - itemsPerRow, 0)
          );
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setHoveredIndex(prev => 
            prev > 0 ? prev - 1 : prev
          );
          break;
        case 'ArrowRight':
          e.preventDefault();
          setHoveredIndex(prev => 
            prev < totalItems - 1 ? prev + 1 : prev
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredIcons[hoveredIndex]) {
            handleIconSelect(filteredIcons[hoveredIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredIcons, hoveredIndex, onClose]);

  const handleIconSelect = useCallback((icon: Icon) => {
    addToRecentIcons(icon.id);
    onIconSelected(icon);
  }, [onIconSelected]);

  const handleIconDoubleClick = useCallback((icon: Icon) => {
    handleIconSelect(icon);
    onClose?.();
  }, [handleIconSelect, onClose]);

  return (
    <Box>
      <Section sx={{ py: 2 }}>
        <Stack spacing={2}>
          {/* Search Box */}
          <TextField
            ref={searchInputRef}
            fullWidth
            placeholder="Search icons (press Enter to select)"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setHoveredIndex(0); // Reset hover when searching
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            size="small"
            autoFocus
          />

          {/* Section Headers */}
          {!searchTerm && recentIcons.length > 0 && (
            <Typography variant="caption" color="text.secondary">
              RECENTLY USED
            </Typography>
          )}
          {!searchTerm && recentIcons.length === 0 && commonIcons.length > 0 && (
            <Typography variant="caption" color="text.secondary">
              COMMONLY USED IN THIS DIAGRAM
            </Typography>
          )}
          {searchTerm && (
            <Typography variant="caption" color="text.secondary">
              SEARCH RESULTS ({filteredIcons.length} icons)
            </Typography>
          )}
        </Stack>
      </Section>

      <Divider />

      {/* Icon Grid */}
      <Box ref={gridRef} sx={{ maxHeight: 400, overflowY: 'auto' }}>
        <IconGrid
          icons={filteredIcons}
          onClick={handleIconSelect}
          onDoubleClick={handleIconDoubleClick}
          hoveredIndex={hoveredIndex}
          onHover={setHoveredIndex}
        />
      </Box>

      {/* Help Text */}
      <Section sx={{ py: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Use arrow keys to navigate • Enter to select • Double-click to select and close
        </Typography>
      </Section>
    </Box>
  );
};