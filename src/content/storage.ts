export interface StorageData {
  geminiApiKey?: string;
}

export const storage = {
  get: async <T extends keyof StorageData>(key: T): Promise<StorageData[T] | undefined> => {
    try {
      const result = await chrome.storage.local.get(key);
      return result[key];
    } catch (error) {
      console.error(`Error getting ${key} from storage:`, error);
      return undefined;
    }
  },

  set: async <T extends keyof StorageData>(key: T, value: StorageData[T]): Promise<void> => {
    try {
      await chrome.storage.local.set({ [key]: value });
    } catch (error) {
      console.error(`Error setting ${key} in storage:`, error);
      throw error;
    }
  },

  remove: async <T extends keyof StorageData>(key: T): Promise<void> => {
    try {
      await chrome.storage.local.remove(key);
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
      throw error;
    }
  },

  clear: async (): Promise<void> => {
    try {
      await chrome.storage.local.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
};