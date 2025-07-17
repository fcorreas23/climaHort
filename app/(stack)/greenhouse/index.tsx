import { getGreenhouses } from '@/store/storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Greenhouse } from './form';

export default function GreenhouseIndex() {
  const router = useRouter();
  const [greenhouses, setGreenhouses] = useState<Greenhouse[]>([]); // Simulado, puedes usar contexto o storage

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const data = await getGreenhouses();
        setGreenhouses(data);
      };
      loadData();
    }, [])
  );
  
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Invernaderos</Text>

      <FlatList
        data={greenhouses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="border p-3 rounded mb-2 bg-gray-50">
            <Text className="text-lg font-semibold">{item.name}</Text>
            <Text className="text-sm text-gray-600">Tipo: {item.type}</Text>
          </View>
        )}
        ListEmptyComponent={<Text className="text-gray-500">No hay invernaderos registrados.</Text>}
      />

      <Pressable onPress={() => router.push('/(stack)/greenhouse/form')} className="bg-blue-600 py-3 rounded mt-4">
        <Text className="text-white text-center font-bold">Agregar Invernadero</Text>
      </Pressable>
    </View>
  );
}
