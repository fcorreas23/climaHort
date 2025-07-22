import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Asset } from 'expo-asset';
import { useCallback, useEffect, useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import { View } from 'react-native';
import { initDB } from '@/database/db';

import "../global.css";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [loaded, error] = useFonts({
    "ubuntu-bold": require("../assets/fonts/Ubuntu-Bold.ttf"),
    "ubuntu-light": require("../assets/fonts/Ubuntu-Light.ttf"),
    "ubuntu-medium": require("../assets/fonts/Ubuntu-Medium.ttf"),
    "ubuntu-regular": require("../assets/fonts/Ubuntu-Regular.ttf"),
  });

  const [assetsReady, setAssetsReady] = useState(false);
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await initDB(); // carga la base de datos

        // precarga la imagen de fondo
        await Asset.loadAsync([require("../assets/images/grennhouse.jpg")]);
        await Asset.loadAsync([require("../assets/images/corfo-icono.jpg")]);
        await Asset.loadAsync([require("../assets/images/inia-logo.jpg")]);

        setAssetsReady(true);
        setDbReady(true);
      } catch (e) {
        console.error("Error en carga inicial:", e);
      }
    };

    prepare();
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (loaded && assetsReady && dbReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, assetsReady, dbReady]);

  if (!loaded || !assetsReady || !dbReady) return null;

  return (
    <PaperProvider>
      <View onLayout={onLayoutRootView} className="flex-1">
        <Slot />
      </View>
    </PaperProvider>
  );
};

export default RootLayout;
