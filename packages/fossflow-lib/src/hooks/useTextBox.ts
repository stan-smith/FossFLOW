import { useMemo } from 'react';
import { getItemById } from 'src/utils';
import { useScene } from 'src/hooks/useScene';

export const useTextBox = (id: string) => {
  const { textBoxes } = useScene();

  const textBox = useMemo(() => {
    const item = getItemById(textBoxes, id);
    return item ? item.value : null;
  }, [textBoxes, id]);

  return textBox;
};
