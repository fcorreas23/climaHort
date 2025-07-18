import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { getGreenhouseById, deleteGreenhouseById } from '@/database/repository/greenhouseRepository';
import { useRouter } from 'expo-router';
import { Alert, Pressable } from 'react-native';


export default function GreenhouseDetail() {
const router = useRouter();
  const { id } = useLocalSearchParams();
  const [greenhouse, setGreenhouse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getGreenhouseById(Number(id));
        setGreenhouse(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <ActivityIndicator className="mt-20" size="large" color="#4B5563" />;
  if (!greenhouse) return <Text className="text-center mt-10">Invernadero no encontrado.</Text>;

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-2">{greenhouse.name}</Text>
      <Text className="text-gray-600 mb-1">Tipo: {greenhouse.type}</Text>
      <Text className="text-gray-600 mb-1">Cubierta: {greenhouse.cover_material}</Text>

      <Text className="mt-4 font-semibold">Dimensiones</Text>
      <Text>📏 {greenhouse.length} m x {greenhouse.width} m</Text>
      <Text>Altura canal: {greenhouse.gutter_height} m</Text>
      <Text>Altura techo: {greenhouse.roof_height} m</Text>

      <Text className="mt-4 font-semibold">Ventanas</Text>
      {greenhouse.has_windows ? (
        <Text>{greenhouse.window_count} ventanas de {greenhouse.window_width}x{greenhouse.window_height} m</Text>
      ) : (
        <Text>No tiene</Text>
      )}

      <Text className="mt-4 font-semibold">Lucarnas</Text>
      {greenhouse.has_skylights ? (
        <Text>{greenhouse.skylight_count} lucarnas de {greenhouse.skylight_width}x{greenhouse.skylight_height} m</Text>
      ) : (
        <Text>No tiene</Text>
      )}

      <Text className="mt-4 font-semibold">Ventilación</Text>
      <Text>Área: {greenhouse.ventilation_area} m²</Text>
      <Text>Porcentaje sobre el área total: {greenhouse.ventilation_percent}%</Text>
      {/* Botones de acción */}
        <View className="mt-6 space-y-3">
        <Pressable
            onPress={() => {
            router.push({
                pathname: '/(stack)/greenhouse/form',
                params: { id: greenhouse.id.toString() }, // navegación con ID
            });
            }}
            className="bg-blue-600 p-4 rounded-xl"
        >
            <Text className="text-white text-center font-semibold">Editar</Text>
        </Pressable>

        <Pressable
            onPress={() => {
            Alert.alert(
                'Eliminar invernadero',
                '¿Estás seguro de que deseas eliminar este invernadero?',
                [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                    await deleteGreenhouseById(greenhouse.id);
                    alert('Invernadero eliminado ✅');
                    router.replace('/greenhouse'); // volver a la lista
                    },
                },
                ]
            );
            }}
            className="bg-red-500 p-4 rounded-xl"
        >
            <Text className="text-white text-center font-semibold">Eliminar</Text>
        </Pressable>
        </View>
    </ScrollView>
  );
}
