import { router } from 'expo-router';
import React from 'react';
import { ImageBackground, Pressable, Text, View } from 'react-native';

const index = () => {
  return (
    <ImageBackground
      source={require('@/assets/images/home.jpg')} // ajusta el path si es necesario
      resizeMode="cover"
      className="flex-1 justify-center items-center"
    >
      <View className="bg-black/50 p-6 rounded-xl">
        <Text className="text-white text-3xl font-bold mb-4 text-center">
          Bienvenido a la App
        </Text>
        <Pressable
          className="w-64 py-6 bg-blue-500 rounded-full mb-12 items-center"
          onPress={() => router.push("/vpd")}
          
        >
          <Text className="text-white font-bold text-lg">VPD</Text>
        </Pressable>

        
        <Pressable
          className="w-64 py-6 bg-green-500 rounded-full mb-12 items-center"
          onPress={() => router.push("/greenhouse")}
        >
          <Text className="text-white font-bold text-lg">INVERNADEROS</Text>
        </Pressable>

        <Pressable
          className="w-64 py-6 bg-orange-500 rounded-full items-center"
          onPress={() => router.push("/history")}
        >
          <Text className="text-white font-bold text-lg">HISTORIAL</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

export default index