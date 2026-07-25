import React from 'react';
import { GlobalErrorFallback } from '../components/GlobalErrorFallback';

// Reusable Class-based Error Boundary core logic
class BaseErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`[ErrorBoundary - ${this.props.context}]`, error, errorInfo);
  }

  resetBoundary = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) this.props.onReset();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return React.cloneElement(this.props.fallback, { 
          error: this.state.error, 
          resetErrorBoundary: this.resetBoundary 
        });
      }
      return <GlobalErrorFallback error={this.state.error} resetErrorBoundary={this.resetBoundary} context={this.props.context} />;
    }
    return this.props.children;
  }
}

export const AppErrorBoundary = ({ children, onReset }) => (
  <BaseErrorBoundary context="application" onReset={onReset}>
    {children}
  </BaseErrorBoundary>
);

export const RouteErrorBoundary = ({ children, routeName = 'route', onReset }) => (
  <BaseErrorBoundary context={`route (${routeName})`} onReset={onReset}>
    {children}
  </BaseErrorBoundary>
);

export const FeatureErrorBoundary = ({ children, featureName = 'feature', onReset }) => (
  <BaseErrorBoundary context={`feature (${featureName})`} onReset={onReset}>
    {children}
  </BaseErrorBoundary>
);
