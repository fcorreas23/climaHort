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
          options={{ title: 'Diagnóstico' }} 
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
          options={{ title: 'Historial' }} 
        />
        <Stack.Screen 
          name="info/index" 
          options={{ title: 'Información' }}
        />

        
    </Stack>
  )
}

export default StackLayout