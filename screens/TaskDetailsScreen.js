import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { saveTasks, loadTasks } from '../utils/storage';

const TaskDetailsScreen = ({ route, navigation }) => {
  const { task } = route.params;
  const [updatedTask, setUpdatedTask] = useState({ ...task });

  const handleChange = (field, value) => {
    setUpdatedTask((prevTask) => ({
      ...prevTask,
      [field]: value,
    }));
  };

  const addSubtask = () => {
    const newSubtask = { id: Date.now().toString(), title: '', completed: false };
    setUpdatedTask((prevTask) => ({
      ...prevTask,
      subtasks: [...prevTask.subtasks, newSubtask],
    }));
  };

  const handleSubtaskChange = (id, title) => {
    const updatedSubtasks = updatedTask.subtasks.map((subtask) =>
      subtask.id === id ? { ...subtask, title } : subtask
    );
    setUpdatedTask((prevTask) => ({ ...prevTask, subtasks: updatedSubtasks }));
  };

  const toggleSubtaskCompletion = (id) => {
    const updatedSubtasks = updatedTask.subtasks.map((subtask) =>
      subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask
    );
    setUpdatedTask((prevTask) => ({ ...prevTask, subtasks: updatedSubtasks }));
  };

  const deleteSubtask = (id) => {
    const updatedSubtasks = updatedTask.subtasks.filter((subtask) => subtask.id !== id);
    setUpdatedTask((prevTask) => ({ ...prevTask, subtasks: updatedSubtasks }));
  };

  const handleSave = async () => {
    const existingTasks = await loadTasks();
    const updatedTasks = existingTasks.map((t) =>
      t.id === updatedTask.id ? updatedTask : t
    );
    await saveTasks(updatedTasks);
    navigation.navigate('Home', { updatedTask });
  };

  const renderSubtask = ({ item }) => (
    <View style={styles.subtaskItem}>
      <TouchableOpacity onPress={() => toggleSubtaskCompletion(item.id)}>
        <Text style={styles.subtaskStatus}>
          {item.completed ? '✅' : '⬜'}
        </Text>
      </TouchableOpacity>
      <TextInput
        style={styles.subtaskInput}
        value={item.title}
        onChangeText={(text) => handleSubtaskChange(item.id, text)}
      />
      <TouchableOpacity onPress={() => deleteSubtask(item.id)}>
        <Text style={styles.deleteSubtaskText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Modifier la Tâche</Text>

      <Text style={styles.label}>Titre</Text>
      <TextInput
        style={styles.input}
        value={updatedTask.title}
        onChangeText={(text) => handleChange('title', text)}
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={updatedTask.description || ''}
        onChangeText={(text) => handleChange('description', text)}
        multiline
      />
      <Text style={styles.label}>Projet</Text>
      <Picker
        selectedValue={updatedTask.project}
        style={styles.input}
        onValueChange={(value) => handleChange('project', value)}
      >
        <Picker.Item label="Travail" value="Travail" />
        <Picker.Item label="Personnel" value="Personnel" />
        <Picker.Item label="Études" value="Études" />
      </Picker>
      <Text style={styles.label}>Priorité</Text>
      <Picker
        selectedValue={updatedTask.priority}
        style={styles.input}
        onValueChange={(value) => handleChange('priority', value)}
      >
        <Picker.Item label="Basse" value="low" />
        <Picker.Item label="Moyenne" value="medium" />
        <Picker.Item label="Haute" value="high" />
      </Picker>
      <Text style={styles.label}>Statut</Text>
      <Picker
        selectedValue={updatedTask.status}
        style={styles.input}
        onValueChange={(value) => handleChange('status', value)}
      >
        <Picker.Item label="Non commencé" value="not_started" />
        <Picker.Item label="En cours" value="in_progress" />
        <Picker.Item label="Terminé" value="completed" />
      </Picker>
      <Text style={styles.label}>Échéance</Text>
      <TextInput
        style={styles.input}
        value={updatedTask.dueDate || ''}
        onChangeText={(text) => handleChange('dueDate', text)}
      />
      <Text style={styles.label}>Sous-tâches</Text>
      <FlatList
        data={updatedTask.subtasks}
        keyExtractor={(item) => item.id}
        renderItem={renderSubtask}
      />
      <TouchableOpacity style={styles.addSubtaskButton} onPress={addSubtask}>
        <Text style={styles.addSubtaskText}>+ Ajouter une sous-tâche</Text>
      </TouchableOpacity>
      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={updatedTask.notes || ''}
        onChangeText={(text) => handleChange('notes', text)}
        multiline
      />
      <Text style={styles.label}>Pièces jointes</Text>
      <TextInput
        style={styles.input}
        value={updatedTask.attachments || ''}
        onChangeText={(text) => handleChange('attachments', text)}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Sauvegarder</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subtaskStatus: {
    fontSize: 18,
    marginRight: 8,
  },
  subtaskInput: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  deleteSubtaskText: {
    fontSize: 18,
    color: '#e74c3c',
    marginLeft: 8,
  },
  addSubtaskButton: {
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  addSubtaskText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#2ecc71',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TaskDetailsScreen;