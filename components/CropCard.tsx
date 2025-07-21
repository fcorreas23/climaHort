import React from 'react';
import { View, Text } from 'react-native';

const CropCard = ({
    icon,
    name,
    vpd,
    advice,
}: {
    icon: string;
    name: string;
    vpd: string;
    advice: string;
}) => (
    <View className="border border-gray-200 bg-white rounded-xl p-4 mb-3 shadow-sm mx-1">
        <Text className="text-xl font-semibold mb-1">{icon} {name}</Text>
        <Text className="text-sm text-gray-600 mb-1">🌡️ VPD óptimo: {vpd}</Text>
        <Text className="text-sm text-gray-700">💡 {advice}</Text>
    </View>
);

export default CropCard;