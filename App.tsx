import React from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { AppNavigator } from './src/navigation';
import { lightTheme, darkTheme } from './src/theme';

export default function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <AppNavigator />
    </PaperProvider>
  );
}
