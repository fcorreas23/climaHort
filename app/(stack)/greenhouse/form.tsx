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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  const calcVentilacion = () => {
    const parse = (val: string) => parseFloat(val.replace(',', '.')) || 0;
    const area = parse(form.largo) * parse(form.ancho);
    const ventanas = form.tieneVentanas
      ? parse(form.numeroVentanas) * parse(form.anchoVentana) * parse(form.altoVentana)
      : 0;

    const lucarnas = form.tieneLucarnas
      ? parse(form.numeroLucarnas) * parse(form.anchoLucarna) * parse(form.altoLucarna)
      : 0;

    const total = ventanas + lucarnas;
    return {
      superficieTotal: total.toFixed(2),
      porcentaje: area > 0 ? ((total / area) * 100).toFixed(2) : '0',
    };
  };
    
  const handleChange = (key: string, value: string | boolean) => setForm({ ...form, [key]: value });
  
  const handleSave = async () => {
    
    const newErrors: any = {};
    if (!form.nombre) newErrors.nombre = 'Nombre requerido';
    if (!form.largo || isNaN(Number(form.largo))) newErrors.largo = 'Debe ser un número';
    if (!form.ancho || isNaN(Number(form.ancho))) newErrors.ancho = 'Debe ser un número';
    if (!form.alturaCanal || isNaN(Number(form.alturaCanal))) newErrors.alturaCanal = 'Debe ser un número';
    if (!form.alturaTecho || isNaN(Number(form.alturaTecho))) newErrors.alturaTecho = 'Debe ser un número';
    if (form.tieneVentanas && (!form.numeroVentanas || isNaN(Number(form.numeroVentanas)))) {
      newErrors.numeroVentanas = 'Número inválido';
    }
    if (form.tieneLucarnas && (!form.numeroLucarnas || isNaN(Number(form.numeroLucarnas)))) {
      newErrors.numeroLucarnas = 'Número inválido';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setSnackbarText('Completa todos los campos requeridos correctamente.');
      setVisible(true);
      return;
    }

    const { superficieTotal, porcentaje } = calcVentilacion();

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
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <SectionTitle>🛠️ Información general</SectionTitle>
        <TextInputField label="Nombre" value={form.nombre} onChange={t => handleChange('nombre', t)} />
        <DropdownSelector label="Tipo" data={types.map(t => ({ label: t, value: t }))} value={form.tipo} onChange={i => handleChange('tipo', i.value)} />
        <DropdownSelector label="Material de cubierta" data={covers.map(c => ({ label: c, value: c }))} value={form.materialCubierta} onChange={i => handleChange('materialCubierta', i.value)} />

        <SectionTitle>📐 Dimensiones</SectionTitle>
        <NumericInputField label="Largo (m)" value={form.largo} onChange={v => handleChange('largo', v)} error={errors.largo} />
        <NumericInputField label="Ancho (m)" value={form.ancho} onChange={v => handleChange('ancho', v)} error={errors.ancho} />
        <NumericInputField label="Altura a la canal (m)" value={form.alturaCanal} onChange={v => handleChange('alturaCanal', v)} error={errors.alturaCanal} />
        <NumericInputField label="Altura del techo (m)" value={form.alturaTecho} onChange={v => handleChange('alturaTecho', v)} error={errors.alturaTecho} />

        <SectionTitle>🪟 Ventanas</SectionTitle>
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-base font-medium">¿Tiene ventanas?</Text>
          <Switch value={form.tieneVentanas} onValueChange={v => handleChange('tieneVentanas', v)} />
        </View>
        {form.tieneVentanas && (
          <>
            <NumericInputField label="Número" value={form.numeroVentanas} onChange={v => handleChange('numeroVentanas', v)} error={errors.numeroVentanas} />
            <NumericInputField label="Ancho (m)" value={form.anchoVentana} onChange={v => handleChange('anchoVentana', v)} />
            <NumericInputField label="Alto (m)" value={form.altoVentana} onChange={v => handleChange('altoVentana', v)} />
          </>
        )}

        <SectionTitle>🔺 Lúcarnas</SectionTitle>
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-base font-medium">¿Tiene lúcarnas?</Text>
          <Switch value={form.tieneLucarnas} onValueChange={v => handleChange('tieneLucarnas', v)} />
        </View>
        {form.tieneLucarnas && (
          <>
            <NumericInputField label="Número" value={form.numeroLucarnas} onChange={v => handleChange('numeroLucarnas', v)} error={errors.numeroLucarnas} />
            <NumericInputField label="Ancho (m)" value={form.anchoLucarna} onChange={v => handleChange('anchoLucarna', v)} />
            <NumericInputField label="Alto (m)" value={form.altoLucarna} onChange={v => handleChange('altoLucarna', v)} />
          </>
        )}

        
        {form.largo && form.ancho && (
          <View className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <Text className="text-base font-semibold mb-1 text-blue-700">💨 Cálculo de ventilación</Text>
            <Text className="text-sm text-gray-700">
              Superficie de ventilación: {calcVentilacion().superficieTotal} m²
            </Text>
            <Text className="text-sm text-gray-700">
              Porcentaje de ventilación: {calcVentilacion().porcentaje} %
            </Text>
          </View>
        )}

        <Pressable onPress={handleSave} className="mt-6 bg-green-600 py-4 rounded-lg items-center">

          <Text className="text-white font-bold text-lg">Guardar</Text>
        </Pressable>
      </ScrollView>
      <Snackbar visible={visible} onDismiss={() => setVisible(false)}>{snackbarText}</Snackbar>
    </KeyboardAvoidingView>
  );
}
