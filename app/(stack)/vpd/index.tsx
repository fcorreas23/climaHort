import { useEffect, useState } from 'react';
import { 
  KeyboardAvoidingView, 
  Platform, 
  Pressable, 
  ScrollView, 
  Text,  
  View 
} from 'react-native';
import { getGreenhouses, insertVPDRecord } from '@/database/repository/greenhouseRepository';
import { vpdRanges } from "@/store/vpdRanges";
import DropdownSelector from '@/components/DropdownSelector';
import NumericInputField from '@/components/NumericInputField';
import { runFullDiagnosis } from '@/utils/diagnosticHandler';


export default function VPDCalculatorScreen() {
  const [crop, setCrop] = useState('');
  const [temp, setTemp] = useState('');
  const [humidity, setHumidity] = useState('');
  const [soilmoisture, setSoilMoisture] = useState('');
  const [greenhouses, setGreenhouses] = useState<any[]>([]);
  const [selectedGreenhouse, setSelectedGreenhouse] = useState<any | null>(null);
  const [status, setStatus] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [vpd, setVpd] = useState<number | null>(null);
  
  

  useEffect(() => {
    getGreenhouses().then(setGreenhouses);
  }, []);


  const handleCalculate = () => {
    const { vpd, status, message, error } = runFullDiagnosis(temp, humidity, soilmoisture, crop, selectedGreenhouse);
    if (error) {
      setDiagnosis(error);
      setVpd(null);
      return;
    }
    setVpd(vpd!);
    setStatus(status?? '');
    setDiagnosis(message ?? '');

  };


  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 12 }}>
        <Text className="text-2xl font-bold text-center mb-6">Calculadora de VPD</Text>   
        
        <DropdownSelector label="Invernadero" data={greenhouses.map(g => ({ label: g.name, value: g.id }))} value={selectedGreenhouse?.id} onChange={item => setSelectedGreenhouse(greenhouses.find(g => g.id === item.value))} />
        <DropdownSelector label="Cultivo" data={vpdRanges.map(c => ({ label: c.crop, value: c.crop }))} value={crop} onChange={item => setCrop(item.value)} />
        

        <NumericInputField label="Temperatura ambiental (°C)" value={temp} onChange={setTemp} />
        <NumericInputField label="Humedad relativa (%)" value={humidity} onChange={setHumidity} />
        <NumericInputField label="Humedad del suelo (%)" value={soilmoisture} onChange={setSoilMoisture} />


        <Pressable  onPress={handleCalculate} className="mt-6 bg-green-600 py-4 rounded-lg items-center">
          <Text className="text-white font-bold text-lg">Calcular VPD</Text>
        </Pressable>

        {diagnosis !== '' && vpd === null && (
          <View className="mt-6 bg-red-100 border border-red-300 rounded p-4">
            <Text className="text-red-700">{diagnosis}</Text>
          </View>
        )}

        {vpd !== null && (
          <View className={`mt-6 p-4 rounded border ${getStatusColorClass(status)}`}>
            <Text className="text-4xl font-semibold mb-2">VPD: {vpd} kPa</Text>
            <Text className="mt-1 text-2xl">{diagnosis}</Text>
            <Pressable
              onPress={async () => {
                try {
                  await insertVPDRecord({
                    greenhouse_id: selectedGreenhouse.id,
                    timestamp: Date.now(),
                    temperature: parseFloat(temp),
                    humidity: parseFloat(humidity),
                    soil_moisture: parseFloat(soilmoisture),
                    vpd: vpd,
                  });
                  alert('✅ Diagnóstico guardado correctamente.');
                } catch (e) {
                  console.error(e);
                  alert('❌ Ocurrió un error al guardar.');
                }
              }}
              className="bg-green-600 p-3 mt-4 rounded-xl"
            >
              <Text className="text-white text-center font-semibold">Guardar diagnóstico</Text>
            </Pressable>
          </View>
      )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function getStatusColorClass(status: string) {
  if (status === 'optimal') return 'bg-green-100 text-green-800 border-green-300';
  if (status === 'low' || status === 'high') return 'bg-red-100 text-red-800 border-red-300';
  if (status === 'acceptable') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  return 'bg-gray-100 text-gray-800 border-gray-300';
}
