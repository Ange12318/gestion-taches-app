import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';

const HomeScreen = ({ route, navigation }) => {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Faire les courses', dueDate: '2023-10-15', completed: false },
    { id: '2', title: 'Réviser React Native', dueDate: '2023-10-20', completed: true },
    { id: '3', title: 'Prendre un café', dueDate: '2023-10-10', completed: false },
  ]);

  // Ajouter une nouvelle tâche si elle est passée via la navigation
  useEffect(() => {
    if (route.params?.newTask) {
      setTasks((prevTasks) => [...prevTasks, route.params.newTask]);
    }
  }, [route.params?.newTask]);

  // Fonction pour basculer le statut d'une tâche
  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  // Fonction pour supprimer une tâche
  const deleteTask = (taskId) => {
    Alert.alert(
      'Supprimer la tâche',
      'Êtes-vous sûr de vouloir supprimer cette tâche ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            const updatedTasks = tasks.filter((task) => task.id !== taskId);
            setTasks(updatedTasks);
          },
        },
      ]
    );
  };

  // Fonction pour afficher chaque tâche
  const renderTask = ({ item }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity
        style={styles.taskContent}
        onPress={() => toggleTaskCompletion(item.id)}
      >
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskDueDate}>Date d'échéance : {item.dueDate}</Text>
        <Text style={styles.taskStatus}>
          Statut : {item.completed ? 'Terminée ✅' : 'En cours ⌛'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteTask(item.id)}
      >
        <Text style={styles.deleteButtonText}>Supprimer</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mes Tâches</Text>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Text style={styles.addButtonText}>+ Ajouter une tâche</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  taskItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  taskDueDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  taskStatus: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;