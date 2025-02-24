import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { symptoms } from '@/app/data/symptoms';

interface CalendarEvent {
  id: string;
  date: String;
  note: string;
  symptoms: number[];
}

interface AddEventModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (note: string, selectedSymptoms: number[]) => void;
  date: Date;
  editingEvent?: CalendarEvent; // Add this prop
}

export const AddEventModal = ({ 
  visible, 
  onClose, 
  onSave, 
  date,
  editingEvent 
}: AddEventModalProps) => {
  const [note, setNote] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<number[]>([]);

  useEffect(() => {
    if (editingEvent) {
      setNote(editingEvent.note);
      setSelectedSymptoms(editingEvent.symptoms);
    } else {
      setNote('');
      setSelectedSymptoms([]);
    }
  }, [editingEvent]);

  const toggleSymptom = (symptomId: number) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleSave = () => {
    onSave(note, selectedSymptoms);
    setNote('');
    setSelectedSymptoms([]);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Event</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.label}>Note</Text>
            <TextInput
              style={styles.input}
              placeholder="Add your note here..."
              placeholderTextColor="#9CA3AF"
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={4}
            />

            <Text style={styles.label}>Symptoms</Text>
            <View style={styles.symptomsGrid}>
              {symptoms.map(symptom => (
                <TouchableOpacity
                  key={symptom.id}
                  style={[
                    styles.symptomButton,
                    selectedSymptoms.includes(symptom.id) && styles.symptomButtonSelected
                  ]}
                  onPress={() => toggleSymptom(symptom.id)}
                >
                  <Text style={styles.symptomIcon}>{symptom.icon}</Text>
                  <Text style={[
                    styles.symptomText,
                    selectedSymptoms.includes(symptom.id) && styles.symptomTextSelected
                  ]}>
                    {symptom.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#004952',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  modalBody: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#002F35',
    borderRadius: 12,
    padding: 12,
    color: 'white',
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  symptomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#002F35',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  symptomButtonSelected: {
    backgroundColor: '#80DEEA',
  },
  symptomIcon: {
    fontSize: 16,
  },
  symptomText: {
    color: 'white',
    fontSize: 14,
  },
  symptomTextSelected: {
    color: '#002F35',
    fontWeight: '600',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
  },
  saveButton: {
    backgroundColor: '#80DEEA',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#002F35',
    fontSize: 16,
    fontWeight: '600',
  },
});