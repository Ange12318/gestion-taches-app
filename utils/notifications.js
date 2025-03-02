import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const NOTIFICATIONS_STORAGE_KEY = '@scheduled_notifications';

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

export async function scheduleNotification(task) {
  const { id, title, priority, dueDate, status, reminder } = task;

  let priorityDelay;
  switch (priority) {
    case 'high':
      priorityDelay = 2;
      break;
    case 'medium':
      priorityDelay = 10;
      break;
    case 'low':
      priorityDelay = 30;
      break;
    default:
      priorityDelay = 10;
  }

  const priorityNotification = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Nouvelle tâche ajoutée',
      body: `Tâche "${title}" (${priority}) ajoutée !`,
      sound: 'default',
      data: { taskId: id },
    },
    trigger: { seconds: priorityDelay },
  });

  let scheduledNotifications = [];
  if (dueDate && status !== 'completed' && reminder !== 'none') {
    const dueDateTime = new Date(dueDate);
    const now = new Date();

    let reminderTime;
    switch (reminder) {
      case '2d':
        reminderTime = new Date(dueDateTime.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 jours avant
        break;
      case '1d':
        reminderTime = new Date(dueDateTime.getTime() - 1 * 24 * 60 * 60 * 1000); // 1 jour avant
        break;
      case '2h':
        reminderTime = new Date(dueDateTime.getTime() - 2 * 60 * 60 * 1000); // 2 heures avant
        break;
      case '1h':
        reminderTime = new Date(dueDateTime.getTime() - 1 * 60 * 60 * 1000); // 1 heure avant
        break;
      default:
        return;
    }

    if (reminderTime > now) {
      const reminderNotif = await Notifications.scheduleNotificationAsync({
        content: {
          title: `Rappel : ${reminder === '2d' ? '2 jours' : reminder === '1d' ? '1 jour' : reminder === '2h' ? '2 heures' : '1 heure'} restant`,
          body: `La tâche "${title}" est due le ${dueDateTime.toLocaleString()}.`,
          sound: 'default',
          data: { taskId: id },
        },
        trigger: reminderTime,
      });
      scheduledNotifications.push({ id: reminderNotif, taskId: id });
    }
  }

  const existingNotifs = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
  const notifs = existingNotifs ? JSON.parse(existingNotifs) : [];
  await AsyncStorage.setItem(
    NOTIFICATIONS_STORAGE_KEY,
    JSON.stringify([...notifs, ...scheduledNotifications])
  );
}

export async function cancelTaskNotifications(taskId) {
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  const taskNotifications = scheduledNotifications.filter(
    (notif) => notif.content.data?.taskId === taskId
  );
  for (const notif of taskNotifications) {
    await Notifications.cancelScheduledNotificationAsync(notif.identifier);
  }

  const existingNotifs = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
  if (existingNotifs) {
    const notifs = JSON.parse(existingNotifs).filter((n) => n.taskId !== taskId);
    await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifs));
  }
}

export async function restoreNotifications(tasks) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await AsyncStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);

  tasks.forEach((task) => {
    if (task.dueDate && task.status !== 'completed') {
      scheduleNotification(task);
    }
  });
}