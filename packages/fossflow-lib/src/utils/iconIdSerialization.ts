import { flattenCollections } from '@isoflow/isopacks/dist/utils';
import type { Model } from 'src/types';
import { icons as defaultIsoflowIcons } from 'src/examples/initialData';

const ICON_ID_SEPARATOR = '_';
const SUPPORTED_COLLECTIONS = new Set([
  'isoflow',
  'aws',
  'azure',
  'gcp',
  'kubernetes'
]);

type GenericIcon = Record<string, any>;

const getCollectionKey = (collection: string) => {
  return collection.trim().toLowerCase();
};

const getMapKey = (collection: string, iconId: string) => {
  return `${getCollectionKey(collection)}::${iconId}`;
};

const isSupportedCollection = (collection: string) => {
  return SUPPORTED_COLLECTIONS.has(getCollectionKey(collection));
};

const packIconUrlCache = new Map<string, Map<string, string>>();

const loadPackIcons = async (collection: string): Promise<GenericIcon[]> => {
  const collectionKey = getCollectionKey(collection);

  if (collectionKey === 'isoflow') {
    return defaultIsoflowIcons;
  }

  if (collectionKey === 'aws') {
    const pack = (await import('@isoflow/isopacks/dist/aws')).default;
    return flattenCollections([pack]);
  }

  if (collectionKey === 'azure') {
    const pack = (await import('@isoflow/isopacks/dist/azure')).default;
    return flattenCollections([pack]);
  }

  if (collectionKey === 'gcp') {
    const pack = (await import('@isoflow/isopacks/dist/gcp')).default;
    return flattenCollections([pack]);
  }

  if (collectionKey === 'kubernetes') {
    const pack = (await import('@isoflow/isopacks/dist/kubernetes')).default;
    return flattenCollections([pack]);
  }

  return [];
};

export const createIconId = (collection: string, iconId: string) => {
  return `${collection}${ICON_ID_SEPARATOR}${iconId}`;
};

export const parseIconId = (iconIdValue: string) => {
  const separatorIndex = iconIdValue.indexOf(ICON_ID_SEPARATOR);

  if (separatorIndex <= 0 || separatorIndex === iconIdValue.length - 1) {
    return null;
  }

  return {
    collection: iconIdValue.slice(0, separatorIndex),
    iconId: iconIdValue.slice(separatorIndex + 1)
  };
};

const getOrLoadCollectionUrlMap = async (collection: string) => {
  const collectionKey = getCollectionKey(collection);

  if (packIconUrlCache.has(collectionKey)) {
    return packIconUrlCache.get(collectionKey)!;
  }

  const packIcons = await loadPackIcons(collectionKey);
  const urlMap = new Map<string, string>();

  packIcons.forEach((icon) => {
    if (!icon?.id || !icon?.url) {
      return;
    }

    const sourceCollection = icon.collection || collectionKey;
    urlMap.set(getMapKey(sourceCollection, icon.id), icon.url);
  });

  packIconUrlCache.set(collectionKey, urlMap);
  return urlMap;
};

const buildInlineUrlMap = (icons: GenericIcon[]) => {
  const urlMap = new Map<string, string>();

  icons.forEach((icon) => {
    if (!icon?.collection || !icon?.id || !icon?.url) {
      return;
    }

    urlMap.set(getMapKey(icon.collection, icon.id), icon.url);
  });

  return urlMap;
};

export const serializeModelWithoutImages = (
  model: Model
): {
  data: Record<string, any>;
  unsupportedIcons: string[];
} => {
  const unsupportedIcons: string[] = [];

  const transformedIcons = (model.icons || []).map((icon) => {
    const collection = icon.collection;
    const iconLabel = icon.id || icon.name || 'unknown-icon';

    if (!collection || !icon.id || !isSupportedCollection(collection)) {
      unsupportedIcons.push(iconLabel);
      return icon;
    }

    const { url, icon_id, ...rest } = icon as GenericIcon;

    return {
      ...rest,
      icon_id: createIconId(collection, icon.id)
    };
  });

  return {
    data: {
      ...model,
      icons: transformedIcons
    },
    unsupportedIcons: Array.from(new Set(unsupportedIcons))
  };
};

export const hydrateIconsFromIconIds = async (icons: GenericIcon[]) => {
  if (!icons?.length) {
    return icons;
  }

  const resolvedUrlMap = buildInlineUrlMap(icons);
  const collectionsToLoad = new Set<string>();

  icons.forEach((icon) => {
    if (!icon?.icon_id || icon.url) {
      return;
    }

    const parsed = parseIconId(icon.icon_id);
    if (!parsed || !isSupportedCollection(parsed.collection)) {
      return;
    }

    collectionsToLoad.add(parsed.collection);
  });

  for (const collection of collectionsToLoad) {
    const collectionUrlMap = await getOrLoadCollectionUrlMap(collection);
    collectionUrlMap.forEach((url, key) => {
      if (!resolvedUrlMap.has(key)) {
        resolvedUrlMap.set(key, url);
      }
    });
  }

  return icons.map((icon) => {
    if (!icon?.icon_id) {
      return icon;
    }

    const parsed = parseIconId(icon.icon_id);

    if (!parsed) {
      return icon;
    }

    const effectiveCollection = icon.collection || parsed.collection;
    const effectiveIconId = icon.id || parsed.iconId;
    const resolvedUrl =
      icon.url || resolvedUrlMap.get(getMapKey(effectiveCollection, effectiveIconId));

    if (!resolvedUrl) {
      return {
        ...icon,
        collection: effectiveCollection,
        id: effectiveIconId
      };
    }

    const { icon_id, ...rest } = icon;

    return {
      ...rest,
      id: effectiveIconId,
      collection: effectiveCollection,
      url: resolvedUrl
    };
  });
};
