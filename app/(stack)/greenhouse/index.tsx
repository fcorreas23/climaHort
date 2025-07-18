import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, Pressable, Alert } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getGreenhouses, deleteGreenhouseById } from '@/database/repository/greenhouseRepository';

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
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          
            <View className="border border-gray-400 rounded-2xl p-4 mb-3 mx-4 bg-white">
              <View className="flex-row justify-between items-center">
                <Text className="text-xl font-extrabold mb-2 tracking-wide font-handwritten">
                  {item.name}
                </Text>
                <Text className="text-sm text-gray-700">Tipo: {item.type}</Text>
                <Text className="text-sm text-gray-700">Ventilación: {item.ventilation_percent}%</Text>
              </View>

              <View className="flex-row space-x-2">
                <Pressable
                  onPress={() => router.push(`/(stack)/greenhouse/form?id=${item.id}`)}
                  className="w-9 h-9 bg-blue-500 rounded-full items-center justify-center"
                >
                  <Ionicons name="create-outline" size={18} color="white" />
                </Pressable>

                <Pressable
                  onPress={ async () => {
                    Alert.alert(
                      'Eliminar Invernadero',
                      '¿Estás seguro de que deseas eliminar este invernadero?',
                      [
                        { text: 'Cancelar', style: 'cancel' },
                        {
                          text: 'Eliminar',
                          style: 'destructive',
                          onPress: async () => {
                            await deleteGreenhouseById(item.id);
                            router.replace('/(stack)/greenhouse');
                          },
                        },
                      ]
                    )
                  }}
                  className="w-9 h-9 bg-red-500 rounded-full items-center justify-center"
                >
                  <Ionicons name="trash-outline" size={18} color="white" />
                </Pressable>
              </View>
            </View>
      
        )}
        ListEmptyComponent={
          <Text className="text-gray-500 text-center mt-10">No hay invernaderos registrados.</Text>
        }
      />

      {/* Floating Action Button */}
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
