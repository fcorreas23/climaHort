import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

const index = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-5xl font-ubuntu-bold mb-12">INIA</Text>

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
  );
}

export default index