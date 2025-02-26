import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const TaskDetailsScreen = ({ route, navigation }) => {
  const { task } = route.params; // Récupérer la tâche
  const [updatedTask, setUpdatedTask] = useState({ ...task });

  // Fonction pour gérer les changements des champs de la tâche
  const handleChange = (field, value) => {
    setUpdatedTask((prevTask) => ({
      ...prevTask,
      [field]: value,
    }));
  };

  // Ajouter une sous-tâche
  const addSubtask = () => {
    const newSubtask = { id: Date.now().toString(), title: '', completed: false };
    setUpdatedTask((prevTask) => ({
      ...prevTask,
      subtasks: [...prevTask.subtasks, newSubtask],
    }));
  };

  // Gérer le changement d'une sous-tâche
  const handleSubtaskChange = (id, title) => {
    const updatedSubtasks = updatedTask.subtasks.map((subtask) =>
      subtask.id === id ? { ...subtask, title } : subtask
    );
    setUpdatedTask((prevTask) => ({ ...prevTask, subtasks: updatedSubtasks }));
  };

  // Sauvegarder la tâche modifiée
  const handleSave = () => {
    navigation.goBack();
    navigation.setParams({ task: updatedTask }); // Mettre à jour la tâche sur l'écran précédent
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Modifier la Tâche</Text>

      {/* Titre de la tâche */}
      <Text style={styles.label}>Titre</Text>
      <TextInput
        style={styles.input}
        value={updatedTask.title}
        onChangeText={(text) => handleChange('title', text)}
      />

      {/* Description de la tâche */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={updatedTask.description}
        onChangeText={(text) => handleChange('description', text)}
      />

      {/* Priorité de la tâche */}
      <Text style={styles.label}>Priorité</Text>
      <Picker
        selectedValue={updatedTask.priority}
        style={styles.input}
        onValueChange={(itemValue) => handleChange('priority', itemValue)}
      >
        <Picker.Item label="Faible" value="low" />
        <Picker.Item label="Moyenne" value="medium" />
        <Picker.Item label="Élevée" value="high" />
      </Picker>

      {/* Date limite de la tâche */}
      <Text style={styles.label}>Date limite</Text>
      <TextInput
        style={styles.input}
        value={updatedTask.dueDate}
        onChangeText={(text) => handleChange('dueDate', text)}
      />

      {/* Statut de la tâche */}
      <Text style={styles.label}>État</Text>
      <Picker
        selectedValue={updatedTask.status}
        style={styles.input}
        onValueChange={(itemValue) => handleChange('status', itemValue)}
      >
        <Picker.Item label="Non commencé" value="not_started" />
        <Picker.Item label="En cours" value="in_progress" />
        <Picker.Item label="Terminé" value="completed" />
      </Picker>

      {/* Sous-tâches */}
      <Text style={styles.label}>Sous-tâches</Text>
      <FlatList
        data={updatedTask.subtasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.subtaskItem}>
            <TextInput
              style={styles.input}
              value={item.title}
              placeholder="Sous-tâche"
              onChangeText={(text) => handleSubtaskChange(item.id, text)}
            />
          </View>
        )}
      />
      <TouchableOpacity style={styles.addSubtaskButton} onPress={addSubtask}>
        <Text style={styles.addSubtaskText}>+ Ajouter une sous-tâche</Text>
      </TouchableOpacity>

      {/* Pièces jointes */}
      <Text style={styles.label}>Pièces jointes</Text>
      <TextInput
        style={styles.input}
        value={updatedTask.attachments}
        placeholder="Ajouter des liens de pièces jointes"
        onChangeText={(text) => handleChange('attachments', text)}
      />

      {/* Bouton pour sauvegarder */}
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
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
  subtaskItem: {
    marginBottom: 8,
  },
  addSubtaskButton: {
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
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
  },
});

export default TaskDetailsScreen;
