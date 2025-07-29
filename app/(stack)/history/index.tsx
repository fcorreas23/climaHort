import { useEffect, useState } from 'react';
import { ScrollView, Text, View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import DropdownSelector from '@/components/DropdownSelector';
import { getGreenhouses, getVPDRecordsByGreenhouseId } from '@/database/repository/greenhouseRepository';

const screenWidth = Dimensions.get('window').width;

export default function VPDHistoryScreen() {
  const [greenhouses, setGreenhouses] = useState<any[]>([]);
  const [selectedGreenhouse, setSelectedGreenhouse] = useState<any | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [selectedVariable, setSelectedVariable] = useState<'vpd' | 'temperature' | 'humidity' | 'soil_moisture'>('vpd');

  const variableOptions = [
    { label: 'VPD 📊', value: 'vpd' },
    { label: 'Temperatura 🌡️', value: 'temperature' },
    { label: 'Humedad relativa 💧', value: 'humidity' },
    { label: 'Humedad del suelo 🌱', value: 'soil_moisture' },
  ];

  useEffect(() => {
    getGreenhouses().then(setGreenhouses);
  }, []);

  useEffect(() => {
    if (selectedGreenhouse) {
      getVPDRecordsByGreenhouseId(selectedGreenhouse.id).then(setRecords);
    }
  }, [selectedGreenhouse]);

  const chartValues = records.map(rec => rec[selectedVariable]);
  const chartLabel = variableOptions.find(v => v.value === selectedVariable)?.label ?? '';

  return (
    <ScrollView className="flex-1 bg-[#f5f5f4] p-4">
      <Text className="text-2xl font-bold mb-4 text-center">📈 Historial por Invernadero</Text>

      {/* Selector de invernadero */}
      <DropdownSelector
        label="Selecciona un invernadero"
        data={greenhouses.map(g => ({ label: g.name, value: g.id }))}
        value={selectedGreenhouse?.id}
        onChange={(item) => {
          const gh = greenhouses.find(g => g.id === item.value);
          setSelectedGreenhouse(gh);
        }}
      />

      {selectedGreenhouse && (
        <>
          {/* <Text className="text-lg font-semibold mt-4 text-center">
            {selectedGreenhouse.name}
          </Text> */}

          {/* Selector de variable */}
          <DropdownSelector
            label="Variable a graficar"
            data={variableOptions}
            value={selectedVariable}
            onChange={(item) => setSelectedVariable(item.value)}
          />

          {/* Gráfico */}
          {records.length > 1 && (
            <View className="my-6">
              <Text className="text-base font-semibold text-center mb-2">{chartLabel}</Text>
              <LineChart
                data={{
                  labels: records.map(rec =>
                    new Date(rec.timestamp).toLocaleDateString('es-CL', {
                      day: '2-digit', month: '2-digit',
                    })
                  ),
                  datasets: [
                    {
                      data: chartValues,
                      color: () => '#10b981',
                      strokeWidth: 2,
                    },
                  ],
                }}
                width={screenWidth - 32}
                height={220}
                chartConfig={{
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 2,
                  color: () => '#374151',
                  labelColor: () => '#6b7280',
                  style: { borderRadius: 12 },
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 12,
                }}
              />
            </View>
          )}

          {/* Lista de registros */}
          {records.length === 0 ? (
            <Text className="text-gray-500 text-center mt-4">
              No hay registros aún para este invernadero.
            </Text>
          ) : (
            records.map((rec, idx) => (
              <View key={idx} className="border border-gray-200 rounded-xl p-4 mb-3 bg-gray-50">
                <Text className="text-sm text-gray-500 mb-2">
                  🕓 {new Date(rec.timestamp).toLocaleString()}
                </Text>
                <Text className="text-base">🌡️ Temp: {rec.temperature} °C</Text>
                <Text className="text-base">💧 Humedad: {rec.humidity} %</Text>
                <Text className="text-base">🌱 Suelo: {rec.soil_moisture} %</Text>
                <Text className="text-base font-semibold">📊 VPD: {rec.vpd.toFixed(2)} kPa</Text>
              </View>
            ))
          )}
        </>
      )}
    </ScrollView>
  );
}
