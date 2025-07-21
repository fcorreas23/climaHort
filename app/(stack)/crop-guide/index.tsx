import React, { useState } from 'react';
import { View, Text, useWindowDimensions, ScrollView } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import cropData from '@/store/cropData.json';
import CropCard from '@/components/CropCard';



// Componente 1: ¿Qué es el VPD?
const VPDInfo = () => (
    <ScrollView className="p-4 bg-white">
        <Text className="text-xl font-bold mb-2">📘 ¿Qué es el VPD?</Text>
        <Text className="text-base text-gray-700 mb-4">
            El Déficit de Presión de Vapor ( VPD ) representa la diferencia entre la cantidad de vapor que el aire puede contener y la que realmente contiene. Es un indicador de la demanda evaporativa de la atmósfera. Un VPD óptimo favorece la transpiración y el crecimiento de las plantas.
        </Text>

        <Text className="text-lg font-semibold">🔵 VPD Bajo:</Text>
        <Text className="text-base text-gray-600 mb-2">
            El ambiente está muy húmedo. La planta transpira poco, lo que reduce la absorción de nutrientes y puede aumentar el riesgo de enfermedades. Se recomienda mejorar la ventilación y evitar el exceso de riego.
        </Text>

        <Text className="text-lg font-semibold">🟢 VPD Óptimo:</Text>
        <Text className="text-base text-gray-600 mb-2">
            Las condiciones son ideales para la transpiración y el crecimiento. Mantén el manejo actual de riego y ventilación.
        </Text>

        <Text className="text-lg font-semibold">🔴 VPD Alto:</Text>
        <Text className="text-base text-gray-600 mb-4">
            El aire está muy seco y las plantas pierden mucha agua. Puede producir estrés hídrico si no se riega a tiempo. Aumenta la humedad del ambiente y evalúa el riego.
        </Text>

        <Text className="text-sm text-gray-500">*Basado en temperatura, humedad relativa y condiciones del cultivo.</Text>

        <Text className="text-xl font-bold mb-2">📘 ¿Cuando regar?</Text>
        <Text className="text-base text-gray-700 mb-4">
            El VPD es un indicador clave para determinar cuándo regar tus plantas. Un VPD óptimo indica que las plantas están bien hidratadas y pueden absorber nutrientes de manera eficiente. Si el VPD es demasiado bajo, las plantas pueden estar sobrehidratadas, mientras que un VPD alto puede indicar que necesitan más agua.
        </Text>

        <Text className="text-xl font-bold mb-2">📘 ¿Cuando ventilar?</Text>
        <Text className="text-base text-gray-700 mb-4">
            La ventilación es crucial para mantener un VPD óptimo. Ventila cuando el VPD sea bajo y la humedad esté alta para evitar enfermedades. También es útil ventilar si hay condensación o si el ambiente está demasiado caliente.
        </Text>

    </ScrollView>
);

const CropGuide = () => (
    <ScrollView className="p-4 bg-white">
        <Text className="text-xl font-bold mb-2">🌱 Guía por Cultivo</Text>

        {cropData.map((crop, index) => (
            <CropCard
                key={index}
                icon={crop.icon}
                name={crop.name}
                vpd={crop.vpd}
                advice={crop.advice}
            />
        ))}

        <Text className="text-sm text-gray-500 mt-6">
            *Valores referenciales según literatura técnica en horticultura protegida.
        </Text>
    </ScrollView>
);

const renderScene = SceneMap({
    vpd: VPDInfo,
    crops: CropGuide,
});

export default function InfoScreen() {
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'vpd', title: 'VPD' },
        { key: 'crops', title: 'Cultivos' },
    ]);

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}

        />
    );
}