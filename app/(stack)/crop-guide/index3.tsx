// app/(stack)/crop-guide.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { vpdRanges } from '@/store/vpdRanges';

const cropIcons: Record<string, string> = {
  Acelga: '🥬',
  Ajo: '🧄',
  Betarraga: '🟣',
  Cilantro: '🌱',
  Espinaca: '🌿',
  Lechuga: '🥬',
  Pepino: '🥒',
  Pimentón: '🫑',
  Rábano: '🫜',
  Tomate: '🍅',
};

export default function CropGuideScreen() {
  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-6 text-center">📘 Guía de Cultivos y VPD</Text>

      {vpdRanges.map((crop, index) => {
        const [minStress, maxStress] = crop.stressLimits;
        const optimal =
          Array.isArray(crop.optimal)
            ? `${crop.optimal[0]} – ${crop.optimal[1]}`
            : `${crop.optimal}`;
        const icon = cropIcons[crop.crop] || '🌱';

        return (
          <View
            key={index}
            className="border border-gray-300 rounded-xl p-4 mb-4 bg-gray-50"
          >
            <Text className="text-2xl font-bold mb-1">{icon} {crop.crop}</Text>
            <Text className="text-lg text-gray-800">VPD óptimo: {optimal} kPa</Text>
            <Text className="text-lg text-gray-800">
              Rango aceptable: {minStress} – {maxStress} kPa
            </Text>
            <Text className="text-lg text-red-600 mt-1">
              Riesgo de estrés si VPD &lt; {minStress} o &gt; {maxStress}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}
