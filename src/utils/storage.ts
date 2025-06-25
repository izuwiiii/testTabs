// utils/storage.ts

export const saveToStorage = <T>(key: string, data: T): void => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error("Error while saving to localStorage:", error);
  }
};

export const getFromStorage = <T = unknown>(key: string, defaultValue: T | null = null): T | null => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) return defaultValue;
    return JSON.parse(serializedData) as T;
  } catch (error) {
    console.error("Error while getting data from localStorage:", error);
    return defaultValue;
  }
};


export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error while deleting localStorage:", error);
  }
};

export const hasInStorage = (key: string): boolean => {
  try {
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error("Error while testing localStorage:", error);
    return false;
  }
};

export const clearStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error while clearing localStorage:", error);
  }
};
