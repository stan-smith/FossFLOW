import { useMemo } from 'react';
import { IconCollectionStateWithIcons } from 'src/types';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { useModelStore } from 'src/stores/modelStore';

export const useIconCategories = () => {
  const icons = useModelStore((state) => {
    return state.icons;
  });
  const iconCategoriesState = useUiStateStore((state) => {
    return state.iconCategoriesState;
  });

  const iconCategories = useMemo<IconCollectionStateWithIcons[]>(() => {
    return iconCategoriesState.map((collection) => {
      return {
        ...collection,
        icons: icons.filter((icon) => {
          return icon.collection === collection.id;
        })
      };
    });
  }, [icons, iconCategoriesState]);

  return {
    iconCategories
  };
};
