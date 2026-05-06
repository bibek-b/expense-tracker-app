import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

export const lightPaperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#5B4CCC",
    primaryContainer: "#E6E1FF",
    secondary: "#006B5C",
    secondaryContainer: "#B8F0E4",
    surface: "#F8F7FC",
    surfaceVariant: "#E8E7EF",
    outline: "#C7C5D0",
    outlineVariant: "#CAC4D0",
  },
};

export const darkPaperTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#C4B5FD",
    primaryContainer: "#4C3D75",
    secondary: "#6EE7C2",
    secondaryContainer: "#004D40",
    surface: "#141218",
    surfaceVariant: "#2B2930",
    outline: "#948F99",
    outlineVariant: "#49454F",
  },
};
