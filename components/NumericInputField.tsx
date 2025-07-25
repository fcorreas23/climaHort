
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
    <View className={`mb-4 ${error ? 'border border-red-500 rounded' : ''}`}>
      <Text className="font-medium mb-1">{label}</Text>
      <TextInput
        keyboardType="numeric"
        value={value}
        onChangeText={onChange}
        className={`bg-white px-3 py-2 border rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
}