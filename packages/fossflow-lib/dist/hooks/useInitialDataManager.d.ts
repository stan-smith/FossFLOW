import { InitialData } from '../types';
export declare const useInitialDataManager: () => {
    load: (_initialData: InitialData) => void;
    clear: () => void;
    isReady: boolean;
};
