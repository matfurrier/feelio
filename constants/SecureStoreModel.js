import * as SecureStore from "expo-secure-store";

class SecureStoreModel {
  static async saveItem(key, value) {
    try {
      await SecureStore.setItemAsync(key, value);
      console.log(`Saved key "${key}" with value "${value}".`);
    } catch (error) {
      console.error(`Failed to save item: ${error}`);
    }
  }

  static async updateItem(key, value) {
    try {
      await SecureStore.setItemAsync(key, value);
      console.log(`Updated key "${key}" with new value "${value}".`);
    } catch (error) {
      console.error(`Failed to update item: ${error}`);
    }
  }

  static async itemExists(key) {
    try {
      const value = await SecureStore.getItemAsync(key);
      return value !== null;
    } catch (error) {
      console.error(`Failed to check if item exists: ${error}`);
      return false;
    }
  }

  static async getItem(key) {
    try {
      const value = await SecureStore.getItemAsync(key);
      if (value !== null) {
        console.log(`Retrieved key "${key}" with value "${value}".`);
      } else {
        console.log(`Key "${key}" does not exist.`);
      }
      return value;
    } catch (error) {
      console.error(`Failed to retrieve item: ${error}`);
      return null;
    }
  }
}

export default SecureStoreModel;
