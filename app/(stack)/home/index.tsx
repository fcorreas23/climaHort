import React from 'react';
import { ImageBackground, Pressable, Text, View } from 'react-native';
import { Image } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { router } from 'expo-router';

export default function index () {
  return (
    <ImageBackground
      source={require('@/assets/images/invernadero.jpeg')}
      resizeMode="cover"
      className="flex-1 justify-center items-center"
    >
      {/* TÍTULO PRINCIPAL */}
      <View className="mb-6 bg-black/60 px-6 py-4 rounded-xl items-center">
        <Text className="text-white text-5xl font-extrabold text-center">🌿 ClimaHort</Text>
        <Text className="text-white text-lg font-light text-center">Tu asistente climático de invernadero</Text>
      </View>
      <Animated.View
        entering={FadeIn.duration(600)}
        className="bg-black/50 p-6 rounded-xl"
      >
        {/* VPD */}
        <Pressable
          className="w-64 py-6 bg-blue-500 rounded-full mb-12 items-center"
          onPress={() => router.push("/vpd")}
          
        >
          <Text className="text-white font-bold text-lg">CALCULADORA</Text>
        </Pressable>
        {/* Invernaderos */}
        <Pressable
          className="w-64 py-6 bg-green-500 rounded-full mb-12 items-center"
          onPress={() => router.push("/greenhouse")}
        >
          <Text className="text-white font-bold text-lg">MIS INVERNADEROS</Text>
        </Pressable>
        {/* Historial */}
        <Pressable
          className="w-64 py-6 bg-blue-500 rounded-full mb-12 items-center"
          onPress={() => router.push("/history")}
        >
          <Text className="text-white font-bold text-lg">HISTORIAL</Text>
        </Pressable>
        {/* Guía de Cultivos */}        
        <Pressable
          className="w-64 py-6 bg-green-500 rounded-full items-center"
          onPress={() => router.push('/info')}
        >
          <Text className="text-white font-bold text-lg">INFORMACIÓN</Text>
        </Pressable>

      </Animated.View>
      <View className="absolute bottom-6 w-full items-center px-4 bg-white/80">
        <View className="px-4 py-2 flex-row items-center justify-center gap-x-8">
          <Image
            source={require('@/assets/images/logoInia.png')}
            style={{ width: 150, height: 100, resizeMode: 'contain' }}
          />
          <View>
            <Text className="text-black text-base font-bold leading-none -mb-4">Cofinanciado por:</Text>
            <Image
              source={require('@/assets/images/corfo.png')}
              style={{ width: 150, height: 100, resizeMode: 'contain', marginTop: 0 }}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

