// components/SafeLayout.tsx
import { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  children: ReactNode;
  scrollable?: boolean;
};

export default function SafeLayout({ children, scrollable = false }: Props) {
  const Wrapper = scrollable ? ScrollView : View;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Wrapper contentContainerStyle={{ padding: 10 }}>
        {children}
      </Wrapper>
    </SafeAreaView>
  );
}
