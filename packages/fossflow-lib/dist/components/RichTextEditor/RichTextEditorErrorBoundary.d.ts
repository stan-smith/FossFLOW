import React, { Component, ReactNode } from 'react';
interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}
interface ErrorBoundaryState {
    hasError: boolean;
    errorCount: number;
}
declare class RichTextEditorErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> | null;
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void;
    componentDidUpdate(_prevProps: ErrorBoundaryProps, prevState: ErrorBoundaryState): void;
    render(): string | number | boolean | Iterable<React.ReactNode> | import("react/jsx-runtime").JSX.Element | null | undefined;
}
export default RichTextEditorErrorBoundary;
