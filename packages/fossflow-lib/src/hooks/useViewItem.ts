import { useMemo } from 'react';
import { getItemById } from 'src/utils';
import { useScene } from 'src/hooks/useScene';

export const useViewItem = (id: string) => {
  const { items } = useScene();

  const viewItem = useMemo(() => {
    const item = getItemById(items, id);
    return item ? item.value : null;
  }, [items, id]);

  return viewItem;
};
