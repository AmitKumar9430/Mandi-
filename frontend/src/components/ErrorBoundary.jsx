import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("MANDI App Crash ErrorBoundary caught:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleClearAndReload = () => {
    try {
      localStorage.removeItem('mandi_user_profile');
      localStorage.removeItem('mandi_user_token');
      localStorage.removeItem('mandi_token');
      localStorage.removeItem('token');
      sessionStorage.clear();
    } catch (e) {}
    window.location.href = '/user/login';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1c1917',
          color: '#fafaf9',
          fontFamily: 'system-ui, sans-serif',
          padding: '24px'
        }}>
          <div style={{
            maxWidth: '640px',
            width: '100%',
            backgroundColor: '#292524',
            borderRadius: '24px',
            border: '2px solid #ef4444',
            padding: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '32px' }}>⚠️</span>
              <div>
                <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#fca5a5', margin: 0 }}>
                  Application Render Error (पेज लोड त्रुटि)
                </h1>
                <p style={{ fontSize: '13px', color: '#a8a29e', margin: '4px 0 0 0' }}>
                  A runtime component exception occurred while rendering this view.
                </p>
              </div>
            </div>

            <div style={{
              backgroundColor: '#1c1917',
              borderRadius: '16px',
              padding: '16px',
              border: '1px solid #44403c',
              fontSize: '12px',
              fontFamily: 'monospace',
              color: '#f87171',
              whiteSpace: 'pre-wrap',
              maxHeight: '200px',
              overflowY: 'auto',
              marginBottom: '20px'
            }}>
              {this.state.error?.toString()}
              {this.state.errorInfo?.componentStack && (
                <div style={{ color: '#78716c', marginTop: '8px', fontSize: '11px' }}>
                  {this.state.errorInfo.componentStack}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '10px 18px',
                  backgroundColor: '#44403c',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '13px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                🔄 Refresh Page
              </button>
              <button
                onClick={this.handleClearAndReload}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#10b981',
                  color: '#052e16',
                  fontWeight: '900',
                  fontSize: '13px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                ✨ Clear Stale Session & Go to Login
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
