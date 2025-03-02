import React from 'react';
import AppNavigator from './AppNavigator';
import { requestNotificationPermissions, restoreNotifications } from './utils/notifications';
import { loadTasks } from './utils/storage';
import { ThemeProvider } from './utils/ThemeContext';

const App = () => {
  React.useEffect(() => {
    const initializeApp = async () => {
      await requestNotificationPermissions();
      const tasks = await loadTasks();
      await restoreNotifications(tasks);
    };
    initializeApp();
  }, []);

  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
};

export default App;