import { useMemo } from 'react';
import { ModelItem } from 'src/types';
import { useModelStore } from 'src/stores/modelStore';
import { getItemById } from 'src/utils';

export const useModelItem = (id: string): ModelItem | null => {
  const items = useModelStore((state) => state.items);

  const modelItem = useMemo(() => {
    const item = getItemById(items, id);
    return item ? item.value : null;
  }, [id, items]);

  return modelItem;
};
