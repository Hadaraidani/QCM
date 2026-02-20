import { useState } from 'react';
import { useTheme, themes, ThemeKey } from '../context/ThemeContext';

export default function ThemeSelector() {
  const { currentTheme, setTheme, theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Bouton de thème */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg ${theme.colors.card} ${theme.colors.border} border ${theme.colors.text} ${theme.colors.cardHover} transition-all duration-200`}
        title="Changer le thème"
      >
        <span className="text-lg">{themes[currentTheme].icon}</span>
        <span className="hidden sm:inline text-sm font-medium">{themes[currentTheme].name}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <>
          {/* Overlay pour fermer */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Liste des thèmes */}
          <div className={`absolute right-0 top-full mt-2 w-48 rounded-xl ${theme.colors.card} ${theme.colors.border} border ${theme.colors.shadow} z-50 overflow-hidden`}>
            <div className={`p-2 border-b ${theme.colors.border}`}>
              <p className={`text-xs font-semibold ${theme.colors.textMuted} uppercase tracking-wide px-2`}>
                Choisir un thème
              </p>
            </div>
            <div className="p-2 space-y-1">
              {(Object.keys(themes) as ThemeKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setTheme(key);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    currentTheme === key 
                      ? `${theme.colors.accentLight} ${theme.colors.accentText} font-semibold` 
                      : `${theme.colors.text} ${theme.colors.cardHover}`
                  }`}
                >
                  <span className="text-xl">{themes[key].icon}</span>
                  <span className="text-sm">{themes[key].name}</span>
                  {currentTheme === key && (
                    <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
