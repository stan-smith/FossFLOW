import { useState, useEffect, useCallback, useRef } from 'react';
import { flattenCollections } from '@isoflow/isopacks/dist/utils';

// Available icon packs (excluding core isoflow which is always loaded)
export type IconPackName = 'aws' | 'gcp' | 'azure' | 'kubernetes';

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

// Pack metadata
const PACK_METADATA: Record<IconPackName, string> = {
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
      throw new Error(`Unknown icon pack: ${packName}`);
  }
};

// React hook for managing icon packs
export const useIconPackManager = (coreIcons: any[]) => {
  const [lazyLoadingEnabled, setLazyLoadingEnabled] = useState<boolean>(() =>
    loadLazyLoadingPreference()
  );

  const [enabledPacks, setEnabledPacks] = useState<IconPackName[]>(() =>
    loadEnabledPacks()
  );

  const [packInfo, setPackInfo] = useState<Record<IconPackName, IconPackInfo>>(() => {
    const info: Record<string, IconPackInfo> = {};
    const packNames: IconPackName[] = ['aws', 'gcp', 'azure', 'kubernetes'];
    packNames.forEach(name => {
      info[name] = {
        name,
        displayName: PACK_METADATA[name],
        loaded: false,
        loading: false,
        error: null,
        iconCount: 0
      };
    });
    return info as Record<IconPackName, IconPackInfo>;
  });

  const [loadedIcons, setLoadedIcons] = useState<any[]>(coreIcons);
  const [loadedPackData, setLoadedPackData] = useState<Record<IconPackName, any>>({} as Record<IconPackName, any>);
  const loadedPackDataRef = useRef(loadedPackData);
  useEffect(() => {
    loadedPackDataRef.current = loadedPackData;
  }, [loadedPackData]);

  // Keep a stable ref to packInfo so callbacks don't need it as a dep
  const packInfoRef = useRef(packInfo);
  useEffect(() => {
    packInfoRef.current = packInfo;
  }, [packInfo]);

  // Load a specific pack — stable reference, reads packInfo via ref
  const loadPack = useCallback(async (packName: IconPackName) => {
    // Already loaded?
    const currentInfo = packInfoRef.current;
    if (currentInfo[packName].loaded || currentInfo[packName].loading) {
      return;
    }

    // Set loading state
    setPackInfo(prev => ({
      ...prev,
      [packName]: { ...prev[packName], loading: true, error: null }
    }));

    try {
      const pack = await loadIconPack(packName);
      const flattenedIcons = flattenCollections([pack]);

      // Store the loaded pack data
      setLoadedPackData(prev => ({
        ...prev,
        [packName]: pack
      }));

      // Update pack info
      setPackInfo(prev => ({
        ...prev,
        [packName]: {
          ...prev[packName],
          loaded: true,
          loading: false,
          iconCount: flattenedIcons.length,
          error: null
        }
      }));

      // Add icons to the loaded icons array
      setLoadedIcons(prev => [...prev, ...flattenedIcons]);

      return flattenedIcons;
    } catch (error) {
      console.error(`Failed to load ${packName} icon pack:`, error);
      setPackInfo(prev => ({
        ...prev,
        [packName]: {
          ...prev[packName],
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load pack'
        }
      }));
      throw error;
    }
  }, []); // stable — reads packInfo via ref, writes via functional setters

  // Enable/disable a pack — stable ref, reads state via refs
  const togglePack = useCallback(async (packName: IconPackName, enabled: boolean) => {
    if (enabled) {
      // Add to enabled packs (use functional setter to avoid stale closure)
      setEnabledPacks(prev => {
        const newEnabledPacks = [...prev, packName];
        saveEnabledPacks(newEnabledPacks);
        return newEnabledPacks;
      });

      // Load the pack
      await loadPack(packName);
    } else {
      // Remove from enabled packs
      setEnabledPacks(prev => {
        const newEnabledPacks = prev.filter(p => p !== packName);
        saveEnabledPacks(newEnabledPacks);

        // Rebuild icons from core + remaining enabled packs
        const currentPackData = loadedPackDataRef.current;
        const newIcons = [coreIcons];
        for (const pack of newEnabledPacks) {
          if (currentPackData[pack]) {
            newIcons.push(flattenCollections([currentPackData[pack]]));
          }
        }
        setLoadedIcons(newIcons.flat());

        return newEnabledPacks;
      });
    }
  }, [loadPack, coreIcons]);

  // Toggle lazy loading
  const toggleLazyLoading = useCallback((enabled: boolean) => {
    setLazyLoadingEnabled(enabled);
    saveLazyLoadingPreference(enabled);
  }, []);

  // Load all packs (for when lazy loading is disabled)
  const loadAllPacks = useCallback(async () => {
    const allPacks: IconPackName[] = ['aws', 'gcp', 'azure', 'kubernetes'];
    for (const pack of allPacks) {
      const info = packInfoRef.current;
      if (!info[pack].loaded && !info[pack].loading) {
        await loadPack(pack);
      }
    }
  }, [loadPack]);

  // Keep a stable ref to enabledPacks so loadPacksForDiagram doesn't re-create on every pack toggle
  const enabledPacksRef = useRef(enabledPacks);
  useEffect(() => {
    enabledPacksRef.current = enabledPacks;
  }, [enabledPacks]);

  // Auto-detect required packs from diagram data
  const loadPacksForDiagram = useCallback(async (diagramItems: any[]) => {
    if (!diagramItems || diagramItems.length === 0) return;

    // Extract unique collections from diagram items
    const collections = new Set<string>();
    diagramItems.forEach(item => {
      if (item.icon?.collection) {
        collections.add(item.icon.collection);
      }
    });

    // Load any missing packs
    const packsToLoad: IconPackName[] = [];
    collections.forEach(collection => {
      if (collection !== 'isoflow' && collection !== 'imported') {
        const packName = collection as IconPackName;
        if (['aws', 'gcp', 'azure', 'kubernetes'].includes(packName)) {
          const info = packInfoRef.current;
          if (!info[packName].loaded && !info[packName].loading) {
            packsToLoad.push(packName);
          }
        }
      }
    });

    // Load required packs
    for (const pack of packsToLoad) {
      await loadPack(pack);
      // Also add to enabled packs
      const currentEnabledPacks = enabledPacksRef.current;
      if (!currentEnabledPacks.includes(pack)) {
        const newEnabledPacks = [...currentEnabledPacks, pack];
        setEnabledPacks(newEnabledPacks);
        saveEnabledPacks(newEnabledPacks);
      }
    }
  }, [loadPack]);

  // Initialize: Load enabled packs or all packs depending on lazy loading setting
  useEffect(() => {
    const initialize = async () => {
      if (!lazyLoadingEnabled) {
        // Load all packs immediately
        await loadAllPacks();
      } else {
        // Load only enabled packs (read from ref to avoid stale closure)
        for (const pack of enabledPacksRef.current) {
          const info = packInfoRef.current;
          if (!info[pack].loaded && !info[pack].loading) {
            await loadPack(pack);
          }
        }
      }
    };
    initialize();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return {
    lazyLoadingEnabled,
    enabledPacks,
    packInfo,
    loadedIcons,
    togglePack,
    toggleLazyLoading,
    loadAllPacks,
    loadPacksForDiagram,
    isPackEnabled: (packName: IconPackName) => enabledPacks.includes(packName)
  };
};
