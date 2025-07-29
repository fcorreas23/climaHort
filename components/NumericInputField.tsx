import React from 'react';
import { Text, TextInput, View } from 'react-native';

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function NumericInputField({ label, value, onChange, error }: Props) {
  return (
    <View className="flex-row items-center justify-between mb-4">
      <Text className="text-xl text-gray-800 w-70">{label}</Text>
      <TextInput
        keyboardType="numeric"
        value={value}
        onChangeText={onChange}
        className="w-20 h-12 px-2 py-1 border border-gray-400 rounded-md text-center"
      />
    </View>
  );
}
