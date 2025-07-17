import { Greenhouse } from '@/app/(stack)/greenhouse/form';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'greenhouses';

export async function saveGreenhouse(newGreenhouse: Greenhouse): Promise<void> {
  try {
    const existing = await getGreenhouses();
    console.log('🗂 Invernaderos existentes:', existing);

    const updated = [...existing, newGreenhouse];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    const confirm = await AsyncStorage.getItem(STORAGE_KEY);
    console.log('✅ Guardado exitoso. Nuevo contenido:', confirm);
  } catch (error) {
    console.error('❌ Error en saveGreenhouse:', error);
    throw error;
  }
}

export async function getGreenhouses(): Promise<Greenhouse[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('❌ Error al leer AsyncStorage:', error);
    return [];
  }
}

export async function clearGreenhouses(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export async function deleteGreenhouse(id: string): Promise<void> {
  const existing = await getGreenhouses();
  const updated = existing.filter(g => g.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export async function updateGreenhouse(updatedGreenhouse: Greenhouse): Promise<void> {
  const existing = await getGreenhouses();
  const index = existing.findIndex(g => g.id === updatedGreenhouse.id);
  if (index !== -1) {
    existing[index] = updatedGreenhouse;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  }
}
