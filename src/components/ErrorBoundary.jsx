import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#f8d7da', color: '#721c24', minHeight: '100vh' }}>
          <h2>Something went wrong in the application.</h2>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '20px', padding: '10px', backgroundColor: '#fff', border: '1px solid #f5c6cb' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>View Error Details</summary>
            <div style={{ marginTop: '10px' }}>
              <strong>Error:</strong>
              <p>{this.state.error && this.state.error.toString()}</p>
              <strong>Component Stack:</strong>
              <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
            </div>
          </details>
        </div>
      );
    }
    return this.props.children; 
  }
}

export default ErrorBoundary;
