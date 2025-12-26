import { ThemeOptions } from '@mui/material';
interface CustomThemeVars {
    appPadding: {
        x: number;
        y: number;
    };
    toolMenu: {
        height: number;
    };
    customPalette: {
        [key in string]: string;
    };
}
declare module '@mui/material/styles' {
    interface Theme {
        customVars: CustomThemeVars;
    }
    interface ThemeOptions {
        customVars: CustomThemeVars;
    }
}
export declare const customVars: CustomThemeVars;
export declare const themeConfig: ThemeOptions;
export declare const theme: import("@mui/material").Theme;
export {};
