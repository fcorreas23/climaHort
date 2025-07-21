import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import DropdownSelector from '@/components/DropdownSelector';
import { getGreenhouses } from '@/database/repository/greenhouseRepository';
import { getVPDRecordsByGreenhouseId } from '@/database/repository/greenhouseRepository';

export default function VPDHistoryScreen() {
  const [greenhouses, setGreenhouses] = useState<any[]>([]);
  const [selectedGreenhouse, setSelectedGreenhouse] = useState<any | null>(null);
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    getGreenhouses().then(setGreenhouses);
  }, []);

  useEffect(() => {
    if (selectedGreenhouse) {
      getVPDRecordsByGreenhouseId(selectedGreenhouse.id).then(setRecords);
    }
  }, [selectedGreenhouse]);

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4 text-center">📈 Historial VPD por Invernadero</Text>

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
          <Text className="text-lg font-semibold mt-4 mb-2 text-center">
            {selectedGreenhouse.name}
          </Text>

          {records.length === 0 ? (
            <Text className="text-gray-500 text-center">No hay registros aún para este invernadero.</Text>
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
