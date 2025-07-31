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
import { vpdRanges } from '@/store/vpdRanges';
import DropdownSelector from '@/components/DropdownSelector';
import NumericInputField from '@/components/NumericInputField';
import { calculateVPD, getVPDStatus } from '@/utils/vpdUtils';
import { getSoilMeasureStatus } from '@/utils/soilUtils';
import { getDiagnostic } from '@/utils/diagnostic';
import { getTempStatus } from '@/utils/tempUtils';

export default function VPDCalculatorScreen() {
  const [crop, setCrop] = useState('');
  const [temp, setTemp] = useState('');
  const [humidity, setHumidity] = useState('');
  const [soilType, setSoilType] = useState('');
  const [soilmoisture, setSoilMoisture] = useState('');
  const [greenhouses, setGreenhouses] = useState<any[]>([]);
  const [selectedGreenhouse, setSelectedGreenhouse] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [vpd, setVpd] = useState<number | null>(null);
  const [vpdEstado, setVpdEstado] = useState('');
  const [humedadEstado, setHumedadEstado] = useState('');
  const [tempMessage, setTempMessage] = useState('');
  const [diagnostico, setDiagnostico] = useState<any | null>(null);

  const [errors, setErrors] = useState({
    temp: '', humidity: '', soilMoisture: '', crop: '', greenhouse: '', soilType: ''
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
    if (!soilType) newErrors.soilType = 'Selecciona un tipo de suelo';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const calculatedVPD = calculateVPD(Number(temp), Number(humidity));
    const estadoVPD = getVPDStatus(calculatedVPD, crop);
    const estadoHumedad = getSoilMeasureStatus(soilType, Number(soilmoisture));
    const estadoTemp = getTempStatus(Number(temp), crop);

    setVpd(calculatedVPD);
    setVpdEstado(estadoVPD);
    setHumedadEstado(estadoHumedad);
    setTempMessage(estadoTemp);
    setDiagnostico(getDiagnostic(estadoVPD, estadoHumedad));
    setModalVisible(true);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-gradient-to-b from-white via-[#f5f5f4] to-[#e7e5e4]">
      <ScrollView contentContainerStyle={{ padding: 16 }}>

        {/* 📍 Invernadero y cultivo */}
        <View className="mb-6">
          <DropdownSelector label="Invernadero" data={greenhouses.map(g => ({ label: g.name, value: g.id }))} value={selectedGreenhouse?.id} onChange={item => setSelectedGreenhouse(greenhouses.find(g => g.id === item.value))} />
          {errors.greenhouse && <Text className="text-red-500 text-sm">{errors.greenhouse}</Text>}
        </View>

        <View className="mb-6">
          <DropdownSelector label="Cultivo" data={vpdRanges.map(c => ({ label: c.crop, value: c.crop }))} value={crop} onChange={item => setCrop(item.value)} />
          {errors.crop && <Text className="text-red-500 text-sm">{errors.crop}</Text>}
        </View>

        {/* 🧱 Tipo de suelo */}
        <View className="mb-6">
          <DropdownSelector label="Tipo de suelo" data={[{ label: 'Franco-arenoso', value: 'Franco-arenoso' },{ label: 'Franco-arcilloso', value: 'Franco-arcilloso' },{ label: 'Franco-limoso', value: 'Franco-limoso' },{ label: 'Trumao (Andisol)', value:'Trumao'}]} value={soilType} onChange={item => setSoilType(item.value)} />
          {errors.soilType && <Text className="text-red-500 text-sm">{errors.soilType}</Text>}
        </View>

        {/* 🌡️ Condiciones climáticas */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-700 mb-2">🌡️ Condiciones climáticas</Text>
          <NumericInputField label="Temperatura ambiental (°C)" value={temp} onChange={setTemp} error={errors.temp} />
          <NumericInputField label="Humedad relativa (%)" value={humidity} onChange={setHumidity} error={errors.humidity} />
          <NumericInputField label="Humedad del suelo (%)" value={soilmoisture} onChange={setSoilMoisture} error={errors.soilMoisture} />
        </View>

        <Pressable onPress={handleCalculate} className="mt-4 bg-green-600 py-4 rounded-xl items-center shadow-lg">
          <Text className="text-white font-bold text-lg">🚀 Calcular</Text>
        </Pressable>
      </ScrollView>

      {/* Modal diagnóstico */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-6">
          <View className="w-full bg-white p-6 rounded-2xl shadow-lg">
            <Text className="text-2xl font-bold text-center mb-4">📊 Diagnóstico</Text>

            <View className="mb-4 space-y-1">
              <Text className="text-center text-gray-700">🌬️ VPD: <Text className="font-semibold">{vpd?.toFixed(2)} kPa</Text> ({vpdEstado})</Text>
              <Text className="text-center text-gray-700">🌡️ Temperatura: <Text className="font-semibold">{tempMessage}</Text></Text>
              <Text className="text-center text-gray-700">💧 Suelo: <Text className="font-semibold">{humedadEstado}</Text></Text>
            </View>

            {diagnostico && (
              <View className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md shadow-sm mb-4">
                <Text className="text-gray-800 font-semibold text-center">{diagnostico.mensaje}</Text>
                <Text className="text-gray-600 text-center mt-1">{diagnostico.recomendacion}</Text>
              </View>
            )}

            {diagnostico?.patogenos && (
              <Text className={`text-lg text-center ${diagnostico.patogenos === 'Alto' ? 'text-red-600' : 'text-yellow-600'}`}>🦠 Riesgo de patógenos: {diagnostico.patogenos}</Text>
            )}

            <Pressable
              onPress={() => {
                if (selectedGreenhouse && vpd !== null) {
                  insertVPDRecord({ greenhouse_id: selectedGreenhouse.id, timestamp: Date.now(), temperature: Number(temp), humidity: Number(humidity), soil_moisture: Number(soilmoisture), vpd });
                  setModalVisible(false);
                }
              }}
              className="mt-4 bg-blue-600 py-2 px-4 rounded-lg items-center"
            >
              <Text className="text-white font-semibold">💾 Guardar diagnóstico</Text>
            </Pressable>

            <Pressable onPress={() => setModalVisible(false)} className="mt-2 bg-gray-400 py-2 px-4 rounded-lg items-center">
              <Text className="text-white font-semibold">Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
