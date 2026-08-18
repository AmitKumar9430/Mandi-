import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { UserAuthProvider } from './auth/UserAuthContext.jsx';
import { AdminAuthProvider } from './auth/AdminAuthContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import 'leaflet/dist/leaflet.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <LanguageProvider>
          <UserAuthProvider>
            <AdminAuthProvider>
              <App />
            </AdminAuthProvider>
          </UserAuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
