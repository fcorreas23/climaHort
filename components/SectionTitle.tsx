import { Text } from 'react-native';

export default function SectionTitle({ children }: { children: string }) {
  return <Text className="text-xl font-semibold mb-2">{children}</Text>;
}