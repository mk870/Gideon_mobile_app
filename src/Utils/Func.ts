import * as SecureStore from "expo-secure-store";

export const saveSecureValue = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};

export const getSecureValue = async (key: string) => {
  let result = await SecureStore.getItemAsync(key);
  return result;
};