import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // Import de DateTimePicker
import { loadTasks, saveTasks } from '../utils/storage'; // Import des fonctions de stockage

const AddTaskScreen = ({ navigation }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedProject, setSelectedProject] = useState('Travail');
  const [selectedTag, setSelectedTag] = useState('Important');
  const [selectedPriority, setSelectedPriority] = useState('Moyenne');
  const [dueDate, setDueDate] = useState(null);
  const [subTasks, setSubTasks] = useState('');
  const [notes, setNotes] = useState('');
  const [attachments, setAttachments] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Fonction pour afficher le DateTimePicker
  const handleDatePicker = () => {
    setShowDatePicker(true);
  };

  // Fonction pour mettre à jour la date
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate.toLocaleDateString());
    }
  };

  const handleAddTask = async () => {
    if (taskTitle.trim() === '') {
      Alert.alert('Erreur', 'Veuillez entrer un titre pour la tâche.');
      return;
    }

    // Charger les tâches existantes
    const existingTasks = await loadTasks();

    const newTask = {
      id: Date.now().toString(),
      title: taskTitle,
      project: selectedProject,
      tags: [selectedTag],
      priority: selectedPriority,
      completed: false,
      dueDate: dueDate,
      subTasks: subTasks.split(','), // Sous-tâches séparées par des virgules
      notes: notes,
      attachments: attachments,
    };

    const updatedTasks = [...existingTasks, newTask];

    await saveTasks(updatedTasks); // Sauvegarde dans AsyncStorage
    navigation.navigate('Home', { newTask }); // Mise à jour de l'écran principal

    // Réinitialisation du formulaire après l'ajout
    setTaskTitle('');
    setSelectedProject('Travail');
    setSelectedTag('Important');
    setSelectedPriority('Moyenne');
    setDueDate(null);
    setSubTasks('');
    setNotes('');
    setAttachments('');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>➕ Ajouter une nouvelle tâche</Text>

      {/* Saisie du titre */}
      <TextInput
        style={styles.input}
        placeholder="Titre de la tâche..."
        value={taskTitle}
        onChangeText={setTaskTitle}
      />

      {/* Sélection du projet */}
      <Text style={styles.label}>Projet :</Text>
      <Picker
        selectedValue={selectedProject}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedProject(itemValue)}
      >
        <Picker.Item label="Travail" value="Travail" />
        <Picker.Item label="Personnel" value="Personnel" />
        <Picker.Item label="Études" value="Études" />
      </Picker>

      {/* Sélection des étiquettes */}
      <Text style={styles.label}>Étiquette :</Text>
      <Picker
        selectedValue={selectedTag}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedTag(itemValue)}
      >
        <Picker.Item label="Important" value="Important" />
        <Picker.Item label="Urgent" value="Urgent" />
        <Picker.Item label="Recherche" value="Recherche" />
        <Picker.Item label="Courses" value="Courses" />
        <Picker.Item label="Appel" value="Appel" />
      </Picker>

      {/* Sélection de la priorité */}
      <Text style={styles.label}>Priorité :</Text>
      <Picker
        selectedValue={selectedPriority}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedPriority(itemValue)}
      >
        <Picker.Item label="Haute" value="Haute" />
        <Picker.Item label="Moyenne" value="Moyenne" />
        <Picker.Item label="Basse" value="Basse" />
      </Picker>

      {/* Sélection de l'échéance */}
      <Text style={styles.label}>Échéance :</Text>
      <TouchableOpacity style={styles.dateButton} onPress={handleDatePicker}>
        <Text style={styles.dateButtonText}>
          {dueDate ? `Échéance : ${dueDate}` : 'Sélectionner une échéance'}
        </Text>
      </TouchableOpacity>

      {/* Affichage du DateTimePicker */}
      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Sous-tâches */}
      <TextInput
        style={styles.input}
        placeholder="Sous-tâches (séparées par des virgules)"
        value={subTasks}
        onChangeText={setSubTasks}
      />

      {/* Notes */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Notes"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      {/* Pièces jointes */}
      <TextInput
        style={styles.input}
        placeholder="Pièces jointes (URL ou chemin)"
        value={attachments}
        onChangeText={setAttachments}
      />

      {/* Bouton Ajouter */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>Ajouter la tâche</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
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
    textAlignVertical: 'top', // Pour aligner le texte en haut
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    color: '#555',
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
  },
  dateButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#2ecc71',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddTaskScreen;
