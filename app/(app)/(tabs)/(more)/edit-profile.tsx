'use client';

import React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, Checkbox } from '@ant-design/react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/styles/theme';

export interface BabyProfile {
  name: string;
  dueDate: Date;
  gender: 'Boy' | 'Girl' | '';
  featured: boolean;
}

export interface Profile {
  currentPregnancy: BabyProfile;
}

export default function MyProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({
    currentPregnancy: {
      name: 'Duong',
      dueDate: new Date('2025-11-14'),
      gender: 'Boy',
      featured: true,
    },
  });

  const handleChange = (
    field: keyof BabyProfile,
    value: string | Date | boolean
  ) => {
    setProfile((prev) => ({
      ...prev,
      currentPregnancy: {
        ...prev.currentPregnancy,
        [field]: value,
      },
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name='arrow-back' size={24} color='white' />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* My Pregnancy Section */}
        <Text style={styles.sectionTitle}>My pregnancy</Text>
        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <Image
              // source={require('../assets/baby-avatar.png')}
              style={styles.avatar}
            />
          </View>

          {/* <View style={styles.fieldContainer}>
            <Text style={styles.label}>Baby's name</Text>
            <Input
              style={styles.input}
              value={profile.currentPregnancy.name}
              onChange={(value) => handleChange('name', value)}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Due date</Text>
            <Pressable style={styles.dateInput}>
              <Text style={styles.dateText}>
                {profile.currentPregnancy.dueDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                })}
              </Text>
              <Ionicons name='calendar' size={24} color='#0066CC' />
            </Pressable>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Baby's gender</Text>
            <Pressable style={styles.genderInput}>
              <Text style={styles.genderText}>
                {profile.currentPregnancy.gender}
              </Text>
              <Ionicons name='chevron-down' size={24} color='#0066CC' />
            </Pressable>
          </View>

          <View style={styles.checkboxContainer}>
            <Checkbox
              checked={profile.currentPregnancy.featured}
              onChange={(value) => handleChange('featured', value)}
              style={styles.checkbox}
            >
              <Text style={styles.checkboxLabel}>
                Set app to feature this child
              </Text>
            </Checkbox>
          </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: theme.primary,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  termsText: {
    padding: 16,
    color: '#666',
    fontSize: 14,
  },
  link: {
    color: '#009688',
    textDecorationLine: 'underline',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: '#333',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  genderInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  genderText: {
    fontSize: 16,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  moreOptions: {
    marginTop: 8,
  },
  moreOptionsText: {
    color: '#009688',
    fontSize: 16,
  },
});
