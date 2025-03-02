import React, { useEffect } from 'react';
import AppNavigator from './AppNavigator';
import { requestNotificationPermissions, restoreNotifications } from './utils/notifications';
import { loadTasks } from './utils/storage';

const App = () => {
  useEffect(() => {
    const initializeApp = async () => {
      await requestNotificationPermissions();
      const tasks = await loadTasks();
      await restoreNotifications(tasks);
    };
    initializeApp();
  }, []);

  return <AppNavigator />;
};

export default App;