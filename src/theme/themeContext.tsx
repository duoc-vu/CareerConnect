import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';

// Định nghĩa Theme
const theme = {
  light: {
    bG: "#ffffff",
    primary: "#000959",
    onPrimary: "#a2cef4",
    surface: "#000000",
    disabled: "#c9c9c933",
    onDisabled: "#000000",
    error: "#ef5a56",
    onError: "#e2574c",
    success: "#cbf4a27f",
    onSuccess: "#000000",
    card: "rgba(240, 244, 247, 1)"
  },
  dark: {
    bG: "#25272a",
    primary: "#a2cef4",
    onPrimary: "#000959",
    surface: "#ffffff",
    disabled: "#c9c9c933",
    onDisabled: "#ffffff",
    error: "#e2574c",
    onError: "#ef5a56",
    success: "#cbf4a27f",
    onSuccess: "#ffffff",
    card: "rgba(240, 244, 247, 1)",
  },
};

// Định nghĩa kiểu ThemeContext
interface ThemeContextProps {
  theme: typeof theme.light;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

// Tạo Context
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Provider để bao bọc ứng dụng
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemColorScheme: ColorSchemeName = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ theme: isDarkMode ? theme.dark : theme.light, toggleTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook để sử dụng theme trong component
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
