import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const AddTaskScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  // Fonction pour ajouter une nouvelle tâche
  const handleAddTask = () => {
    if (title.trim() === '' || dueDate.trim() === '') {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    // Créer un nouvel objet tâche
    const newTask = {
      id: Date.now().toString(), // Génère un ID unique
      title: title.trim(),
      dueDate: dueDate.trim(),
      completed: false,
    };

    // Naviguer vers l'écran d'accueil avec la nouvelle tâche
    navigation.navigate('Home', { newTask });
  };

  // Fonction pour sélectionner une date dans le calendrier
  const handleDateSelect = (date) => {
    setDueDate(date.dateString); // Format de date : 'YYYY-MM-DD'
    setShowCalendar(false); // Masquer le calendrier après la sélection
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ajouter une nouvelle tâche</Text>

      <TextInput
        style={styles.input}
        placeholder="Titre de la tâche"
        value={title}
        onChangeText={setTitle}
      />

      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowCalendar(true)}
      >
        <Text style={dueDate ? styles.dateText : styles.placeholderText}>
          {dueDate ? `Date d'échéance : ${dueDate}` : 'Sélectionner une date d\'échéance'}
        </Text>
      </TouchableOpacity>

      {showCalendar && (
        <Calendar
          style={styles.calendar}
          onDayPress={handleDateSelect}
          markedDates={{
            [dueDate]: { selected: true, selectedColor: '#007bff' },
          }}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>Ajouter la tâche</Text>
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
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  calendar: {
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddTaskScreen;