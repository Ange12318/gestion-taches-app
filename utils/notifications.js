import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configurer le gestionnaire de notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Demander les permissions pour les notifications
export async function requestNotificationPermissions() {
  if (!Device.isDevice) {
    console.log("Les notifications ne fonctionnent que sur un appareil physique.");
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Permission refusée pour les notifications.');
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return true;
}

// Planifier une notification basée sur la priorité et le délai
export async function scheduleNotification(task) {
  const { title, priority, dueDate, status } = task;

  // 1. Notification basée sur la priorité (immédiate ou rapide)
  let priorityDelay;
  switch (priority) {
    case 'high':
      priorityDelay = 2; // 2 secondes pour priorité élevée
      break;
    case 'medium':
      priorityDelay = 10; // 10 secondes pour priorité moyenne
      break;
    case 'low':
      priorityDelay = 30; // 30 secondes pour priorité basse
      break;
    default:
      priorityDelay = 10;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Nouvelle tâche ajoutée',
      body: `Tâche "${title}" (${priority}) ajoutée !`,
      sound: 'default',
    },
    trigger: { seconds: priorityDelay },
  });

  // 2. Notification de rappel basée sur dueDate (si non terminée)
  if (dueDate && status !== 'completed') {
    const dueDateTime = new Date(dueDate);
    const now = new Date();
    const timeUntilDue = dueDateTime - now;

    // Planifier un rappel 1 heure avant l'échéance (ou ajuster selon tes besoins)
    const reminderTime = new Date(dueDateTime.getTime() - 60 * 60 * 1000); // 1 heure avant
    if (reminderTime > now) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Délai approche !',
          body: `La tâche "${title}" est due le ${dueDateTime.toLocaleDateString()} et n'est pas encore terminée.`,
          sound: 'default',
        },
        trigger: reminderTime,
      });
    }
  }
}

// Annuler toutes les notifications (optionnel, pour débogage)
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}