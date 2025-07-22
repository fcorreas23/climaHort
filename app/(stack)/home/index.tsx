import React from 'react';
import { ImageBackground, Pressable, Text, View } from 'react-native';
import { Image } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { router } from 'expo-router';

export default function index () {
  return (
    <ImageBackground
      source={require('@/assets/images/grennhouse.jpg')}
      resizeMode="cover"
      className="flex-1 justify-center items-center"
    >
      <Animated.View
        entering={FadeIn.duration(600)}
        className="bg-black/50 p-6 rounded-xl"
      >
      
        <Text className="text-white text-3xl font-bold mb-12 text-center">
          Bienvenido a la App
        </Text>
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
          className="w-64 py-6 bg-orange-500 rounded-full mb-12 items-center"
          onPress={() => router.push("/history")}
        >
          <Text className="text-white font-bold text-lg">HISTORIAL</Text>
        </Pressable>
        {/* Guía de Cultivos */}        
        <Pressable
          className="w-64 py-6 bg-purple-500 rounded-full items-center"
          onPress={() => router.push('/info')}
        >
          <Text className="text-white font-bold text-lg">INFORMACION</Text>
        </Pressable>

      </Animated.View>
      <View className="absolute bottom-6 w-full items-center px-4">
        <View className="bg-white/70 rounded-lg px-4 py-2 flex-row items-center justify-center gap-x-8">
          <Image
            source={require('@/assets/images/corfo-icono.jpg')}
            style={{ width: 100, height: 100, resizeMode: 'contain' }}
          />
          <Image
            source={require('@/assets/images/inia-logo.jpg')}
            style={{ width: 100, height: 100, resizeMode: 'contain' }}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

