import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './screens/HomeScreen';
import AddTaskScreen from './screens/AddTaskScreen';
import SplashScreen from './screens/SplashScreen';
import TaskDetailsScreen from './screens/TaskDetailsScreen'; // Importation de TaskDetailsScreen

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        {/* Écran de démarrage */}
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />

        {/* Écran d'accueil */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ 
            title: 'Taskify',
            headerStyle: { backgroundColor: '#2ecc71' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />

        {/* Ajout d'une tâche */}
        <Stack.Screen
          name="AddTask"
          component={AddTaskScreen}
          options={{ 
            title: 'Ajouter une tâche',
            headerStyle: { backgroundColor: '#2ecc71' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />

        {/* Écran de détails de la tâche */}
        <Stack.Screen
          name="TaskDetails"
          component={TaskDetailsScreen} // Ajout de l'écran TaskDetailsScreen
          options={{
            title: 'Détails de la tâche',
            headerStyle: { backgroundColor: '#2ecc71' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
