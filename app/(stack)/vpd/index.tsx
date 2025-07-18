import { calculateVPD, getVPDStatus } from '@/utils/vpdUtils';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { vpdRanges } from "../../../store/vpdRanges";
import { Dropdown } from 'react-native-element-dropdown';




function getStatusColorClass(status: string) {
  if (status.includes('Óptimo')) return 'bg-green-100 text-green-800 border-green-300';
  if (status.includes('Estrés')) return 'bg-red-100 text-red-800 border-red-300';
  if (status.includes('Aceptable')) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  if (status.includes('Muy bajo')) return 'bg-blue-100 text-blue-800 border-blue-300';
  return 'bg-gray-100 text-gray-800 border-gray-300';
}


export default function VPDCalculatorScreen() {
  const [crop, setCrop] = useState<string>('');
  const [temp, setTemp] = useState('');
  const [humidity, setHumidity] = useState('');
  const [soilmoisture, setSoilMoisture] = useState('');
  const [vpd, setVpd] = useState<number | null>(null);
  const [result, setResult] = useState('');

  const handleCalculate = () => {
    const t = parseFloat(temp);
    const h = parseFloat(humidity);

    if (isNaN(t) || isNaN(h) || !crop) {
      setResult('Completa todos los campos correctamente');
      return;
    }

    const v = calculateVPD(t, h);
    const status = getVPDStatus(v, crop);
    setVpd(v);
    setResult(status);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 10 }}>
        <Text className="text-2xl font-bold text-center mb-6">Calculadora de VPD</Text>   
        <Text className="mb-1 text-base">Selecciona el cultivo:</Text>
        <Dropdown
          data={vpdRanges.map(c => ({ label: c.crop, value: c.crop }))}
          labelField="label"
          valueField="value"
          placeholder="Selecciona un cultivo..."
          value={crop}
          onChange={item => setCrop(item.value)}
          style={{
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 12,
            backgroundColor: '#fff',
          }}
          placeholderStyle={{
            color: 'gray',
            fontSize: 16,
          }}
          selectedTextStyle={{
            fontSize: 16,
            color: 'black',
          }}
          containerStyle={{
            borderRadius: 8,
          }}
        />

        {/* TEMP */}
        <View className="flex-row items-center justify-between mt-5 mb-4">
          <Text className="text-xl font-bold">Temperatura (°C)</Text>
          <TextInput
            keyboardType="numeric"
            value={temp}
            onChangeText={setTemp}
            className="w-28 h-14 border border-gray-400 rounded-md px-4 text-right text-xl"
            placeholder="°C"
          />
        </View>
        {/* HUMEDAD */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold">Humedad Relativa (%)</Text>
          <TextInput
            keyboardType="numeric"
            value={humidity}
            onChangeText={setHumidity}
            className="w-28 h-14 border border-gray-400 rounded-md px-4 text-right text-xl"
            placeholder="%"
          />
        </View>
        {/* HUMEDAD SUELO */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold">Humedad del Suelo (%)</Text>
          <TextInput
            keyboardType="numeric"
            value={soilmoisture}
            onChangeText={setSoilMoisture}
            className="w-28 h-14 border border-gray-400 rounded-md px-4 text-right text-xl"
            placeholder="%"
          />
        </View>

         {/* Botón */}
        <Pressable onPress={handleCalculate} className="bg-green-600 px-6 py-3 mt-4 rounded self-center">
          <Text className="text-white text-lg text-center font-bold">Calcular VPD</Text>
        </Pressable>

        {/* Resultado */}
        {result !== '' && vpd === null && (
          <View className="mt-6 bg-red-100 border border-red-300 rounded p-4">
            <Text className="text-red-700">{result}</Text>
          </View>
        )}

        {vpd !== null && (
          <View className={`mt-6 p-4 rounded border ${getStatusColorClass(result)}`}>
            <Text className="text-3xl font-semibold">🌡️ VPD: {vpd} kPa</Text>
            <Text className="text-2xl mt-2">{result}</Text>
          </View>
      )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
