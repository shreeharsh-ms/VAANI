import React, { createContext, useContext, useState, useEffect } from 'react';
import { colors } from './colors';
import { typography } from './typography';
import { spacing, radii, shadows } from './spacing';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('vaani_theme');
    if (saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vaani_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const isDark = theme === 'dark';

  const tokens = {
    colors: isDark ? colors.dark : colors.light,
    brand: colors.primary,
    secondary: colors.secondary,
    status: colors.status,
    typography,
    spacing,
    radii,
    shadows,
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, tokens }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
