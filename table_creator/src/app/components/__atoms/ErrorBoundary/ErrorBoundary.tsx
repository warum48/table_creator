import React, { ComponentProps, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

interface ErrorBoundaryProps {
  FallbackComponent: React.ComponentType<{ error: any }>;
  children: ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: React.ErrorInfo) {
    // You can log the error to an error reporting service here
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <this.props.FallbackComponent error={this.state.error} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
