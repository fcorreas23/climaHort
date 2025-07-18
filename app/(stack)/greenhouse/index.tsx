import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getGreenhouses } from '@/database/repository/greenhouseRepository';

export default function GreenhouseIndex() {
  const router = useRouter();
  const [greenhouses, setGreenhouses] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadGreenhouses = async () => {
        try {
          const data = await getGreenhouses();
          setGreenhouses(data);
        } catch (err) {
          console.error('Error cargando invernaderos:', err);
        }
      };

      loadGreenhouses();
    }, [])
  );

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-4">
        <Text className="text-2xl font-bold mb-4">Invernaderos</Text>
      </View>

      <FlatList
        data={greenhouses}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
        renderItem={({ item }) => (
         <Pressable onPress={() => router.push(`/greenhouse/${item.id}`)}>
          <View className="border p-3 rounded mb-2 bg-gray-50">
            <Text className="text-lg font-semibold">{item.name}</Text>
            <Text className="text-sm text-gray-600">Tipo: {item.type}</Text>
            <Text className="text-sm text-gray-500">Ventilación: {item.ventilation_percent}%</Text>
          </View>
        </Pressable>
        )}
        ListEmptyComponent={
          <Text className="text-gray-500 text-center mt-10">No hay invernaderos registrados.</Text>
        }
      />

      {/* Floating Action Button */}
      <Pressable
        onPress={() => router.push('/(stack)/greenhouse/form')}
        className="absolute bottom-6 right-6 bg-blue-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        android_ripple={{ color: '#ffffff30', borderless: true }}
      >
        <Ionicons name="add" size={30} color="white" />
      </Pressable>
    </View>
  );
}
