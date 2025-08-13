import { useMemo } from 'react';
import { getItemById } from 'src/utils';
import { useScene } from 'src/hooks/useScene';

export const useConnector = (id: string) => {
  const { connectors } = useScene();

  const connector = useMemo(() => {
    const item = getItemById(connectors, id);
    return item ? item.value : null;
  }, [connectors, id]);

  return connector;
};
