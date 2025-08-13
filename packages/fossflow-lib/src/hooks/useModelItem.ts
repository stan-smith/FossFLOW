import { useMemo } from 'react';
import { ModelItem } from 'src/types';
import { useModelStore } from 'src/stores/modelStore';
import { getItemById } from 'src/utils';

export const useModelItem = (id: string): ModelItem | null => {
  const model = useModelStore((state) => {
    return state;
  });

  const modelItem = useMemo(() => {
    const item = getItemById(model.items, id);
    return item ? item.value : null;
  }, [id, model.items]);

  return modelItem;
};
