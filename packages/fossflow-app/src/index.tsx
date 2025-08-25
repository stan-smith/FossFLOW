import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'fossflow/dist/styles.css';
import 'react-quill/dist/quill.snow.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorBoundaryFallbackUI from './components/ErrorBoundary';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorBoundaryFallbackUI}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Service worker registration - only in production for PWA functionality
if (process.env.NODE_ENV === 'production') {
  serviceWorkerRegistration.register({
    onSuccess: () => console.log('Service worker registered successfully'),
    onUpdate: () => console.log('Service worker update available')
  });
} else {
  // Disable service worker in development to avoid cache issues
  serviceWorkerRegistration.unregister();
}
