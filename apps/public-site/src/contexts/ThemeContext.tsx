import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  resetTheme: () => void;
  getEffectiveTheme: () => 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('system');

  // Get the effective theme (light or dark) based on current theme setting
  const getEffectiveTheme = (): 'light' | 'dark' => {
    if (theme === 'system') {
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  };

  // Set document class and persist to localStorage
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    
    const effectiveTheme = newTheme === 'system' 
      ? (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : newTheme;
    
    root.classList.add(effectiveTheme);
    localStorage.setItem('theme', newTheme);
    setThemeState(newTheme);
  };

  // Cycle through themes: system → light → dark → system
  const toggleTheme = () => {
    const themes: Theme[] = ['system', 'light', 'dark'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    applyTheme(themes[nextIndex]);
  };

  // Set to a specific theme
  const setTheme = (newTheme: Theme) => {
    applyTheme(newTheme);
  };

  // Reset theme to system mode and clear localStorage
  const resetTheme = () => {
    localStorage.removeItem('theme');
    applyTheme('system');
  };

  // Listen for system theme changes when in system mode
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system'); // Re-apply to update effective theme
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // On first load: read from localStorage or default to system
  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    const initial = saved || 'system';
    applyTheme(initial);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, resetTheme, getEffectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};