import { useState, useEffect, useCallback } from 'react';
import { flattenCollections } from '@isoflow/isopacks/dist/utils';

// Available icon packs (excluding core isoflow which is always loaded)
export type IconPackName = string;

export interface IconPackInfo {
  name: IconPackName;
  displayName: string;
  loaded: boolean;
  loading: boolean;
  error: string | null;
  iconCount: number;
}

export interface IconPackManagerState {
  lazyLoadingEnabled: boolean;
  enabledPacks: IconPackName[];
  packInfo: Record<IconPackName, IconPackInfo>;
  loadedIcons: any[];
}

// localStorage keys
const LAZY_LOADING_KEY = 'fossflow-lazy-loading-enabled';
const ENABLED_PACKS_KEY = 'fossflow-enabled-icon-packs';

// Pack metadata for known packs. Custom packs will be stored in localStorage.
const PACK_METADATA: Record<string, string> = {
  aws: 'AWS Icons',
  gcp: 'Google Cloud Icons',
  azure: 'Azure Icons',
  kubernetes: 'Kubernetes Icons'
};

// Load preferences from localStorage
export const loadLazyLoadingPreference = (): boolean => {
  const stored = localStorage.getItem(LAZY_LOADING_KEY);
  return stored === null ? true : stored === 'true'; // Default to true
};

export const saveLazyLoadingPreference = (enabled: boolean): void => {
  localStorage.setItem(LAZY_LOADING_KEY, String(enabled));
};

export const loadEnabledPacks = (): IconPackName[] => {
  const stored = localStorage.getItem(ENABLED_PACKS_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored) as IconPackName[];
  } catch {
    return [];
  }
};

export const saveEnabledPacks = (packs: IconPackName[]): void => {
  localStorage.setItem(ENABLED_PACKS_KEY, JSON.stringify(packs));
};

// Dynamic pack loader
export const loadIconPack = async (packName: IconPackName): Promise<any> => {
  // Try known dynamic imports first
  switch (packName) {
    case 'aws':
      return (await import('@isoflow/isopacks/dist/aws')).default;
    case 'gcp':
      return (await import('@isoflow/isopacks/dist/gcp')).default;
    case 'azure':
      return (await import('@isoflow/isopacks/dist/azure')).default;
    case 'kubernetes':
      return (await import('@isoflow/isopacks/dist/kubernetes')).default;
    default:
      // Unknown packName — custom packs are expected to be stored and resolved by the manager
      throw new Error(`Unknown icon pack for dynamic import: ${packName}`);
  }
};

// Custom packs storage key
const CUSTOM_PACKS_KEY = 'fossflow-custom-icon-packs';

export interface StoredCustomPack {
  name: string;
  displayName: string;
  icons: any[]; // flattened icons array
}

export const loadCustomPacksFromStorage = (): Record<
  string,
  StoredCustomPack
> => {
  const s = localStorage.getItem(CUSTOM_PACKS_KEY);
  if (!s) return {};
  try {
    return JSON.parse(s) as Record<string, StoredCustomPack>;
  } catch (e) {
    console.error('Failed to parse custom icon packs from storage', e);
    return {};
  }
};

export const saveCustomPacksToStorage = (
  packs: Record<string, StoredCustomPack>
) => {
  localStorage.setItem(CUSTOM_PACKS_KEY, JSON.stringify(packs));
};

