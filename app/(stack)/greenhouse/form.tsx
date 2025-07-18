import { View, Text, TextInput, Switch, ScrollView, Pressable, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Dropdown } from 'react-native-element-dropdown';
import {
  insertGreenhouse,
  updateGreenhouseById,
  getGreenhouseById,
} from '@/database/repository/greenhouseRepository';
import { Ionicons } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';


const types = [
  { label: 'Capilla', value: 'Capilla' },
  { label: 'Túnel', value: 'Tunel' },
];

const covers = [
  { label: 'Polietileno', value: 'Polietileno' },
  { label: 'Policarbonato', value: 'Policarbonato' },
];

export default function GreenhouseForm() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const isEditMode = !!id;
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');

  const [form, setForm] = useState({
    nombre: '',
    tipo: 'Capilla',
    materialCubierta: 'Polietileno',
    largo: '',
    ancho: '',
    alturaCanal: '',
    alturaTecho: '',
    tieneVentanas: false,
    numeroVentanas: '',
    anchoVentana: '',
    altoVentana: '',
    tieneLucarnas: false,
    numeroLucarnas: '',
    anchoLucarna: '',
    altoLucarna: '',
  });

  useEffect(() => {
    if (isEditMode) {
      const load = async () => {
        try {
          const data = await getGreenhouseById(Number(id));
          if (data) {
            setForm({
              nombre: data.name,
              tipo: data.type,
              materialCubierta: data.cover_material,
              largo: data.length?.toString() || '',
              ancho: data.width?.toString() || '',
              alturaCanal: data.gutter_height?.toString() || '',
              alturaTecho: data.roof_height?.toString() || '',
              tieneVentanas: data.has_windows === 1,
              numeroVentanas: data.window_count?.toString() || '',
              anchoVentana: data.window_width?.toString() || '',
              altoVentana: data.window_height?.toString() || '',
              tieneLucarnas: data.has_skylights === 1,
              numeroLucarnas: data.skylight_count?.toString() || '',
              anchoLucarna: data.skylight_width?.toString() || '',
              altoLucarna: data.skylight_height?.toString() || '',
            });
          }
        } catch (error) {
          console.error('Error al cargar datos del invernadero', error);
        }
      };
      load();
    }
  }, [id]);

  const handleChange = (key: string, value: string | boolean) => {
    setForm({ ...form, [key]: value });
  };

  const parseFloatSafe = (value: string) => parseFloat(value.replace(',', '.')) || 0;

  const calcularSuperficieVentilacion = () => {
    const largo = parseFloatSafe(form.largo);
    const ancho = parseFloatSafe(form.ancho);
    const areaTotal = largo * ancho;

    const superficieVentanas =
      parseFloatSafe(form.numeroVentanas) *
      parseFloatSafe(form.anchoVentana) *
      parseFloatSafe(form.altoVentana);

    const superficieLucarnas =
      parseFloatSafe(form.numeroLucarnas) *
      parseFloatSafe(form.anchoLucarna) *
      parseFloatSafe(form.altoLucarna);

    const superficieTotal = superficieVentanas + superficieLucarnas;
    const porcentaje = areaTotal > 0 ? (superficieTotal / areaTotal) * 100 : 0;

    return {
      superficieTotal: superficieTotal.toFixed(2),
      porcentaje: porcentaje.toFixed(2),
    };
  };

  const { superficieTotal, porcentaje } = calcularSuperficieVentilacion();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'android' ? 80 : 0}
      >
        <ScrollView className="p-4 space-y-4 bg-white">
          <Text className="text-2xl font-bold mb-2">
            {isEditMode ? 'Editar Invernadero' : 'Registrar Invernadero'}
          </Text>

          <Input label="Nombre" value={form.nombre} onChangeText={(v) => handleChange('nombre', v)} />

          <Text className="mb-2 text-base font-normal">Tipo de invernadero</Text>
          <Dropdown
            data={types}
            labelField="label"
            valueField="value"
            placeholder="Selecciona el tipo..."
            value={form.tipo}
            onChange={item => handleChange('tipo', item.value)}
            style={dropdownStyle}
            placeholderStyle={placeholderStyle}
            selectedTextStyle={selectedTextStyle}
            containerStyle={containerStyle}
          />

          <Text className="mb-2 mt-2 text-base font-normal">Material de cubierta</Text>
          <Dropdown
            data={covers}
            labelField="label"
            valueField="value"
            placeholder="Selecciona el material..."
            value={form.materialCubierta}
            onChange={item => handleChange('materialCubierta', item.value)}
            style={dropdownStyle}
            placeholderStyle={placeholderStyle}
            selectedTextStyle={selectedTextStyle}
            containerStyle={containerStyle}
          />

          <View className="mt-2">
            <Text className="text-lg font-semibold mb-2">Dimensiones</Text>
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Input label="Largo (m)" keyboardType="numeric" value={form.largo} onChangeText={(v) => handleChange('largo', v)} />
              </View>
              <View className="flex-1">
                <Input label="Ancho (m)" keyboardType="numeric" value={form.ancho} onChangeText={(v) => handleChange('ancho', v)} />
              </View>
            </View>
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Input label="Altura a la canal (m)" keyboardType="numeric" value={form.alturaCanal} onChangeText={(v) => handleChange('alturaCanal', v)} />
              </View>
              <View className="flex-1">
                <Input label="Altura del techo (m)" keyboardType="numeric" value={form.alturaTecho} onChangeText={(v) => handleChange('alturaTecho', v)} />
              </View>
            </View>
          </View>

          <View className="flex-row justify-between items-center mt-4">
            <Text className="text-lg font-semibold">¿Tiene ventanas?</Text>
            <Switch value={form.tieneVentanas} onValueChange={(v) => handleChange('tieneVentanas', v)} />
          </View>
          {form.tieneVentanas && (
            <View className="mt-2">
              <Text className="text-base font-normal mb-2">Ventanas</Text>
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Input label="N°" keyboardType="numeric" value={form.numeroVentanas} onChangeText={(v) => handleChange('numeroVentanas', v)} />
                </View>
                <View className="flex-1">
                  <Input label="Ancho (m)" keyboardType="numeric" value={form.anchoVentana} onChangeText={(v) => handleChange('anchoVentana', v)} />
                </View>
                <View className="flex-1">
                  <Input label="Alto (m)" keyboardType="numeric" value={form.altoVentana} onChangeText={(v) => handleChange('altoVentana', v)} />
                </View>
              </View>
            </View>
          )}

          <View className="flex-row justify-between items-center mt-4">
            <Text className="text-lg font-semibold">¿Tiene lucarnas?</Text>
            <Switch value={form.tieneLucarnas} onValueChange={(v) => handleChange('tieneLucarnas', v)} />
          </View>
          {form.tieneLucarnas && (
            <View className="mt-2">
              <Text className="text-base font-normal mb-2">Lucarnas</Text>
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Input label="N°" keyboardType="numeric" value={form.numeroLucarnas} onChangeText={(v) => handleChange('numeroLucarnas', v)} />
                </View>
                <View className="flex-1">
                  <Input label="Ancho (m)" keyboardType="numeric" value={form.anchoLucarna} onChangeText={(v) => handleChange('anchoLucarna', v)} />
                </View>
                <View className="flex-1">
                  <Input label="Alto (m)" keyboardType="numeric" value={form.altoLucarna} onChangeText={(v) => handleChange('altoLucarna', v)} />
                </View>
              </View>
            </View>
          )}

          {/* <View className="bg-gray-100 p-4 rounded-xl mt-6">
            <Text className="text-base font-medium">Superficie ventilación: {superficieTotal} m²</Text>
            <Text className="text-base">Porcentaje sobre el área total: {porcentaje} %</Text>
          </View> */}
        </ScrollView>

        <View className="absolute bottom-6 left-0 right-0 items-center">
          <Pressable
            onPress={async () => {
              try {
                const greenhouseToSave = {
                  ...form,
                  ventilation_area: superficieTotal,
                  ventilation_percent: porcentaje,
                };

                if (isEditMode) {
                  await updateGreenhouseById(Number(id), greenhouseToSave);
                  setSnackbarText('Invernadero actualizado ✅');
                } else {
                  await insertGreenhouse(greenhouseToSave);
                  setSnackbarText('Invernadero guardado ✅');
                }

                setSnackbarVisible(true);
                setTimeout(() => router.back(), 1500);
              } catch (error) {
                console.error('Error al guardar el invernadero:', error);
                setSnackbarText('Error al guardar el invernadero ❌');
                setSnackbarVisible(true);
              }
            }}
            className="flex-row items-center gap-2 bg-green-600 px-6 py-4 rounded-full shadow-lg"
            android_ripple={{ color: '#ffffff30', borderless: false }}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="white" />
            <Text className="text-white font-bold text-base">
              {isEditMode ? 'Actualizar' : 'Guardar'}
            </Text>
          </Pressable>
        </View>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={2000}
          action={{ label: 'OK', onPress: () => setSnackbarVisible(false) }}
          style={{ backgroundColor: snackbarText.includes('Error') ? 'red' : 'green' }}
        >
          {snackbarText}
        </Snackbar>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Input({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric';
}) {
  return (
    <View className="space-y-1 mb-4 min-w-0">
      <Text className="text-base">{label}</Text>
      <TextInput
        className="border border-gray-300 rounded-md px-3 py-2"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const dropdownStyle = {
  borderWidth: 1,
  borderColor: 'gray',
  borderRadius: 8,
  paddingHorizontal: 10,
  paddingVertical: 10,
  backgroundColor: '#fff',
};

const placeholderStyle = { color: 'gray', fontSize: 14 };
const selectedTextStyle = { fontSize: 14, color: 'black' };
const containerStyle = { borderRadius: 8 };