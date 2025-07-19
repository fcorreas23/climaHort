import { 
  View, 
  Text, 
  Switch, 
  ScrollView, 
  Pressable, 
  KeyboardAvoidingView, 
  Platform, 
  SafeAreaView 
} from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Snackbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

import DropdownSelector from '@/components/DropdownSelector';
import NumericInputField from '@/components/NumericInputField';
import SectionTitle from '@/components/SectionTitle';
import TextInputField from '@/components/TextInputField';
import {
  insertGreenhouse,
  updateGreenhouseById,
  getGreenhouseById,
} from '@/database/repository/greenhouseRepository';

const types = ['Capilla', 'Túnel'];
const covers = ['Polietileno', 'Policarbonato'];

export default function GreenhouseForm() {
  const { id } = useLocalSearchParams();
  const isEditMode = !!id;
  const router = useRouter();
  
  const [snackbarText, setSnackbarText] = useState('');
  const [visible, setVisible] = useState(false);

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
    if (!isEditMode) return;
    getGreenhouseById(Number(id)).then(data => {
      if (!data) return;
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
    });
  }, [id]);

  const handleChange = (key: string, value: string | boolean) => setForm({ ...form, [key]: value });
  const parse = (val: string) => parseFloat(val.replace(',', '.')) || 0;

  const calcVentilacion = () => {
    const area = parse(form.largo) * parse(form.ancho);
    const ventanas = parse(form.numeroVentanas) * parse(form.anchoVentana) * parse(form.altoVentana);
    const lucarnas = parse(form.numeroLucarnas) * parse(form.anchoLucarna) * parse(form.altoLucarna);
    const total = ventanas + lucarnas;
    return {
      superficieTotal: total.toFixed(2),
      porcentaje: area > 0 ? ((total / area) * 100).toFixed(2) : '0',
    };
  };

  const { superficieTotal, porcentaje } = calcVentilacion();

  const handleSave = async () => {
    try {
      const data = { ...form, ventilation_area: superficieTotal, ventilation_percent: porcentaje };
      if (isEditMode) {
        await updateGreenhouseById(Number(id), data);
        setSnackbarText('Invernadero actualizado ✅');
      } else {
        await insertGreenhouse(data);
        setSnackbarText('Invernadero guardado ✅');
      }
      setVisible(true);
      setTimeout(() => router.back(), 1500);
    } catch (err) {
      console.error('Error guardando invernadero:', err);
      setSnackbarText('Error al guardar ❌');
      setVisible(true);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView className="p-4">
          <Text className="text-2xl font-bold mb-2">{isEditMode ? 'Editar Invernadero' : 'Registrar Invernadero'}</Text>

          <TextInputField label="Nombre" value={form.nombre} onChange={(v) => handleChange('nombre', v)} />
          <DropdownSelector label="Tipo de invernadero" data={types.map(t => ({ label: t, value: t }))} value={form.tipo} onChange={(i) => handleChange('tipo', i.value)} />
          <DropdownSelector label="Material de cubierta" data={covers.map(c => ({ label: c, value: c }))} value={form.materialCubierta} onChange={(i) => handleChange('materialCubierta', i.value)} />
          
          <SectionTitle>Dimensiones</SectionTitle>
          <NumericInputField label="Largo (m)" value={form.largo} onChange={(v) => handleChange('largo', v)} />
          <NumericInputField label="Ancho (m)" value={form.ancho} onChange={(v) => handleChange('ancho', v)} />
          <NumericInputField label="Altura canal (m)" value={form.alturaCanal} onChange={(v) => handleChange('alturaCanal', v)} />
          <NumericInputField label="Altura techo (m)" value={form.alturaTecho} onChange={(v) => handleChange('alturaTecho', v)} />
          
          <SectionTitle>Ventanas</SectionTitle>
          <Switch value={form.tieneVentanas} onValueChange={(v) => handleChange('tieneVentanas', v)} />
          {form.tieneVentanas && (
            <>
              <NumericInputField label="N°" value={form.numeroVentanas} onChange={(v) => handleChange('numeroVentanas', v)} />
              <NumericInputField label="Ancho (m)" value={form.anchoVentana} onChange={(v) => handleChange('anchoVentana', v)} />
              <NumericInputField label="Alto (m)" value={form.altoVentana} onChange={(v) => handleChange('altoVentana', v)} />
            </>
          )}

          <SectionTitle>Lucarnas</SectionTitle>
          <Switch value={form.tieneLucarnas} onValueChange={(v) => handleChange('tieneLucarnas', v)} />
          {form.tieneLucarnas && (
            <>
              <NumericInputField label="N°" value={form.numeroLucarnas} onChange={(v) => handleChange('numeroLucarnas', v)} />
              <NumericInputField label="Ancho (m)" value={form.anchoLucarna} onChange={(v) => handleChange('anchoLucarna', v)} />
              <NumericInputField label="Alto (m)" value={form.altoLucarna} onChange={(v) => handleChange('altoLucarna', v)} />
            </>
          )}

          {/* <View className="bg-gray-100 p-4 rounded-xl mt-6">
            <Text className="text-base font-medium">Superficie ventilación: {superficieTotal} m²</Text>
            <Text className="text-base">Porcentaje sobre el área total: {porcentaje} %</Text>
          </View> */}
        </ScrollView>

        <Pressable onPress={handleSave} className="m-6 bg-green-600 rounded-full py-4 items-center flex-row justify-center gap-2">
          <Ionicons name="checkmark-circle-outline" size={20} color="white" />
          <Text className="text-white font-bold text-base">{isEditMode ? 'Actualizar' : 'Guardar'}</Text>
        </Pressable>

        <Snackbar visible={visible} onDismiss={() => setVisible(false)} duration={2000} action={{ label: 'OK', onPress: () => setVisible(false) }} style={{ backgroundColor: snackbarText.includes('Error') ? 'red' : 'green' }}>
          {snackbarText}
        </Snackbar>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
