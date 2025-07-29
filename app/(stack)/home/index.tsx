import React from 'react';
import { ImageBackground, Pressable, SafeAreaView, Text, View, Image, Platform } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { router } from 'expo-router';

export default function index() {
  return (
    <ImageBackground
      source={require('@/assets/images/invernadero.jpeg')}
      resizeMode="cover"
      className="flex-1 justify-center items-center"
    >
      <SafeAreaView className="flex-1 w-full items-center justify-between py-6">
        
        {/* Título */}
        <View className="mt-6 bg-black/60 px-6 py-4 rounded-xl items-center">
          <Text className="text-white text-5xl font-extrabold text-center">🌿 ClimaHort</Text>
          <Text className="text-white text-lg font-light text-center">Tu asistente climático de invernadero</Text>
        </View>

        {/* Botones */}
        <Animated.View
          entering={FadeIn.duration(600)}
          className="bg-black/50 p-6 rounded-xl items-center"
        >
          <Pressable
            className="w-64 py-5 bg-blue-500 rounded-full mb-6 items-center"
            onPress={() => router.push("/vpd")}
          >
            <Text className="text-white font-bold text-lg">DIAGNÓSTICO</Text>
          </Pressable>

          <Pressable
            className="w-64 py-5 bg-green-500 rounded-full mb-6 items-center"
            onPress={() => router.push("/greenhouse")}
          >
            <Text className="text-white font-bold text-lg">MIS INVERNADEROS</Text>
          </Pressable>

          <Pressable
            className="w-64 py-5 bg-blue-500 rounded-full mb-6 items-center"
            onPress={() => router.push("/history")}
          >
            <Text className="text-white font-bold text-lg">HISTORIAL</Text>
          </Pressable>

          <Pressable
            className="w-64 py-5 bg-green-500 rounded-full items-center"
            onPress={() => router.push('/info')}
          >
            <Text className="text-white font-bold text-lg">INFORMACIÓN</Text>
          </Pressable>
        </Animated.View>

        {/* Banner Cofinanciado */}
        <View
          className="w-full items-center px-4 bg-white/80"
          style={{
            paddingBottom: Platform.OS === 'android' ? 8 : 4,
            paddingTop: 6,
          }}
        >
          <View className="flex-row items-center justify-center gap-x-4">
            {/* Logo INIA */}
            <Image
              source={require('@/assets/images/logoInia.png')}
              style={{ width: 100, height: 50, resizeMode: 'contain' }}
            />

            {/* Separador vertical */}
            <View style={{ width: 1, height: 40, backgroundColor: '#ccc', marginHorizontal: 8 }} />

            {/* Texto y logo CORFO alineados */}
            <View className="items-center justify-center">
              <Text className="text-black text-sm font-bold mb-1">Cofinanciado por:</Text>
              <Image
                source={require('@/assets/images/corfo.png')}
                style={{ width: 120, height: 70, resizeMode: 'contain' }}
              />
            </View>
          </View>
        </View>


      </SafeAreaView>
    </ImageBackground>
  );
}
