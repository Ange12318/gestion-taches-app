import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './screens/HomeScreen';
import AddTaskScreen from './screens/AddTaskScreen';
import SplashScreen from './screens/SplashScreen';
import TaskDetailsScreen from './screens/TaskDetailsScreen';
import { useTheme } from './utils/ThemeContext';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { themeStyles } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Taskify',
            headerStyle: { backgroundColor: themeStyles.accentColor },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Stack.Screen
          name="AddTask"
          component={AddTaskScreen}
          options={{
            title: 'Ajouter une tâche',
            headerStyle: { backgroundColor: themeStyles.accentColor },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Stack.Screen
          name="TaskDetails"
          component={TaskDetailsScreen}
          options={{
            title: 'Détails de la tâche',
            headerStyle: { backgroundColor: themeStyles.accentColor },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;