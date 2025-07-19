import { View, Text, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { deleteGreenhouseById } from '@/database/repository/greenhouseRepository';

export default function GreenhouseCard({ item }: { item: any }) {
  const router = useRouter();

  const handleDelete = () => {
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
    );
  };

  return (
    <View className="border border-gray-300 rounded-xl p-4 mb-4 mx-4 bg-white shadow-sm">
      {/* Título + Botones alineados horizontalmente */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-2xl font-bold">{item.name}</Text>

        <View className="flex-row space-x-6">
          <Pressable
            onPress={() => router.push(`/(stack)/greenhouse/form?id=${item.id}`)}
            className="w-9 h-9 bg-blue-500 rounded-full items-center justify-center"
          >
            <Ionicons name="create-outline" size={18} color="white" />
          </Pressable>

          <Pressable
            onPress={handleDelete}
            className="w-9 h-9 bg-red-500 rounded-full items-center justify-center"
          >
            <Ionicons name="trash-outline" size={18} color="white" />
          </Pressable>
        </View>
      </View>

      {/* Info debajo del nombre */}
      <Text className="text-sm text-gray-700">Tipo: {item.type}</Text>
      <Text className="text-sm text-gray-700">Ventilación: {item.ventilation_percent}%</Text>
    </View>
  );
}
