import { View, Text, TextInput } from 'react-native';

export default function NumericInputField({ label, value, onChange }: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <View className="flex-row items-center justify-between mb-4">
      <Text className="text-xl font-bold">{label}</Text>
      <TextInput
        keyboardType="numeric"
        value={value}
        onChangeText={onChange}
        className="w-28 h-14 border border-gray-400 rounded-md px-4 text-right text-xl"
        placeholder="%"
      />
    </View>
  );
}
