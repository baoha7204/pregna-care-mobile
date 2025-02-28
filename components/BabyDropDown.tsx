'use client';

import React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/styles/theme';

// Types for our baby data
interface Baby {
  id: string;
  name: string;
  age: string;
  iconType: 'baby' | 'fetus';
  selected?: boolean;
}

// Sample data
const initialBabies: Baby[] = [
  {
    id: '1',
    name: 'My baby',
    age: '7 weeks old',
    iconType: 'baby',
    selected: true,
  },
  {
    id: '2',
    name: 'Duong',
    age: '3 weeks',
    iconType: 'fetus',
  },
];

const BabyDropdown = () => {
  const [babies, setBabies] = useState<Baby[]>(initialBabies);
  const [modalVisible, setModalVisible] = useState(false);

  // Get the currently selected baby
  const selectedBaby = babies.find((baby) => baby.selected) || babies[0];

  const handleSelectBaby = (id: string) => {
    const updatedBabies = babies.map((baby) => ({
      ...baby,
      selected: baby.id === id,
    }));

    setBabies(updatedBabies);
    setModalVisible(false);
  };

  // Render the baby icon based on type
  const renderBabyIcon = (type: 'baby' | 'fetus') => {
    if (type === 'baby') {
      return (
        <View style={styles.iconContainer}>
          <View style={[styles.icon, styles.babyIcon]}>
            <Text style={styles.iconSmile}>◡◡</Text>
            <View style={styles.babyFace}>
              <Text style={styles.babyEyes}>• •</Text>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.iconContainer}>
          <View style={[styles.icon, styles.fetusIcon]}>
            <Text style={styles.iconSmile}>◡◡</Text>
            <View style={styles.heartContainer}>
              <Text style={styles.heart}>❤️</Text>
            </View>
          </View>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with dropdown trigger */}
      <TouchableOpacity
        style={styles.dropdownTrigger}
        onPress={() => setModalVisible(true)}
      >
        {renderBabyIcon(selectedBaby.iconType)}
        <Text style={styles.babyName}>{selectedBaby.name}</Text>
        <Ionicons name='chevron-down' size={20} color='#fff' />
      </TouchableOpacity>

      {/* Search icon */}
      <TouchableOpacity style={styles.searchButton}>
        <Ionicons name='search' size={24} color='#fff' />
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContent}>
                {babies.map((baby) => (
                  <TouchableOpacity
                    key={baby.id}
                    style={styles.babyItem}
                    onPress={() => handleSelectBaby(baby.id)}
                  >
                    <View style={styles.radioContainer}>
                      <View style={styles.radioButton}>
                        {baby.selected && <View style={styles.radioSelected} />}
                      </View>
                    </View>
                    {renderBabyIcon(baby.iconType)}
                    <View style={styles.babyInfo}>
                      <Text style={styles.babyItemName}>{baby.name}</Text>
                      <Text style={styles.babyAge}>{baby.age}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.updateButton}>
                  <Text style={styles.updateButtonText}>
                    Update family information
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: theme.primary, // Teal color from the screenshot
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  babyName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 8,
    marginRight: 4,
  },
  searchButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
    marginTop: 60, // Position below the header
  },
  babyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  radioContainer: {
    marginRight: 12,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0066cc',
  },
  babyInfo: {
    marginLeft: 12,
  },
  babyItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  babyAge: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  updateButton: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  updateButtonText: {
    fontSize: 16,
    color: '#0066cc',
    fontWeight: '500',
  },
  iconContainer: {
    marginRight: 4,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  babyIcon: {
    backgroundColor: '#b3e0ff',
  },
  fetusIcon: {
    backgroundColor: '#b3e0ff',
  },
  iconSmile: {
    fontSize: 14,
    position: 'absolute',
    bottom: 6,
  },
  babyFace: {
    width: 20,
    height: 10,
    backgroundColor: '#7fc4fd',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 10,
  },
  babyEyes: {
    fontSize: 10,
  },
  heartContainer: {
    position: 'absolute',
    top: 10,
  },
  heart: {
    fontSize: 12,
  },
});

export default BabyDropdown;
