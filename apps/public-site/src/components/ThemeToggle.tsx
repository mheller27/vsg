import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, getEffectiveTheme } = useTheme();

  const getThemeIcon = () => {
    switch (theme) {
      case 'system':
        return (
          <svg
            className="w-5 h-5 text-gray-700 dark:text-gray-300 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
      case 'light':
        return (
          <svg
            className="w-5 h-5 text-gray-700 dark:text-gray-300 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        );
      case 'dark':
        return (
          <svg
            className="w-5 h-5 text-gray-700 dark:text-gray-300 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        );
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'system':
        const effective = getEffectiveTheme();
        return `System (${effective})`;
      case 'light':
        return 'Light mode';
      case 'dark':
        return 'Dark mode';
    }
  };

  const getNextThemeLabel = () => {
    switch (theme) {
      case 'system':
        return 'Switch to light mode';
      case 'light':
        return 'Switch to dark mode';
      case 'dark':
        return 'Switch to system mode';
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      aria-label={getNextThemeLabel()}
      title={getThemeLabel()}
    >
      {getThemeIcon()}
    </button>
  );
};

export default ThemeToggle; 