import { createContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem('theme');
    return savedTheme || 'system';
  });

  useEffect(() => {
    const applyTheme = (selectedTheme) => {
      if (selectedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      setTheme(systemTheme);
      applyTheme(systemTheme);

      const matchMediaListener = (event) => {
        const newTheme = event.matches ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme);
      };

      const matcher = window.matchMedia('(prefers-color-scheme: dark)');
      matcher.addEventListener('change', matchMediaListener);

      return () => {
        matcher.removeEventListener('change', matchMediaListener);
      };
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    window.localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, handleThemeChange }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
