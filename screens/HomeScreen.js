import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';
import { loadTasks, saveTasks } from '../utils/storage'; // Import du stockage
import { useNavigation } from '@react-navigation/native'; // Utilisation de la navigation

const HomeScreen = ({ route }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredProject, setFilteredProject] = useState('Tous');
  const [filteredPriority, setFilteredPriority] = useState('Toutes');
  const [filteredSort, setFilteredSort] = useState('date'); // Ajout du tri
  const navigation = useNavigation(); // Hook pour la navigation

  // Charger les tâches au démarrage
  useEffect(() => {
    const fetchTasks = async () => {
      const storedTasks = await loadTasks();
      setTasks(storedTasks);
    };
    fetchTasks();
  }, []);

  // Ajouter une nouvelle tâche depuis AddTaskScreen
  useEffect(() => {
    if (route.params?.newTask) {
      const updatedTasks = [...tasks, route.params.newTask];
      setTasks(updatedTasks);
      saveTasks(updatedTasks); // Sauvegarde immédiate
    }
  }, [route.params?.newTask]);

  // Basculer l'état de complétion d'une tâche
  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  // Supprimer une tâche avec confirmation
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

  // Regrouper les tâches par projet
  const groupedTasks = tasks.reduce((groups, task) => {
    const group = task.project || 'Sans projet'; // Regroupe par projet
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(task);
    return groups;
  }, {});

  // Fonction de tri
  const sortedTasks = Object.values(groupedTasks).flat().sort((a, b) => {
    if (filteredSort === 'date') {
      return new Date(a.dueDate) - new Date(b.dueDate); // Trier par date
    }
    if (filteredSort === 'priority') {
      return a.priority.localeCompare(b.priority); // Trier par priorité
    }
    return 0;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Haute':
        return '#e74c3c'; // Rouge
      case 'Moyenne':
        return '#f39c12'; // Orange
      case 'Basse':
        return '#2ecc71'; // Vert
      default:
        return '#95a5a6'; // Gris
    }
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity
        style={styles.taskContent}
        onPress={() => toggleTaskCompletion(item.id)}
      >
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskProject}>Projet : {item.project}</Text>
        <Text style={styles.taskTags}>Tags : {item.tags.join(', ')}</Text>
        <Text style={[styles.taskPriority, { color: getPriorityColor(item.priority) }]} >
          Priorité : {item.priority}
        </Text>
        <Text style={styles.taskStatus}>
          Statut : {item.completed ? '✅ Terminée' : '⌛ En cours'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('TaskDetails', { taskId: item.id })} // Passer l'ID de la tâche à TaskDetails
      >
        <Text style={styles.editButtonText}>Modifier</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteTask(item.id)}
      >
        <Text style={styles.deleteButtonText}>Supprimer</Text>
      </TouchableOpacity>
    </View>
  );

  // Filtrer les tâches selon le projet et la priorité
  const filteredTasks = sortedTasks.filter(task => 
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
          onValueChange={(itemValue) => setFilteredProject(itemValue)}
        >
          <Picker.Item label="Tous les projets" value="Tous" />
          <Picker.Item label="Travail" value="Travail" />
          <Picker.Item label="Personnel" value="Personnel" />
          <Picker.Item label="Études" value="Études" />
        </Picker>

        <Picker
          selectedValue={filteredPriority}
          style={styles.picker}
          onValueChange={(itemValue) => setFilteredPriority(itemValue)}
        >
          <Picker.Item label="Toutes les priorités" value="Toutes" />
          <Picker.Item label="Haute" value="Haute" />
          <Picker.Item label="Moyenne" value="Moyenne" />
          <Picker.Item label="Basse" value="Basse" />
        </Picker>

        <Picker
          selectedValue={filteredSort}
          style={styles.picker}
          onValueChange={(itemValue) => setFilteredSort(itemValue)}
        >
          <Picker.Item label="Trier par date" value="date" />
          <Picker.Item label="Trier par priorité" value="priority" />
        </Picker>
      </View>

      <FlatList
        data={filteredTasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTask')} // Naviguer vers l'écran d'ajout de tâche
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
