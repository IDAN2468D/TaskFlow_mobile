import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export type ThemeId = 'obsidian' | 'emerald' | 'midnight' | 'amber';

interface ThemeContextType {
  themeId: ThemeId;
  colors: ThemeColors;
  setTheme: (id: ThemeId) => Promise<void>;
}

export interface ThemeColors {
  primary: string;
  primaryDark: string;
  background: string;
  secondary: string;
  accent: string;
  surface: string;
  cardBg: string;
  border: string;
  textMain: string;
  textDim: string;
}

const THEMES: Record<ThemeId, ThemeColors> = {
  obsidian: {
    primary: '#818cf8', 
    primaryDark: '#4f46e5',
    background: '#050505', 
    secondary: '#0f172a',
    accent: '#a5b4fc',
    surface: '#0a0a0b',
    cardBg: 'rgba(255, 255, 255, 0.04)',
    border: 'rgba(255, 255, 255, 0.1)',
    textMain: '#ffffff',
    textDim: 'rgba(255, 255, 255, 0.4)',
  },
  emerald: {
    primary: '#4ade80', 
    primaryDark: '#16a34a',
    background: '#061a14',
    secondary: '#0b261f',
    accent: '#86efac',
    surface: '#081e18',
    cardBg: 'rgba(74, 222, 128, 0.05)',
    border: 'rgba(74, 222, 128, 0.1)',
    textMain: '#f0fdf4',
    textDim: 'rgba(212, 252, 227, 0.4)',
  },
  midnight: {
    primary: '#c084fc', 
    primaryDark: '#9333ea',
    background: '#050505',
    secondary: '#1a1630',
    accent: '#d8b4fe',
    surface: '#0f0c1d',
    cardBg: 'rgba(192, 132, 252, 0.05)',
    border: 'rgba(192, 132, 252, 0.1)',
    textMain: '#fdf4ff',
    textDim: 'rgba(245, 208, 254, 0.4)',
  },
  amber: {
    primary: '#fbbf24', 
    primaryDark: '#d97706',
    background: '#050505',
    secondary: '#261b0d',
    accent: '#fde68a',
    surface: '#1a1106',
    cardBg: 'rgba(251, 191, 36, 0.05)',
    border: 'rgba(251, 191, 36, 0.1)',
    textMain: '#fffbeb',
    textDim: 'rgba(254, 243, 199, 0.4)',
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
