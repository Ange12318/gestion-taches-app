import AsyncStorage from '@react-native-async-storage/async-storage';

// Clé pour stocker les tâches
const TASKS_STORAGE_KEY = '@tasks';

// Sauvegarder les tâches
export const saveTasks = async (tasks) => {
  try {
    const jsonTasks = JSON.stringify(tasks);
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, jsonTasks);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des tâches :', error);
  }
};

// Récupérer les tâches
export const loadTasks = async () => {
  try {
    const jsonTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
    return jsonTasks ? JSON.parse(jsonTasks) : [];
  } catch (error) {
    console.error('Erreur lors du chargement des tâches :', error);
    return [];
  }
};