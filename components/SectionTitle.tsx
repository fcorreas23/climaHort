import { Text } from 'react-native';

export default function SectionTitle({ children }: { children: string }) {
  return <Text className="text-lg font-semibold mt-4 mb-2">{children}</Text>;
}