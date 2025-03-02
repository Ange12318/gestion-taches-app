import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { loadTasks, saveTasks } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import { scheduleNotification } from '../utils/notifications';

const HomeScreen = ({ route }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredProject, setFilteredProject] = useState('Tous');
  const [filteredPriority, setFilteredPriority] = useState('Toutes');
  const [filteredSort, setFilteredSort] = useState('date');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTasks = async () => {
      const storedTasks = await loadTasks();
      setTasks(storedTasks);

      // Planifier des notifications pour les tâches existantes
      storedTasks.forEach((task) => {
        if (task.dueDate && task.status !== 'completed') {
          scheduleNotification(task);
        }
      });
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    if (route.params?.newTask) {
      const updatedTasks = [...tasks, route.params.newTask];
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
    }
    if (route.params?.updatedTask) {
      const updatedTasks = tasks.map((t) =>
        t.id === route.params.updatedTask.id ? route.params.updatedTask : t
      );
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      // Re-planifier la notification si la tâche est mise à jour
      if (route.params.updatedTask.dueDate && route.params.updatedTask.status !== 'completed') {
        scheduleNotification(route.params.updatedTask);
      }
    }
  }, [route.params?.newTask, route.params?.updatedTask]);

  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? { ...task, status: task.status === 'completed' ? 'in_progress' : 'completed' }
        : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const deleteTask = (taskId) => {
    Alert.alert(
      'Supprimer la tâche',
      'Voulez-vous vraiment supprimer cette tâche ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            const updatedTasks = tasks.filter((task) => task.id !== taskId);
            setTasks(updatedTasks);
            saveTasks(updatedTasks);
          },
        },
      ]
    );
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (filteredSort === 'date' && a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (filteredSort === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
    }
    return 0;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#e74c3c';
      case 'medium':
        return '#f39c12';
      case 'low':
        return '#2ecc71';
      default:
        return '#95a5a6';
    }
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity style={styles.taskContent} onPress={() => toggleTaskCompletion(item.id)}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskProject}>Projet : {item.project}</Text>
        <Text style={styles.taskTags}>Tags : {item.tags.join(', ')}</Text>
        <Text style={[styles.taskPriority, { color: getPriorityColor(item.priority) }]}>
          Priorité : {item.priority === 'low' ? 'Basse' : item.priority === 'medium' ? 'Moyenne' : 'Haute'}
        </Text>
        <Text style={styles.taskStatus}>
          Statut : {item.status === 'completed' ? '✅ Terminée' : item.status === 'in_progress' ? '⌛ En cours' : '⏳ Non commencé'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('TaskDetails', { task: item })}
      >
        <Text style={styles.editButtonText}>Modifier</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTask(item.id)}>
        <Text style={styles.deleteButtonText}>Supprimer</Text>
      </TouchableOpacity>
    </View>
  );

  const filteredTasks = sortedTasks.filter(
    (task) =>
      (filteredProject === 'Tous' || task.project === filteredProject) &&
      (filteredPriority === 'Toutes' || task.priority === filteredPriority)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📌 Mes Tâches</Text>
      <View style={styles.filterContainer}>
        <Picker
          selectedValue={filteredProject}
          style={styles.picker}
          onValueChange={setFilteredProject}
        >
          <Picker.Item label="Tous les projets" value="Tous" />
          <Picker.Item label="Travail" value="Travail" />
          <Picker.Item label="Personnel" value="Personnel" />
          <Picker.Item label="Études" value="Études" />
        </Picker>
        <Picker
          selectedValue={filteredPriority}
          style={styles.picker}
          onValueChange={setFilteredPriority}
        >
          <Picker.Item label="Toutes les priorités" value="Toutes" />
          <Picker.Item label="Haute" value="high" />
          <Picker.Item label="Moyenne" value="medium" />
          <Picker.Item label="Basse" value="low" />
        </Picker>
        <Picker
          selectedValue={filteredSort}
          style={styles.picker}
          onValueChange={setFilteredSort}
        >
          <Picker.Item label="Trier par date" value="date" />
          <Picker.Item label="Trier par priorité" value="priority" />
        </Picker>
      </View>
      <FlatList data={filteredTasks} renderItem={renderTask} keyExtractor={(item) => item.id} />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddTask')}>
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  picker: {
    width: '30%',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  taskItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  taskProject: {
    fontSize: 14,
    color: '#777',
  },
  taskTags: {
    fontSize: 14,
    color: '#777',
    fontStyle: 'italic',
  },
  taskPriority: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskStatus: {
    fontSize: 14,
    color: '#777',
  },
  editButton: {
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#2ecc71',
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