export interface SettingsDialogProps {
    iconPackManager?: {
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
    };
}
export declare const SettingsDialog: ({ iconPackManager }: SettingsDialogProps) => import("react/jsx-runtime").JSX.Element;
