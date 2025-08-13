import React, { useMemo, useEffect } from 'react';
import { useModelStore } from 'src/stores/modelStore';
import { getItemById } from 'src/utils';
import { IsometricIcon } from 'src/components/SceneLayers/Nodes/Node/IconTypes/IsometricIcon';
import { NonIsometricIcon } from 'src/components/SceneLayers/Nodes/Node/IconTypes/NonIsometricIcon';
import { DEFAULT_ICON } from 'src/config';

export const useIcon = (id: string | undefined) => {
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const icons = useModelStore((state) => {
    return state.icons;
  });

  const icon = useMemo(() => {
    if (!id) return DEFAULT_ICON;

    const item = getItemById(icons, id);
    return item ? item.value : DEFAULT_ICON;
  }, [icons, id]);

  useEffect(() => {
    setHasLoaded(false);
  }, [icon.url]);

  const iconComponent = useMemo(() => {
    if (!icon.isIsometric) {
      setHasLoaded(true);
      return <NonIsometricIcon icon={icon} />;
    }

    return (
      <IsometricIcon
        url={icon.url}
        onImageLoaded={() => {
          setHasLoaded(true);
        }}
      />
    );
  }, [icon]);

  return {
    icon,
    iconComponent,
    hasLoaded
  };
};
