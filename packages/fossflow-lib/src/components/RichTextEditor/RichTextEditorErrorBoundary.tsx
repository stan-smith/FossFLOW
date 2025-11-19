import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorCount: number;
}

class RichTextEditorErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> | null {
    // Check if this is the specific DOM manipulation error we're trying to handle
    if (
      error.message.includes('removeChild') ||
      error.message.includes('insertBefore') ||
      error.message.includes('appendChild')
    ) {
      // Return state update to trigger re-render
      return {
        hasError: true,
        errorCount: 0
      };
    }
    // For other errors, let them propagate
    return null;
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error for debugging purposes
    if (error.message.includes('removeChild') ||
        error.message.includes('insertBefore') ||
        error.message.includes('appendChild')) {
      console.warn('RichTextEditor DOM manipulation error caught and handled:', {
        message: error.message,
        componentStack: errorInfo.componentStack
      });

      // Prevent infinite error loops by tracking error count
      this.setState(prevState => ({
        errorCount: prevState.errorCount + 1
      }));

      // If we get too many errors in a row, show fallback
      if (this.state.errorCount > 3) {
        console.error('Too many RichTextEditor errors, showing fallback');
        return;
      }

      // Schedule a recovery attempt after the current render cycle
      setTimeout(() => {
        this.setState({
          hasError: false
        });
      }, 0);
    }
  }

  componentDidUpdate(_prevProps: ErrorBoundaryProps, prevState: ErrorBoundaryState) {
    // Reset error state if we successfully rendered after an error
    if (prevState.hasError && !this.state.hasError) {
      this.setState({ errorCount: 0 });
    }
  }

  render() {
    if (this.state.hasError && this.state.errorCount > 3) {
      // If too many errors, show fallback or placeholder
      return this.props.fallback || (
        <div style={{
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: '#f9f9f9',
          color: '#666'
        }}>
          Rich text editor temporarily unavailable
        </div>
      );
    }

    // Normal render or retry after error
    return this.props.children;
  }
}

export default RichTextEditorErrorBoundary;