import React, { Component, ReactNode } from 'react';

interface DOMErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

interface DOMErrorBoundaryState {
  hasError: boolean;
  errorCount: number;
}

/**
 * Error boundary that catches and handles DOM manipulation errors
 * such as "Failed to execute 'removeChild' on 'Node'"
 */
class DOMErrorBoundary extends Component<DOMErrorBoundaryProps, DOMErrorBoundaryState> {
  constructor(props: DOMErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<DOMErrorBoundaryState> | null {
    // Check if this is a DOM manipulation error we're trying to handle
    if (
      error.message.includes('removeChild') ||
      error.message.includes('insertBefore') ||
      error.message.includes('appendChild') ||
      error.message.includes('The node to be removed is not a child')
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
    if (
      error.message.includes('removeChild') ||
      error.message.includes('insertBefore') ||
      error.message.includes('appendChild') ||
      error.message.includes('The node to be removed is not a child')
    ) {
      console.warn('DOM manipulation error caught and handled:', {
        message: error.message,
        componentStack: errorInfo.componentStack
      });

      // Call optional error callback
      if (this.props.onError) {
        this.props.onError(error);
      }

      // Prevent infinite error loops by tracking error count
      this.setState((prevState) => ({
        errorCount: prevState.errorCount + 1
      }));

      // If we get too many errors in a row, show fallback
      if (this.state.errorCount > 3) {
        console.error('Too many DOM errors, showing fallback');
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

  componentDidUpdate(_prevProps: DOMErrorBoundaryProps, prevState: DOMErrorBoundaryState) {
    // Reset error state if we successfully rendered after an error
    if (prevState.hasError && !this.state.hasError) {
      this.setState({ errorCount: 0 });
    }
  }

  render() {
    if (this.state.hasError && this.state.errorCount > 3) {
      // If too many errors, show fallback or placeholder
      return (
        this.props.fallback || (
          <div
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9',
              color: '#666'
            }}
          >
            Component temporarily unavailable due to rendering errors
          </div>
        )
      );
    }

    // Normal render or retry after error
    return this.props.children;
  }
}

export default DOMErrorBoundary;
