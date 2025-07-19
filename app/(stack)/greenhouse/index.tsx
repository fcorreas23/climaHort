// app/(stack)/greenhouse/index.tsx
import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getGreenhouses } from '@/database/repository/greenhouseRepository';
import GreenhouseCard from '@/components/GreenhouseCard';

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
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={greenhouses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <GreenhouseCard item={item} />}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10">
            No hay invernaderos registrados.
          </Text>
        }
      />

      {/* Botón flotante de agregar */}
      <Pressable
        onPress={() => router.push('/(stack)/greenhouse/form')}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 items-center justify-center shadow-lg"
        android_ripple={{ color: '#ffffff30', borderless: true }}
      >
        <Ionicons name="add" size={30} color="white" />
      </Pressable>
    </SafeAreaView>
  );
}