// React hook for managing icon packs
export const useIconPackManager = (coreIcons: any[]) => {
  const [lazyLoadingEnabled, setLazyLoadingEnabled] = useState<boolean>(() =>
    loadLazyLoadingPreference()
  );

  const [enabledPacks, setEnabledPacks] = useState<IconPackName[]>(() =>
    loadEnabledPacks()
  );

  // Load any custom packs from storage and initialize packInfo
  const storedCustomPacks = loadCustomPacksFromStorage();

  const [packInfo, setPackInfo] = useState<Record<IconPackName, IconPackInfo>>(
    () => {
      const info: Record<string, IconPackInfo> = {};
      const defaultPackNames: IconPackName[] = [
        'aws',
        'gcp',
        'azure',
        'kubernetes'
      ];
      const packNames = [
        ...defaultPackNames,
        ...Object.keys(storedCustomPacks)
      ];
      packNames.forEach((name) => {
        info[name] = {
          name,
          displayName:
            storedCustomPacks[name]?.displayName || PACK_METADATA[name] || name,
          loaded: false,
          loading: false,
          error: null,
          iconCount: 0
        };
      });
      return info as Record<IconPackName, IconPackInfo>;
    }
  );

  const [loadedIcons, setLoadedIcons] = useState<any[]>(coreIcons);
  const [loadedPackData, setLoadedPackData] = useState<
    Record<IconPackName, any>
  >({} as Record<IconPackName, any>);

  // Load a specific pack
  const loadPack = useCallback(
    async (packName: IconPackName) => {
      // Already loaded?
      if (packInfo[packName]?.loaded || packInfo[packName]?.loading) {
        return;
      }

      // Set loading state
      setPackInfo((prev) => ({
        ...prev,
        [packName]: { ...prev[packName], loading: true, error: null }
      }));

      try {
        // First check if we already have the pack data cached (including custom packs)
        let pack: any = loadedPackData[packName];

        // If not cached, check stored custom packs
        if (!pack) {
          const stored = loadCustomPacksFromStorage();
          if (stored[packName]) {
            pack = { __custom: true, icons: stored[packName].icons };
          }
        }

        // If still not found, try dynamic import for known packs
        if (!pack) {
          try {
            pack = await loadIconPack(packName);
          } catch (e) {
            throw e;
          }
        }

        // Determine flattened icons
        let flattenedIcons: any[] = [];
        if (pack.__custom && Array.isArray(pack.icons)) {
          flattenedIcons = pack.icons;
        } else {
          flattenedIcons = flattenCollections([pack]);
        }

        // Store the loaded pack data
        setLoadedPackData((prev) => ({
          ...prev,
          [packName]: pack
        }));

        // Update pack info
        setPackInfo((prev) => ({
          ...prev,
          [packName]: {
            ...(prev[packName] || {
              name: packName,
              displayName: PACK_METADATA[packName] || packName
            }),
            loaded: true,
            loading: false,
            iconCount: flattenedIcons.length,
            error: null
          }
        }));

        // Add icons to the loaded icons array
        setLoadedIcons((prev) => [...prev, ...flattenedIcons]);

        return flattenedIcons;
      } catch (error) {
        console.error(`Failed to load ${packName} icon pack:`, error);
        setPackInfo((prev) => ({
          ...prev,
          [packName]: {
            ...(prev[packName] || {
              name: packName,
              displayName: PACK_METADATA[packName] || packName
            }),
            loading: false,
            error:
              error instanceof Error ? error.message : 'Failed to load pack'
          }
        }));
        throw error;
      }
    },
    [packInfo]
  );

  // Enable/disable a pack
  const togglePack = useCallback(
    async (packName: IconPackName, enabled: boolean) => {
      if (enabled) {
        // Add to enabled packs
        const newEnabledPacks = [...enabledPacks, packName];
        setEnabledPacks(newEnabledPacks);
        saveEnabledPacks(newEnabledPacks);

        // Load the pack
        await loadPack(packName);
      } else {
        // Remove from enabled packs
        const newEnabledPacks = enabledPacks.filter((p) => p !== packName);
        setEnabledPacks(newEnabledPacks);
        saveEnabledPacks(newEnabledPacks);

        // Remove icons from loaded icons
        // We need to rebuild the icons array from core + enabled packs
        const newIcons = [coreIcons];
        for (const pack of newEnabledPacks) {
          const data = loadedPackData[pack];
          if (data) {
            if (data.__custom && Array.isArray(data.icons)) {
              newIcons.push(data.icons);
            } else {
              newIcons.push(flattenCollections([data]));
            }
          } else {
            // If data not in cache, try to load from storage for custom packs
            const stored = loadCustomPacksFromStorage();
            if (stored[pack]) {
              newIcons.push(stored[pack].icons);
            }
          }
        }
        setLoadedIcons(newIcons.flat());
      }
    },
    [enabledPacks, loadPack, coreIcons, loadedPackData]
  );

  // Toggle lazy loading
  const toggleLazyLoading = useCallback((enabled: boolean) => {
    setLazyLoadingEnabled(enabled);
    saveLazyLoadingPreference(enabled);
  }, []);

  // Load all packs (for when lazy loading is disabled)
  const loadAllPacks = useCallback(async () => {
    const stored = loadCustomPacksFromStorage();
    const customNames = Object.keys(stored);
    const allPacks: IconPackName[] = [
      'aws',
      'gcp',
      'azure',
      'kubernetes',
      ...customNames
    ];
    for (const pack of allPacks) {
      if (!packInfo[pack]?.loaded && !packInfo[pack]?.loading) {
        await loadPack(pack);
      }
    }
  }, [packInfo, loadPack]);

  // Auto-detect required packs from diagram data
  const loadPacksForDiagram = useCallback(
    async (diagramItems: any[]) => {
      if (!diagramItems || diagramItems.length === 0) return;

      // Extract unique collections from diagram items
      const collections = new Set<string>();
      diagramItems.forEach((item) => {
        if (item.icon?.collection) {
          collections.add(item.icon.collection);
        }
      });

      // Load any missing packs (including custom packs present in storage)
      const packsToLoad: IconPackName[] = [];
      const stored = loadCustomPacksFromStorage();
      collections.forEach((collection) => {
        if (collection !== 'isoflow' && collection !== 'imported') {
          const packName = collection as IconPackName;
          if (
            ['aws', 'gcp', 'azure', 'kubernetes'].includes(packName) ||
            stored[packName]
          ) {
            if (!packInfo[packName]?.loaded && !packInfo[packName]?.loading) {
              packsToLoad.push(packName);
            }
          }
        }
      });

      // Load required packs
      for (const pack of packsToLoad) {
        await loadPack(pack);
        // Also add to enabled packs
        if (!enabledPacks.includes(pack)) {
          const newEnabledPacks = [...enabledPacks, pack];
          setEnabledPacks(newEnabledPacks);
          saveEnabledPacks(newEnabledPacks);
        }
      }
    },
    [packInfo, enabledPacks, loadPack]
  );

  // Initialize: Load enabled packs or all packs depending on lazy loading setting
  useEffect(() => {
    const initialize = async () => {
      if (!lazyLoadingEnabled) {
        // Load all packs immediately
        await loadAllPacks();
      } else {
        // Load only enabled packs
        for (const pack of enabledPacks) {
          if (!packInfo[pack].loaded && !packInfo[pack].loading) {
            await loadPack(pack);
          }
        }
      }
    };
    initialize();
  }, []); // Only run once on mount

  // Add a custom icon pack (icons should be a flattened icons array)
  const addCustomPack = useCallback(
    (name: string, displayName: string, icons: any[]) => {
      const stored = loadCustomPacksFromStorage();
      stored[name] = { name, displayName, icons };
      saveCustomPacksToStorage(stored);

      // Update pack info and cache
      setPackInfo((prev) => ({
        ...prev,
        [name]: {
          name,
          displayName,
          loaded: true,
          loading: false,
          error: null,
          iconCount: icons.length
        }
      }));

      setLoadedPackData((prev) => ({
        ...prev,
        [name]: { __custom: true, icons }
      }));

      setLoadedIcons((prev) => [...prev, ...icons]);
    },
    []
  );

  const removeCustomPack = useCallback(
    (name: string) => {
      const stored = loadCustomPacksFromStorage();
      if (stored[name]) {
        delete stored[name];
        saveCustomPacksToStorage(stored);
      }

      // Remove from enabled packs if present
      setEnabledPacks((prev) => {
        const next = prev.filter((p) => p !== name);
        saveEnabledPacks(next);
        return next;
      });

      // Remove from packInfo and cache
      setLoadedPackData((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });

      setPackInfo((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });

      // Rebuild loadedIcons from core + remaining enabled packs
      setLoadedIcons(() => {
        const remaining = [coreIcons];
        const currentEnabled = loadEnabledPacks();
        const storedPacks = loadCustomPacksFromStorage();
        for (const pack of currentEnabled) {
          const data = loadedPackData[pack];
          if (data) {
            if (data.__custom && Array.isArray(data.icons)) {
              remaining.push(data.icons);
            } else {
              try {
                remaining.push(flattenCollections([data]));
              } catch (_) {}
            }
          } else if (storedPacks[pack]) {
            remaining.push(storedPacks[pack].icons);
          }
        }
        return remaining.flat();
      });
    },
    [loadedPackData]
  );

  return {
    lazyLoadingEnabled,
    enabledPacks,
    packInfo,
    loadedIcons,
    togglePack,
    toggleLazyLoading,
    loadAllPacks,
    loadPacksForDiagram,
    isPackEnabled: (packName: IconPackName) => enabledPacks.includes(packName),
    addCustomPack,
    removeCustomPack
  };
};
