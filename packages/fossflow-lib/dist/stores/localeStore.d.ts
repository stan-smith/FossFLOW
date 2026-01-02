import React, { ReactNode } from 'react';
import { LocaleProps } from '../types/isoflowProps';
interface LocaleProviderProps {
    locale: LocaleProps;
    children: ReactNode;
}
export declare const LocaleProvider: React.FC<LocaleProviderProps>;
export declare const useLocale: () => LocaleProps;
type NestedKeyOf<ObjectType extends object> = {
    [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object ? `${Key}.${NestedKeyOf<ObjectType[Key]>}` : `${Key}`;
}[keyof ObjectType & (string | number)];
export declare function useTranslation(): {
    t: (key: NestedKeyOf<LocaleProps>) => string;
};
export declare function useTranslation<K extends keyof LocaleProps>(namespace: K): {
    t: (key: keyof LocaleProps[K]) => string;
};
export {};
