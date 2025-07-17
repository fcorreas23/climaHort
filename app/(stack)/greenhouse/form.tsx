import SafeLayout from '@/components/SafeLayout';
import { saveGreenhouse } from '@/store/storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Keyboard, Pressable, Text, TextInput, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { v4 as uuidv4 } from 'uuid';

export type Greenhouse = {
  id: string;
  name: string;
  type: 'Capilla' | 'Tunel';
  length: number;
  width: number;
  gutterHeight: number;
  roofHeight: number;
  structure: 'Acero' | 'Aluminio' | 'Madera' | 'PVC';
  cover: 'Polietileno' | 'Policarbonato';
};

export default function GreenhouseForm() {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Greenhouse>>({});
  const [debugInfo, setDebugInfo] = useState<string>('');

  const handleChange = (key: keyof Greenhouse, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    /* const requiredFields: (keyof Greenhouse)[] = [
      'name', 'type', 'length', 'width', 'gutterHeight', 'roofHeight', 'structure', 'cover'
    ];

    const missing = requiredFields.filter(field =>
      form[field] === undefined || form[field] === null || form[field] === ''
    );

    if (missing.length > 0) {
      Alert.alert('Campos incompletos', `Faltan: ${missing.join(', ')}`);
      return;
    } */

    const newGreenhouse: Greenhouse = {
      ...(form as Greenhouse),
      id: uuidv4(),
    };

    console.log('Datos a guardar:', newGreenhouse);
    setDebugInfo(JSON.stringify(newGreenhouse, null, 2));  // con sangría


    try {
      await saveGreenhouse(newGreenhouse);
      Alert.alert('Éxito', 'Invernadero guardado correctamente');
      router.back();
    } catch (error) {
      console.error('❌ Error al guardar desde formulario:', error);
      Alert.alert('Error', 'No se pudo guardar el invernadero');
    }
  };

  return (
    <SafeLayout>
      <Text className="text-2xl font-bold mb-4">Registrar Invernadero</Text>
      <Text className="mb-1">Nombre</Text>
      <TextInput
        value={form.name || ''}
        onChangeText={(text) => handleChange('name', text)}
        className="border border-gray-400 rounded-md px-4 py-3 mb-4 bg-white"
        placeholder="Ej: Invernadero Norte"
      />

      <Text className="mb-1">Tipo</Text>
      <RNPickerSelect
        onValueChange={(value) => handleChange('type', value)}
        placeholder={{ label: 'Selecciona tipo', value: null }}
        items={[
          { label: 'Capilla', value: 'Capilla' },
          { label: 'Tunel', value: 'Tunel' },
        ]}
        useNativeAndroidPickerStyle={false}
        style={{
          inputIOS: styles.picker,
          inputAndroid: styles.picker,
        }}
      />

      <Text className="mb-1">Estructura</Text>
      <RNPickerSelect
        onValueChange={(value) => handleChange('structure', value)}
        placeholder={{ label: 'Selecciona estructura', value: null }}
        items={[
          { label: 'Acero', value: 'Acero' },
          { label: 'Aluminio', value: 'Aluminio' },
          { label: 'Madera', value: 'Madera' },
          { label: 'PVC', value: 'PVC' },
        ]}
        useNativeAndroidPickerStyle={false}
        style={{
          inputIOS: styles.picker,
          inputAndroid: styles.picker,
        }}
      />

      <Text className="mb-1 mt-4">Cubierta</Text>
      <RNPickerSelect
        onValueChange={(value) => handleChange('cover', value)}
        placeholder={{ label: 'Selecciona cubierta', value: null }}
        items={[
          { label: 'Polietileno', value: 'Polietileno' },
          { label: 'Policarbonato', value: 'Policarbonato' },
        ]}
        useNativeAndroidPickerStyle={false}
        style={{
          inputIOS: styles.picker,
          inputAndroid: styles.picker,
        }}
      />

            {/* Largo y Ancho en una fila */}
      <View className="flex-row gap-x-4 mb-4">
        <View className="flex-1">
          <Text className="mb-1">Largo (m)</Text>
          <TextInput
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
            value={form.length?.toString() || ''}
            onChangeText={(text) => {
              const value = parseFloat(text);
              handleChange('length', isNaN(value) ? undefined : value);
            }}
            className="border border-gray-400 rounded-md px-4 py-3 bg-white"
            placeholder="Ej: 30"

          />
        </View>
        <View className="flex-1">
          <Text className="mb-1">Ancho (m)</Text>
          <TextInput
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
            value={form.width?.toString() || ''}
            onChangeText={(text) => {
              const value = parseFloat(text);
              handleChange('width', isNaN(value) ? undefined : value);
            }}
            className="border border-gray-400 rounded-md px-4 py-3 bg-white"
            placeholder="Ej: 10"
          />
        </View>
      </View>

      {/* Alturas en una fila */}
      <View className="flex-row gap-x-4 mb-4">
        <View className="flex-1">
          <Text className="mb-1">Altura canal (m)</Text>
          <TextInput
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
            value={form.gutterHeight?.toString() || ''}
            onChangeText={(text) => {
              const value = parseFloat(text);
              handleChange('gutterHeight', isNaN(value) ? undefined : value);
            }}
            className="border border-gray-400 rounded-md px-4 py-3 bg-white"
            placeholder="Ej: 2.5"
          />
        </View>
        <View className="flex-1">
          <Text className="mb-1">Altura techo (m)</Text>
          <TextInput
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
            value={form.roofHeight?.toString() || ''}
            onChangeText={(text) => {
              const value = parseFloat(text);
              handleChange('roofHeight', isNaN(value) ? undefined : value);
            }}
            className="border border-gray-400 rounded-md px-4 py-3 bg-white"
            placeholder="Ej: 4"
          />
        </View>
      </View>

      <Pressable onPress={handleSubmit} className="bg-green-600 py-4 mt-6 rounded">
        <Text className="text-white text-center font-bold text-lg">Guardar</Text>
      </Pressable>
      {debugInfo !== '' && (
      <View className="mt-6 bg-gray-100 border border-gray-300 rounded p-4">
        <Text className="text-sm font-mono text-gray-800">Datos enviados:</Text>
        <Text className="text-xs font-mono text-gray-600">{debugInfo}</Text>
      </View>
    )}
    </SafeLayout>
  );
}

const styles = {
  picker: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    backgroundColor: '#f1f1f1',
    marginBottom: 16,
    fontSize: 16,
  },
};
