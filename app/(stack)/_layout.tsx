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
          options={{ title: 'Mis Invernaderos' }} 
        />
        <Stack.Screen 
          name="greenhouse/form" 
          options={{ title: 'Registar Invernadero' }} 
        />
        <Stack.Screen 
          name="history/index" 
          options={{ title: 'History' }} 
        />
        <Stack.Screen 
          name="crop-guide/index" 
          options={{ title: 'Información' }}
        />

        
    </Stack>
  )
}

export default StackLayout