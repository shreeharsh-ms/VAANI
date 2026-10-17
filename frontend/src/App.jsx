import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ClinicSettingsProvider } from './context/ClinicSettingsContext';
import SmoothScroll from './components/common/SmoothScroll';
import AppRoutes from './routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <ClinicSettingsProvider>
              <SmoothScroll>
                <AppRoutes />
              </SmoothScroll>
            </ClinicSettingsProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
