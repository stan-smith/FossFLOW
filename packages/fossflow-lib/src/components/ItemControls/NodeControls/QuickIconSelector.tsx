import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Box, Stack, Typography, Divider, TextField, InputAdornment, Alert } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { Icon } from 'src/types';
import { useModelStore } from 'src/stores/modelStore';
import { useIconCategories } from 'src/hooks/useIconCategories';
import { IconGrid } from '../IconSelectionControls/IconGrid';
import { Icons } from '../IconSelectionControls/Icons';
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

// Escape special regex characters
const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const QuickIconSelector = ({ onIconSelected, onClose, currentIconId }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const icons = useModelStore((state) => state.icons);
  const { iconCategories } = useIconCategories();

  // Get recently used icons
  const recentIconIds = useMemo(() => getRecentIcons(), []);
  const recentIcons = useMemo(() => {
    return recentIconIds
      .map(id => icons.find(icon => icon.id === id))
      .filter(Boolean) as Icon[];
  }, [recentIconIds, icons]);

  // Filter icons based on search
  const filteredIcons = useMemo(() => {
    if (!searchTerm) return null;
    
    try {
      // Escape special regex characters to prevent errors
      const escapedSearch = escapeRegex(searchTerm);
      const regex = new RegExp(escapedSearch, 'gi');
      return icons.filter(icon => regex.test(icon.name));
    } catch (e) {
      // If regex still fails somehow, fall back to simple includes
      const lowerSearch = searchTerm.toLowerCase();
      return icons.filter(icon => icon.name.toLowerCase().includes(lowerSearch));
    }
  }, [searchTerm, icons]);

  // Focus search input on mount
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle navigation if we're showing search results
      if (!filteredIcons || filteredIcons.length === 0) return;
      
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

          {/* Recently Used Icons - Show when no search */}
          {!searchTerm && recentIcons.length > 0 && (
            <>
              <Typography variant="caption" color="text.secondary">
                RECENTLY USED
              </Typography>
              <IconGrid
                icons={recentIcons}
                onClick={handleIconSelect}
                onDoubleClick={handleIconDoubleClick}
              />
              <Divider />
            </>
          )}
        </Stack>
      </Section>

      {/* Search Results */}
      {searchTerm && filteredIcons && (
        <>
          <Section sx={{ py: 1 }}>
            <Typography variant="caption" color="text.secondary">
              SEARCH RESULTS ({filteredIcons.length} icons)
            </Typography>
          </Section>
          <Divider />
          <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
            {filteredIcons.length > 0 ? (
              <Section>
                <IconGrid
                  icons={filteredIcons}
                  onClick={handleIconSelect}
                  onDoubleClick={handleIconDoubleClick}
                  hoveredIndex={hoveredIndex}
                  onHover={setHoveredIndex}
                />
              </Section>
            ) : (
              <Section>
                <Alert severity="info">No icons found matching "{searchTerm}"</Alert>
              </Section>
            )}
          </Box>
        </>
      )}

      {/* Original Icon Libraries - Show when no search */}
      {!searchTerm && (
        <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
          <Icons
            iconCategories={iconCategories}
            onClick={handleIconSelect}
            onMouseDown={() => {}} // Not needed for selection
          />
        </Box>
      )}

      {/* Help Text */}
      <Section sx={{ py: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {searchTerm 
            ? 'Use arrow keys to navigate • Enter to select • Double-click to select and close'
            : 'Type to search • Click category to expand • Double-click to select and close'
          }
        </Typography>
      </Section>
    </Box>
  );
};