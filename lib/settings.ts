import { AgeRange } from "@/constants/Settings";
import { AGE_STORAGE_KEY } from "@/constants/Storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getStoredAge = async (): Promise<AgeRange | null> => {
  try {
    const age = await AsyncStorage.getItem(AGE_STORAGE_KEY);
    return age as AgeRange;
  } catch (error) {
    console.error('Error reading stored language:', error);
    return null;
  }
};

export const storeAge = async (age: AgeRange): Promise<void> => {
  try {
    await AsyncStorage.setItem(AGE_STORAGE_KEY, age);
  } catch (error) {
    console.error('Error storing age:', error);
    throw new Error('Failed to store age preference');
  }
};
