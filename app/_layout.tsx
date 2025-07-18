import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import { initDB } from '@/database/db'; // Ajusta según tu estructura
import "../global.css";
import { View } from 'react-native';

// Mantiene visible el splash mientras se carga
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  
  const [loaded, error] = useFonts({
    "ubuntu-bold": require("../assets/fonts/Ubuntu-Bold.ttf"),
    "ubuntu-light": require("../assets/fonts/Ubuntu-Light.ttf"),
    "ubuntu-medium": require("../assets/fonts/Ubuntu-Medium.ttf"),
    "ubuntu-regular": require("../assets/fonts/Ubuntu-Regular.ttf"),
  });
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await initDB(); // Inicializa SQLite
        setDbReady(true);
      } catch (e) {
        console.error("Error initializing DB:", e);
      }
    };

    prepare();
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (loaded && dbReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, dbReady]);

  if (!loaded || !dbReady) return null;

  return (
    <PaperProvider>
      <View onLayout={onLayoutRootView} className="flex-1">
        <Slot />
      </View>
    </PaperProvider>
  );
}

export default RootLayout