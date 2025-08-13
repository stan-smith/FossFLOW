import { Size, Coords } from 'src/types';

declare global {
  let PACKAGE_VERSION: string;
  let REPOSITORY_URL: string;

  interface Window {
    Isoflow: {
      getUnprojectedBounds: () => Size & Coords;
      fitToView: () => void;
    };
  }
}

declare module 'react-quill' {
  import React from 'react';

  export interface ReactQuillProps {
    value?: string;
    onChange?: (value: string, delta: any, source: any, editor: any) => void;
    readOnly?: boolean;
    theme?: string;
    modules?: any;
    formats?: string[];
    style?: React.CSSProperties;
    className?: string;
    placeholder?: string;
    bounds?: string | HTMLElement;
    scrollingContainer?: string | HTMLElement;
    preserveWhitespace?: boolean;
    tabIndex?: number;
    onFocus?: (range: any, source: any, editor: any) => void;
    onBlur?: (previousRange: any, source: any, editor: any) => void;
    onKeyPress?: (event: React.KeyboardEvent) => void;
    onKeyDown?: (event: React.KeyboardEvent) => void;
    onKeyUp?: (event: React.KeyboardEvent) => void;
  }

  const ReactQuill: React.ForwardRefExoticComponent<ReactQuillProps & React.RefAttributes<any>>;
  export default ReactQuill;
}
