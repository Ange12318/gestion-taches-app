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
import { useTheme } from '../utils/ThemeContext';

const TaskDetailsScreen = ({ route, navigation }) => {
  const { themeStyles } = useTheme();
  const { task } = route.params;
  const [updatedTask, setUpdatedTask] = useState({ ...task });

  const handleChange = (field, value) => {
    setUpdatedTask((prevTask) => ({
      ...prevTask,
      [field]: value,
    }));
  };

  const addSubtask = () => {
    const newSubtask = { id: `${Date.now().toString()}-${Math.random().toString(36).substr(2, 5)}`, title: '', completed: false };
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
    <View style={[styles.subtaskItem, { backgroundColor: themeStyles.cardBackground }]}>
      <TouchableOpacity onPress={() => toggleSubtaskCompletion(item.id)}>
        <Text style={[styles.subtaskStatus, { color: themeStyles.textColor }]}>
          {item.completed ? '✅' : '⬜'}
        </Text>
      </TouchableOpacity>
      <TextInput
        style={[styles.subtaskInput, { backgroundColor: themeStyles.cardBackground, color: themeStyles.textColor }]}
        value={item.title}
        onChangeText={(text) => handleSubtaskChange(item.id, text)}
        placeholder="Titre de la sous-tâche"
        placeholderTextColor={themeStyles.textColor}
      />
      <TouchableOpacity onPress={() => deleteSubtask(item.id)}>
        <Text style={[styles.deleteSubtaskText, { color: themeStyles.secondaryButtonRed }]}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <View style={[styles.headerContainer, { backgroundColor: themeStyles.accentColor }]}>
        <Text style={[styles.header, { color: '#ffffff' }]}>Modifier la Tâche</Text>
      </View>
      <Text style={[styles.label, { color: themeStyles.textColor }]}>Titre</Text>
      <TextInput
        style={[styles.input, { backgroundColor: themeStyles.cardBackground, color: themeStyles.textColor }]}
        value={updatedTask.title}
        onChangeText={(text) => handleChange('title', text)}
        placeholder="Titre"
        placeholderTextColor={themeStyles.textColor}
      />
      <Text style={[styles.label, { color: themeStyles.textColor }]}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea, { backgroundColor: themeStyles.cardBackground, color: themeStyles.textColor }]}
        value={updatedTask.description || ''}
        onChangeText={(text) => handleChange('description', text)}
        placeholder="Description"
        placeholderTextColor={themeStyles.textColor}
        multiline
      />
      <Text style={[styles.label, { color: themeStyles.textColor }]}>Projet</Text>
      <Picker
        selectedValue={updatedTask.project}
        style={[styles.picker, { backgroundColor: themeStyles.cardBackground }]}
        onValueChange={(value) => handleChange('project', value)}
        dropdownIconColor={themeStyles.textColor}
      >
        <Picker.Item label="Travail" value="Travail" />
        <Picker.Item label="Personnel" value="Personnel" />
        <Picker.Item label="Études" value="Études" />
      </Picker>
      <Text style={[styles.label, { color: themeStyles.textColor }]}>Priorité</Text>
      <Picker
        selectedValue={updatedTask.priority}
        style={[styles.picker, { backgroundColor: themeStyles.cardBackground }]}
        onValueChange={(value) => handleChange('priority', value)}
        dropdownIconColor={themeStyles.textColor}
      >
        <Picker.Item label="Basse" value="low" />
        <Picker.Item label="Moyenne" value="medium" />
        <Picker.Item label="Haute" value="high" />
      </Picker>
      <Text style={[styles.label, { color: themeStyles.textColor }]}>Statut</Text>
      <Picker
        selectedValue={updatedTask.status}
        style={[styles.picker, { backgroundColor: themeStyles.cardBackground }]}
        onValueChange={(value) => handleChange('status', value)}
        dropdownIconColor={themeStyles.textColor}
      >
        <Picker.Item label="Non commencé" value="not_started" />
        <Picker.Item label="En cours" value="in_progress" />
        <Picker.Item label="Terminé" value="completed" />
      </Picker>
      <Text style={[styles.label, { color: themeStyles.textColor }]}>Échéance</Text>
      <TextInput
        style={[styles.input, { backgroundColor: themeStyles.cardBackground, color: themeStyles.textColor }]}
        value={updatedTask.dueDate ? new Date(updatedTask.dueDate).toLocaleString() : ''}
        onChangeText={(text) => handleChange('dueDate', text)}
        placeholder="Échéance"
        placeholderTextColor={themeStyles.textColor}
      />
      <Text style={[styles.label, { color: themeStyles.textColor }]}>Sous-tâches</Text>
      <FlatList
        data={updatedTask.subtasks}
        keyExtractor={(item) => item.id}
        renderItem={renderSubtask}
        scrollEnabled={false} // Désactive le défilement de la FlatList
      />
      <TouchableOpacity style={[styles.addSubtaskButton, { backgroundColor: themeStyles.secondaryButtonBlue }]} onPress={addSubtask}>
        <Text style={styles.addSubtaskText}>+ Ajouter une sous-tâche</Text>
      </TouchableOpacity>
      <Text style={[styles.label, { color: themeStyles.textColor }]}>Notes</Text>
      <TextInput
        style={[styles.input, styles.textArea, { backgroundColor: themeStyles.cardBackground, color: themeStyles.textColor }]}
        value={updatedTask.notes || ''}
        onChangeText={(text) => handleChange('notes', text)}
        placeholder="Notes"
        placeholderTextColor={themeStyles.textColor}
        multiline
      />
      <Text style={[styles.label, { color: themeStyles.textColor }]}>Pièces jointes</Text>
      <TextInput
        style={[styles.input, { backgroundColor: themeStyles.cardBackground, color: themeStyles.textColor }]}
        value={updatedTask.attachments || ''}
        onChangeText={(text) => handleChange('attachments', text)}
        placeholder="Pièces jointes (URL ou chemin)"
        placeholderTextColor={themeStyles.textColor}
      />
      <TouchableOpacity style={[styles.saveButton, { backgroundColor: themeStyles.accentColor }]} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Sauvegarder</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  headerContainer: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
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
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    padding: 10,
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
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  deleteSubtaskText: {
    fontSize: 18,
    marginLeft: 8,
  },
  addSubtaskButton: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  addSubtaskText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
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