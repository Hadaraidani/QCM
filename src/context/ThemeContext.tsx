import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/* ==============================
   THÈMES DISPONIBLES
   ============================== */
export const themes = {
  light: {
    name: 'Clair',
    icon: '☀️',
    colors: {
      bg: 'bg-gray-100',
      bgSecondary: 'bg-white',
      bgTertiary: 'bg-gray-50',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-500',
      border: 'border-gray-200',
      card: 'bg-white',
      cardHover: 'hover:bg-gray-50',
      input: 'bg-white border-gray-300 text-gray-900',
      button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      buttonSecondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
      accent: 'bg-indigo-600',
      accentText: 'text-indigo-600',
      accentLight: 'bg-indigo-100',
      header: 'bg-white/95 backdrop-blur-sm border-b border-gray-200',
      shadow: 'shadow-lg shadow-gray-200/50',
      gradient: 'from-indigo-600 via-purple-600 to-blue-600',
      gradientBg: 'from-gray-100 to-gray-200',
    }
  },
  dark: {
    name: 'Sombre',
    icon: '🌙',
    colors: {
      bg: 'bg-gray-900',
      bgSecondary: 'bg-gray-800',
      bgTertiary: 'bg-gray-850',
      text: 'text-gray-100',
      textSecondary: 'text-gray-300',
      textMuted: 'text-gray-400',
      border: 'border-gray-700',
      card: 'bg-gray-800',
      cardHover: 'hover:bg-gray-700',
      input: 'bg-gray-700 border-gray-600 text-gray-100',
      button: 'bg-indigo-500 hover:bg-indigo-600 text-white',
      buttonSecondary: 'bg-gray-700 hover:bg-gray-600 text-gray-200',
      accent: 'bg-indigo-500',
      accentText: 'text-indigo-400',
      accentLight: 'bg-indigo-900/50',
      header: 'bg-gray-800/95 backdrop-blur-sm border-b border-gray-700',
      shadow: 'shadow-lg shadow-black/30',
      gradient: 'from-indigo-500 via-purple-500 to-blue-500',
      gradientBg: 'from-gray-900 to-gray-800',
    }
  },
  blue: {
    name: 'Océan',
    icon: '🌊',
    colors: {
      bg: 'bg-slate-900',
      bgSecondary: 'bg-slate-800',
      bgTertiary: 'bg-slate-850',
      text: 'text-cyan-50',
      textSecondary: 'text-cyan-200',
      textMuted: 'text-cyan-300',
      border: 'border-cyan-800',
      card: 'bg-slate-800',
      cardHover: 'hover:bg-slate-700',
      input: 'bg-slate-700 border-cyan-700 text-cyan-50',
      button: 'bg-cyan-600 hover:bg-cyan-700 text-white',
      buttonSecondary: 'bg-slate-700 hover:bg-slate-600 text-cyan-200',
      accent: 'bg-cyan-500',
      accentText: 'text-cyan-400',
      accentLight: 'bg-cyan-900/50',
      header: 'bg-slate-800/95 backdrop-blur-sm border-b border-cyan-800',
      shadow: 'shadow-lg shadow-cyan-900/30',
      gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
      gradientBg: 'from-slate-900 to-cyan-900',
    }
  },
  green: {
    name: 'Nature',
    icon: '🌿',
    colors: {
      bg: 'bg-emerald-950',
      bgSecondary: 'bg-emerald-900',
      bgTertiary: 'bg-emerald-850',
      text: 'text-emerald-50',
      textSecondary: 'text-emerald-200',
      textMuted: 'text-emerald-300',
      border: 'border-emerald-700',
      card: 'bg-emerald-900',
      cardHover: 'hover:bg-emerald-800',
      input: 'bg-emerald-800 border-emerald-600 text-emerald-50',
      button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      buttonSecondary: 'bg-emerald-800 hover:bg-emerald-700 text-emerald-200',
      accent: 'bg-emerald-500',
      accentText: 'text-emerald-400',
      accentLight: 'bg-emerald-800/50',
      header: 'bg-emerald-900/95 backdrop-blur-sm border-b border-emerald-700',
      shadow: 'shadow-lg shadow-emerald-900/30',
      gradient: 'from-emerald-500 via-green-500 to-teal-500',
      gradientBg: 'from-emerald-950 to-emerald-900',
    }
  },
  purple: {
    name: 'Violet',
    icon: '💜',
    colors: {
      bg: 'bg-purple-950',
      bgSecondary: 'bg-purple-900',
      bgTertiary: 'bg-purple-850',
      text: 'text-purple-50',
      textSecondary: 'text-purple-200',
      textMuted: 'text-purple-300',
      border: 'border-purple-700',
      card: 'bg-purple-900',
      cardHover: 'hover:bg-purple-800',
      input: 'bg-purple-800 border-purple-600 text-purple-50',
      button: 'bg-purple-600 hover:bg-purple-700 text-white',
      buttonSecondary: 'bg-purple-800 hover:bg-purple-700 text-purple-200',
      accent: 'bg-purple-500',
      accentText: 'text-purple-400',
      accentLight: 'bg-purple-800/50',
      header: 'bg-purple-900/95 backdrop-blur-sm border-b border-purple-700',
      shadow: 'shadow-lg shadow-purple-900/30',
      gradient: 'from-purple-500 via-pink-500 to-fuchsia-500',
      gradientBg: 'from-purple-950 to-purple-900',
    }
  },
  sunset: {
    name: 'Coucher de soleil',
    icon: '🌅',
    colors: {
      bg: 'bg-orange-950',
      bgSecondary: 'bg-orange-900',
      bgTertiary: 'bg-orange-850',
      text: 'text-orange-50',
      textSecondary: 'text-orange-200',
      textMuted: 'text-orange-300',
      border: 'border-orange-700',
      card: 'bg-orange-900',
      cardHover: 'hover:bg-orange-800',
      input: 'bg-orange-800 border-orange-600 text-orange-50',
      button: 'bg-orange-600 hover:bg-orange-700 text-white',
      buttonSecondary: 'bg-orange-800 hover:bg-orange-700 text-orange-200',
      accent: 'bg-orange-500',
      accentText: 'text-orange-400',
      accentLight: 'bg-orange-800/50',
      header: 'bg-orange-900/95 backdrop-blur-sm border-b border-orange-700',
      shadow: 'shadow-lg shadow-orange-900/30',
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      gradientBg: 'from-orange-950 to-red-950',
    }
  }
};

export type ThemeKey = keyof typeof themes;

interface ThemeContextType {
  currentTheme: ThemeKey;
  theme: typeof themes.light;
  setTheme: (theme: ThemeKey) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>(() => {
    const saved = localStorage.getItem('qcm-theme');
    return (saved as ThemeKey) || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('qcm-theme', currentTheme);
  }, [currentTheme]);

  const value = {
    currentTheme,
    theme: themes[currentTheme],
    setTheme: setCurrentTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
