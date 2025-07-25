import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  Modal
} from 'react-native';
import { getGreenhouses, insertVPDRecord } from '@/database/repository/greenhouseRepository';
import { vpdRanges } from "@/store/vpdRanges";
import DropdownSelector from '@/components/DropdownSelector';
import NumericInputField from '@/components/NumericInputField';
import { calculateVPD, getVPDStatus } from '@/utils/vpdUtils';
import { getSoilMeasureStatus } from '@/utils/soilUtils';
import { getDiagnostic } from '@/utils/diagnostic'

export default function VPDCalculatorScreen() {
  const [crop, setCrop] = useState('');
  const [temp, setTemp] = useState('');
  const [humidity, setHumidity] = useState('');
  const [soilType, setSoilType] = useState('');
  const [soilmoisture, setSoilMoisture] = useState('');
  const [greenhouses, setGreenhouses] = useState<any[]>([]);
  const [selectedGreenhouse, setSelectedGreenhouse] = useState<any | null>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [diagnostico, setDiagnostico] = useState<any | null>(null);
  const [vpd, setVpd] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [errors, setErrors] = useState({
    temp: '',
    humidity: '',
    soilMoisture: '',
    crop: '',
    greenhouse: '',
    soilType: ''
  });

  useEffect(() => {
    getGreenhouses().then(setGreenhouses);
  }, []);

  const handleCalculate = () => {
    const newErrors: any = {};

    if (!temp || isNaN(Number(temp))) newErrors.temp = 'Temperatura inválida';
    if (!humidity || isNaN(Number(humidity))) newErrors.humidity = 'Humedad inválida';
    if (!soilmoisture || isNaN(Number(soilmoisture))) newErrors.soilMoisture = 'Humedad de suelo inválida';
    if (!crop) newErrors.crop = 'Selecciona un cultivo';
    if (!selectedGreenhouse) newErrors.greenhouse = 'Selecciona un invernadero';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setDiagnosis('Por favor completa todos los campos correctamente.');
      setVpd(null);
      return;
    }

    const vpd = calculateVPD( Number(temp), Number(humidity));
    setVpd(vpd)
    const vpdEstado = getVPDStatus(vpd, crop);
    const humedadEstado = getSoilMeasureStatus(soilType, Number(soilmoisture))

    //Diagnostico
    const result = getDiagnostic( vpdEstado, humedadEstado )
    setDiagnostico(result);
    setModalVisible(true);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-2xl font-bold text-center mb-6 text-green-700">🌿 Calculadora</Text>

        {/*<Text className="text-xl font-semibold mb-2 text-gray-700">📍 Datos del invernadero</Text>*/}
        <DropdownSelector
          label="Invernadero"
          data={greenhouses.map(g => ({ label: g.name, value: g.id }))}
          value={selectedGreenhouse?.id}
          onChange={item => setSelectedGreenhouse(greenhouses.find(g => g.id === item.value))}
        />
        {errors.greenhouse && <Text className="text-red-500 text-sm mb-2">{errors.greenhouse}</Text>}
        {/* <Text className="text-xl font-semibold mb-2 mt-6 text-gray-700">🌱 Tipo de cultivo</Text> */}
        <DropdownSelector
          label="Cultivo"
          data={vpdRanges.map(c => ({ label: c.crop, value: c.crop }))}
          value={crop}
          onChange={item => setCrop(item.value)}
        />
        {errors.crop && <Text className="text-red-500 text-sm mb-2">{errors.crop}</Text>}

        {/* <Text className="text-xl font-semibold mb-2 mt-6 text-gray-700">🧱 Tipo de suelo</Text> */}
        <DropdownSelector
          label="Tipo de suelo"
          data={[
            { label: 'Franco-arenoso', value: 'Franco-arenoso' },
            { label: 'Franco-arcilloso', value: 'Franco-arcilloso' },
            { label: 'Franco-limoso', value: 'Franco-limoso' },
          ]}
          value={soilType}
          onChange={item => setSoilType(item.value)}
        />
        {errors.soilType && <Text className="text-red-500 text-sm mb-2">{errors.soilType}</Text>}


        <Text className="text-xl font-semibold mb-2 mt-6 text-gray-700">🌡️ Condiciones climáticas</Text>
        <NumericInputField label="Temperatura ambiental (°C)" value={temp} onChange={setTemp} error={errors.temp} />
        <NumericInputField label="Humedad relativa (%)" value={humidity} onChange={setHumidity} error={errors.humidity} />
        <NumericInputField label="Humedad del suelo (%)" value={soilmoisture} onChange={setSoilMoisture} error={errors.soilMoisture} />

        <Pressable onPress={handleCalculate} className="mt-6 bg-green-600 py-4 rounded-xl items-center shadow-lg">
          <Text className="text-white font-bold text-lg">🚀 Calcular VPD</Text>
        </Pressable>

        {diagnosis !== '' && vpd === null && (
          <View className="mt-6 bg-red-100 border border-red-300 rounded p-4">
            <Text className="text-red-700">{diagnosis}</Text>
          </View>
        )}
      </ScrollView>

      {/* MODAL DE RESULTADO */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-6">
          <View className="w-full bg-white p-6 rounded-2xl shadow-lg">
            {diagnostico && (
              <>
                <Text className="text-xl font-bold text-center mb-2">📊 Diagnóstico</Text>
                <Text className="text-4xl font-extrabold text-center text-gray-800 mb-2">VPD: {vpd?.toFixed(2)}</Text>
                <Text className="text-base text-center mb-2 text-gray-700">{diagnostico.mensaje}</Text>
                <Text className="text-sm text-center mb-2 text-gray-600">{diagnostico.recomendacion}</Text>
                {diagnostico.patogenos && (
                  <Text className={`text-sm text-center ${diagnostico.patogenos === 'Alto' ? 'text-red-600' : 'text-yellow-600'}`}>
                    🧫 Riesgo de patógenos: {diagnostico.patogenos}
                  </Text>
                )}
              </>
            )}

            {/* Botón Guardar */}
            <Pressable
              onPress={() => {
                if (selectedGreenhouse && vpd !== null) {
                  insertVPDRecord({
                    greenhouse_id: selectedGreenhouse.id,
                    timestamp: Date.now(),
                    temperature: Number(temp),
                    humidity: Number(humidity),
                    soil_moisture: Number(soilmoisture),
                    vpd: vpd
                  });
                  setModalVisible(false); // Cierra el modal después de guardar
                }
              }}
              className="mt-4 bg-blue-600 py-2 px-4 rounded-lg items-center"
            >
              <Text className="text-white font-semibold text-base">💾 Guardar diagnóstico</Text>
            </Pressable>

            {/* Botón Cerrar */}
            <Pressable
              onPress={() => setModalVisible(false)}
              className="mt-2 bg-gray-400 py-2 px-4 rounded-lg items-center"
            >
              <Text className="text-white font-semibold text-base">Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
