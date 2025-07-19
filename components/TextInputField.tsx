// components/TextInputField.tsx
import { View, Text, TextInput } from 'react-native';

export default function TextInputField({ label, value, onChange }: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <View className="mb-4">
      <Text className="text-base mb-1">{label}</Text>
      <TextInput
        className="border border-gray-300 rounded-md px-3 py-3 text-normal"
        value={value}
        onChangeText={onChange}
        placeholder={label}
      />
    </View>
  );
}
