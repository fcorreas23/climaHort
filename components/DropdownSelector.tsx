// components/DropdownSelector.tsx
import { Dropdown } from 'react-native-element-dropdown';
import { Text, View } from 'react-native';

export default function DropdownSelector({ label, data, value, onChange }: {
  label: string;
  data: { label: string; value: any }[];
  value: any;
  onChange: (item: any) => void;
}) {
  return (
    <View className="mb-4">
      <Text className="text-lg mb-1">{label}</Text>
      <Dropdown
        data={data}
        labelField="label"
        valueField="value"
        placeholder={`Selecciona ${label.toLowerCase()}...`}
        value={value}
        onChange={onChange}
        style={dropdownStyle}
        placeholderStyle={placeholderStyle}
        selectedTextStyle={selectedTextStyle}
        containerStyle={containerStyle}
      />
    </View>
  );
}

const dropdownStyle = { borderWidth: 1, borderColor: 'gray', borderRadius: 8, padding: 12, backgroundColor: '#fff' };
const placeholderStyle = { color: 'gray', fontSize: 16 };
const selectedTextStyle = { fontSize: 16, color: 'black' };
const containerStyle = { borderRadius: 8 };
