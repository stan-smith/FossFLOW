import { useState, useMemo } from 'react';
import { useModelStore } from 'src/stores/modelStore';
import { Icon } from 'src/types';

export const useIconFiltering = () => {
  const [filter, setFilter] = useState<string>('');

  const icons = useModelStore((state) => {
    return state.icons;
  });

  const filteredIcons = useMemo(() => {
    if (filter === '') return null;

    // Escape special regex characters to treat filter as literal string
    const escapedFilter = filter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedFilter, 'gi');

    return icons.filter((icon: Icon) => {
      if (!filter) {
        return true;
      }

      return regex.test(icon.name);
    });
  }, [icons, filter]);

  return {
    setFilter,
    filter,
    filteredIcons
  };
};
