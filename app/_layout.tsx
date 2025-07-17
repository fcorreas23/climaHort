import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import "../global.css";

const RootLayout = () => {
  
  const [loaded, error] = useFonts({
    "ubuntu-bold": require("../assets/fonts/Ubuntu-Bold.ttf"),
    "ubuntu-light": require("../assets/fonts/Ubuntu-Light.ttf"),
    "ubuntu-medium": require("../assets/fonts/Ubuntu-Medium.ttf"),
    "ubuntu-regular": require("../assets/fonts/Ubuntu-Regular.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (loaded) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;
  
  
  return <Slot />
}

export default RootLayout