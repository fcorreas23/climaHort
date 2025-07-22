import React from 'react';
import { View, Text } from 'react-native';

const CropCard = ({
    icon,
    name,
    vpd_optimal,
    vpd_acceptable,
    advice,
}: {
    icon: string;
    name: string;
    vpd_optimal: string;
    vpd_acceptable: string;
    advice: string;
}) => (
    <View className="border border-gray-200 bg-white rounded-xl p-4 mb-3 shadow-sm mx-1">
        <Text className="text-2xl font-semibold mb-1">{icon} {name}</Text>
        <Text className="text-base text-gray-600 mb-1">VPD óptimo: {vpd_optimal}</Text>
        <Text className="text-base text-gray-600 mb-1">VPD aceptable: {vpd_acceptable}</Text>
        <Text className="text-base text-gray-700">💡 {advice}</Text>
    </View>
);

export default CropCard;