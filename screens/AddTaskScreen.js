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
import DateTimePicker from '@react-native-community/datetimepicker';
import { loadTasks, saveTasks } from '../utils/storage';
import { scheduleNotification } from '../utils/notifications';
import { useTheme } from '../utils/ThemeContext';

const AddTaskScreen = ({ navigation }) => {
  const { themeStyles } = useTheme();
  const [taskTitle, setTaskTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProject, setSelectedProject] = useState('Travail');
  const [selectedTag, setSelectedTag] = useState('Important');
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [status, setStatus] = useState('not_started');
  const [dueDate, setDueDate] = useState(null);
  const [subtasks, setSubtasks] = useState([]);
  const [notes, setNotes] = useState('');
  const [attachments, setAttachments] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [subtaskCounter, setSubtaskCounter] = useState(0);

  const handleDatePicker = () => {
    console.log('Date picker triggered'); // Débogage
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
      setShowTimePicker(true); // Ouvre le sélecteur d’heure après la date
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime && dueDate) {
      const updatedDueDate = new Date(dueDate);
      updatedDueDate.setHours(selectedTime.getHours());
      updatedDueDate.setMinutes(selectedTime.getMinutes());
      setDueDate(updatedDueDate);
    }
  };

  const handleAddSubtask = (text) => {
    if (text.trim()) {
      const uniqueId = `${Date.now().toString()}-${subtaskCounter}`;
      setSubtaskCounter(subtaskCounter + 1);
      setSubtasks([...subtasks, { id: uniqueId, title: text.trim(), completed: false }]);
    }
  };

  const handleAddTask = async () => {
    if (taskTitle.trim() === '') {
      Alert.alert('Erreur', 'Veuillez entrer un titre pour la tâche.');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: taskTitle,
      description,
      project: selectedProject,
      tags: [selectedTag],
      priority: selectedPriority,
      status,
      dueDate: dueDate ? dueDate.toISOString() : null,
      subtasks,
      notes,
      attachments,
    };

    const existingTasks = await loadTasks();
    const updatedTasks = [...existingTasks, newTask];
    await saveTasks(updatedTasks);
    navigation.navigate('Home', { newTask });

    await scheduleNotification(newTask);

    setTaskTitle('');
    setDescription('');
    setSelectedProject('Travail');
    setSelectedTag('Important');
    setSelectedPriority('medium');
    setStatus('not_started');
    setDueDate(null);
    setSubtasks([]);
    setNotes('');
    setAttachments('');
    setSubtaskCounter(0);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <View style={[styles.headerContainer, { backgroundColor: themeStyles.accentColor }]}>
        <Text style={[styles.header, { color: '#ffffff' }]}>➕ Ajouter une nouvelle tâche</Text>
      </View>
      <TextInput
        style={[styles.input, { backgroundColor: themeStyles.cardBackground, color: themeStyles.textColor }]}
        placeholder="Titre de la tâche..."
        placeholderTextColor={themeStyles.textColor}
        value={taskTitle}
        onChangeText={setTaskTitle}
      />
      <TextInput
        style={[styles.input, styles.textArea, { backgroundColor: themeStyles.cardBackground, color: themeStyles.textColor }]}
        placeholder="Description"
        placeholderTextColor={themeStyles.textColor}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Text style={[styles.label, { color: themeStyles.textColor }]}>Projet :</Text>
      <Picker
        selectedValue={selectedProject}
        style={[styles.picker, { backgroundColor: themeStyles.cardBackground }]}
        onValueChange={setSelectedProject}
        dropdownIconColor={themeStyles.textColor}
      >
        <Picker.Item label="Travail" value="Travail" />
        <Picker.Item label="Personnel" value="Personnel" />
        <Picker.Item label="Études" value="Études" />
      </Picker>
      <Text style={[styles.label, { color: themeStyles.textColor }]}>Étiquette :</Text>
      <Picker
        selectedValue={selectedTag}
        style={[styles.picker, { backgroundColor: themeStyles.cardBackground }]}
        onValueChange={setSelectedTag}
        dropdownIconColor={themeStyles.textColor}
      >
        <Picker.Item label="Important" value="Important" />
        <Picker.Item label="Urgent" value="Urgent" />
        <Picker.Item label="Recherche" value="Recherche" />
        <Picker.Item label="Courses" value="Courses" />
        <Picker.Item label="Appel" value="Appel" />
      </Picker>
      <Text style={[styles.label, { color: themeStyles.textColor }]}>Priorité :</Text>
      <Picker
        selectedValue={selectedPriority}
        style={[styles.picker, { backgroundColor: themeStyles.cardBackground }]}
        onValueChange={setSelectedPriority}
        dropdownIconColor={themeStyles.textColor}
      >
        <Picker.Item label="Basse" value="low" />
        <Picker.Item label="Moyenne" value="medium" />
        <Picker.Item label="Haute" value="high" />
      </Picker>
      <Text style={[styles.label, { color: themeStyles.textColor }]}>Statut :</Text>
      <Picker
        selectedValue={status}
        style={[styles.picker, { backgroundColor: themeStyles.cardBackground }]}
        onValueChange={setStatus}
        dropdownIconColor={themeStyles.textColor}
      >
        <Picker.Item label="Non commencé" value="not_started" />
        <Picker.Item label="En cours" value="in_progress" />
        <Picker.Item label="Terminé" value="completed" />
      </Picker>
      <Text style={[styles.label, { color: themeStyles.textColor }]}>Échéance :</Text>
      <TouchableOpacity
        style={[styles.dateButton, { backgroundColor: themeStyles.cardBackground, borderColor: themeStyles.textColor }]}
        onPress={handleDatePicker} // Vérifié
      >
        <Text style={[styles.dateButtonText, { color: themeStyles.textColor }]}>
          {dueDate ? `Échéance : ${dueDate.toLocaleString()}` : 'Sélectionner une échéance'}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dueDate || new Date()} // Vérifié
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={dueDate || new Date()} // Vérifié
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
      <TextInput
        style={[styles.input, { backgroundColor: themeStyles.cardBackground, color: themeStyles.textColor }]}
        placeholder="Ajouter une sous-tâche (appuyer sur Entrée)"
        placeholderTextColor={themeStyles.textColor}
        onSubmitEditing={(e) => handleAddSubtask(e.nativeEvent.text)}
      />
      {subtasks.map((subtask) => (
        <Text key={subtask.id} style={[styles.subtask, { color: themeStyles.textColor }]}>
          - {subtask.title}
        </Text>
      ))}
      <TextInput
        style={[styles.input, styles.textArea, { backgroundColor: themeStyles.cardBackground, color: themeStyles.textColor }]}
        placeholder="Notes"
        placeholderTextColor={themeStyles.textColor}
        value={notes}
        onChangeText={setNotes}
        multiline
      />
      <TextInput
        style={[styles.input, { backgroundColor: themeStyles.cardBackground, color: themeStyles.textColor }]}
        placeholder="Pièces jointes (URL ou chemin)"
        placeholderTextColor={themeStyles.textColor}
        value={attachments}
        onChangeText={setAttachments}
      />
      <TouchableOpacity style={[styles.addButton, { backgroundColor: themeStyles.accentColor }]} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>Ajouter la tâche</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    padding: 10,
  },
  dateButton: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  dateButtonText: {
    fontSize: 16,
  },
  subtask: {
    fontSize: 14,
    marginBottom: 4,
  },
  addButton: {
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