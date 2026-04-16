import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export type ThemeId = 'obsidian' | 'emerald' | 'midnight' | 'amber';

export interface ThemeColors {
  primary: string;
  background: string;
  secondary: string;
  accent: string;
}

interface ThemeContextType {
  themeId: ThemeId;
  colors: ThemeColors;
  setTheme: (id: ThemeId) => Promise<void>;
}

const THEMES: Record<ThemeId, ThemeColors> = {
  obsidian: {
    primary: '#818cf8', // Muted Indigo
    background: '#0c0c0e', 
    secondary: '#16161a',
    accent: '#a5b4fc',
  },
  emerald: {
    primary: '#4ade80', // Sage/Spring Green
    background: '#061a14',
    secondary: '#0b261f',
    accent: '#86efac',
  },
  midnight: {
    primary: '#c084fc', // Soft Violet
    background: '#0f0c1d',
    secondary: '#1a1630',
    accent: '#d8b4fe',
  },
  amber: {
    primary: '#fbbf24', // Soft Amber
    background: '#1a1106',
    secondary: '#261b0d',
    accent: '#fde68a',
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeId] = useState<ThemeId>('obsidian');

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await SecureStore.getItemAsync('app_theme');
      if (savedTheme && Object.keys(THEMES).includes(savedTheme)) {
        setThemeId(savedTheme as ThemeId);
      }
    };
    loadTheme();
  }, []);

  const setTheme = async (id: ThemeId) => {
    setThemeId(id);
    await SecureStore.setItemAsync('app_theme', id);
  };

  return (
    <ThemeContext.Provider value={{ themeId, colors: THEMES[themeId], setTheme }}>
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
