import { useMemo } from 'react';
import { getItemById } from 'src/utils';
import { useScene } from 'src/hooks/useScene';

export const useRectangle = (id: string) => {
  const { rectangles } = useScene();

  const rectangle = useMemo(() => {
    const item = getItemById(rectangles, id);
    return item ? item.value : null;
  }, [rectangles, id]);

  return rectangle;
};
