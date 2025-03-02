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
import { MaterialIcons } from '@expo/vector-icons';
import { loadTasks, saveTasks } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import { scheduleNotification, cancelTaskNotifications } from '../utils/notifications';
import { useTheme } from '../utils/ThemeContext';

const HomeScreen = ({ route }) => {
  const { themeStyles, toggleTheme } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [filteredProject, setFilteredProject] = useState('Tous');
  const [filteredPriority, setFilteredPriority] = useState('Toutes');
  const [filteredSort, setFilteredSort] = useState('date');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTasks = async () => {
      const storedTasks = await loadTasks();
      setTasks(storedTasks);

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
      if (route.params.updatedTask.dueDate && route.params.updatedTask.status !== 'completed') {
        scheduleNotification(route.params.updatedTask);
      }
    }
  }, [route.params?.newTask, route.params?.updatedTask]);

  const toggleTaskCompletion = async (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? { ...task, status: task.status === 'completed' ? 'in_progress' : 'completed' }
        : task
    );
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);

    const updatedTask = updatedTasks.find((task) => task.id === taskId);
    if (updatedTask.status === 'completed') {
      await cancelTaskNotifications(taskId);
    }
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
          onPress: async () => {
            const updatedTasks = tasks.filter((task) => task.id !== taskId);
            setTasks(updatedTasks);
            await saveTasks(updatedTasks);
            await cancelTaskNotifications(taskId);
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
    <View style={[styles.taskItem, { backgroundColor: themeStyles.cardBackground }]}>
      <TouchableOpacity style={styles.taskContent} onPress={() => toggleTaskCompletion(item.id)}>
        <Text style={[styles.taskTitle, { color: themeStyles.textColor }]}>{item.title}</Text>
        <Text style={[styles.taskProject, { color: themeStyles.textColor }]}>
          Projet : {item.project}
        </Text>
        <Text style={[styles.taskTags, { color: themeStyles.textColor }]}>
          Tags : {item.tags.join(', ')}
        </Text>
        <Text
          style={[styles.taskPriority, { color: getPriorityColor(item.priority) || themeStyles.textColor }]}
        >
          Priorité :{' '}
          {item.priority === 'low'
            ? 'Basse'
            : item.priority === 'medium'
            ? 'Moyenne'
            : 'Haute'}
        </Text>
        <Text style={[styles.taskStatus, { color: themeStyles.textColor }]}>
          Statut :{' '}
          {item.status === 'completed'
            ? '✅ Terminée'
            : item.status === 'in_progress'
            ? '⌛ En cours'
            : '⏳ Non commencé'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.editButton, { backgroundColor: themeStyles.secondaryButtonBlue }]}
        onPress={() => navigation.navigate('TaskDetails', { task: item })}
      >
        <Text style={styles.editButtonText}>Modifier</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.deleteButton, { backgroundColor: themeStyles.secondaryButtonRed }]}
        onPress={() => deleteTask(item.id)}
      >
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
    <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <View style={[styles.headerContainer, { backgroundColor: themeStyles.accentColor }]}>
        <Text style={[styles.header, { color: '#ffffff' }]}>📌 Mes Tâches</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
          <MaterialIcons
            name={themeStyles === 'light' ? 'dark-mode' : 'light-mode'}
            size={24}
            color="#ffffff"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.filterContainer}>
        <Picker
          selectedValue={filteredProject}
          style={[styles.picker, { backgroundColor: themeStyles.cardBackground, minWidth: 140 }]} // Ajustement de la largeur
          onValueChange={setFilteredProject}
          dropdownIconColor={themeStyles.textColor}
        >
          <Picker.Item label="Tous les projets" value="Tous" />
          <Picker.Item label="Travail" value="Travail" />
          <Picker.Item label="Personnel" value="Personnel" />
          <Picker.Item label="Études" value="Études" />
        </Picker>
        <Picker
          selectedValue={filteredPriority}
          style={[styles.picker, { backgroundColor: themeStyles.cardBackground, minWidth: 140 }]} // Ajustement de la largeur
          onValueChange={setFilteredPriority}
          dropdownIconColor={themeStyles.textColor}
        >
          <Picker.Item label="Toutes les priorités" value="Toutes" />
          <Picker.Item label="Haute" value="high" />
          <Picker.Item label="Moyenne" value="medium" />
          <Picker.Item label="Basse" value="low" />
        </Picker>
        <Picker
          selectedValue={filteredSort}
          style={[styles.picker, { backgroundColor: themeStyles.cardBackground, minWidth: 140 }]} // Ajustement de la largeur
          onValueChange={setFilteredSort}
          dropdownIconColor={themeStyles.textColor}
        >
          <Picker.Item label="Trier par date" value="date" />
          <Picker.Item label="Trier par priorité" value="priority" />
        </Picker>
      </View>
      <FlatList data={filteredTasks} renderItem={renderTask} keyExtractor={(item) => item.id} />
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: themeStyles.accentColor }]}
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
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  picker: {
    borderRadius: 8,
    padding: 10,
  },
  taskItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
  },
  taskContent: {
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskProject: {
    fontSize: 14,
  },
  taskTags: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  taskPriority: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskStatus: {
    fontSize: 14,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  editButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  addButton: {
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
  themeToggle: {
    padding: 5,
  },
});

export default HomeScreen;