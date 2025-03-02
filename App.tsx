import React, { useEffect } from 'react';
import AppNavigator from './AppNavigator';
import { requestNotificationPermissions } from './utils/notifications';

const App = () => {
  useEffect(() => {
    // Demander les permissions au démarrage
    requestNotificationPermissions();
  }, []);

  return <AppNavigator />;
};

export default App;