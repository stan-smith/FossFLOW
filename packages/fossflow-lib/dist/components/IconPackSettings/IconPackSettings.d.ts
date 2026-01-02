import React from 'react';
export interface IconPackSettingsProps {
    lazyLoadingEnabled: boolean;
    onToggleLazyLoading: (enabled: boolean) => void;
    packInfo: Array<{
        name: string;
        displayName: string;
        loaded: boolean;
        loading: boolean;
        error: string | null;
        iconCount: number;
    }>;
    enabledPacks: string[];
    onTogglePack: (packName: string, enabled: boolean) => void;
}
export declare const IconPackSettings: React.FC<IconPackSettingsProps>;
