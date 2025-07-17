import { Stack } from 'expo-router'

const StackLayout = () => {
  return (
    <Stack
    >
        <Stack.Screen 
          name="home/index" 
          options={{ 
            title: 'Home', 
            headerShown: false 
          }}
        />
        <Stack.Screen 
          name="vpd/index" 
          options={{ title: 'VPD' }} 
        />
        <Stack.Screen 
          name="greenhouse/index" 
          options={{ title: 'GreenHouse' }} 
        />
        <Stack.Screen 
          name="history/index" 
          options={{ title: 'History' }} 
        />

        
    </Stack>
  )
}

export default StackLayout