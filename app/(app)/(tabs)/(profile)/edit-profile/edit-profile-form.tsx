import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '@/styles/theme';
import useUsers from '@/hooks/useUsers';
import LoadingView from '@/components/LoadingView';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';

// Blood type options
const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Define types for form data
interface ProfileFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  nationality: string;
  bloodType: string;
  dateOfBirth: Date;
}

const UpdateProfileForm: React.FC = () => {
  const router = useRouter();
  const { user, updateProfile, uploadAvatar, isLoading, getUserProfile } =
    useUsers();

  // Add local loading state for specific actions
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    nationality: '',
    bloodType: 'A+',
    dateOfBirth: new Date(),
  });

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        nationality: user.nationality || '',
        bloodType: user.bloodType || 'A+',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : new Date(),
      });
    }
  }, [user]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleChange = (field: keyof ProfileFormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFormData({
        ...formData,
        dateOfBirth: selectedDate,
      });
    }
  };

  const pickImage = async () => {
    try {
      // Kiểm tra và yêu cầu quyền truy cập
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Permission status:', status);

      if (status !== 'granted') {
        Alert.alert(
          'Permission needed',
          'Please grant camera roll permissions to upload an avatar'
        );
        return;
      }

      // Sử dụng API mới của ImagePicker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images', // Sử dụng string thay vì enum để tránh cảnh báo
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log('Image picker result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0].uri;
        console.log('Selected image URI:', selectedImage);
        setAvatar(selectedImage);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(
        'Error',
        'Failed to pick image from gallery. ' +
          (error instanceof Error ? error.message : String(error))
      );
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const profileData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth.getTime(), // Convert to timestamp
      };

      await updateProfile(profileData);

      if (avatar) {
        setIsUploading(true);
        await uploadAvatar(avatar);
        setIsUploading(false);
      }

      Alert.alert('Success', 'Profile updated successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error('Profile update error:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      Alert.alert('Error', 'First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      Alert.alert('Error', 'Last name is required');
      return false;
    }

    // Add more validations as needed
    return true;
  };

  // Handle main loading state
  if (isLoading) {
    return <LoadingView />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatarContainer}>
        <TouchableOpacity
          onPress={pickImage}
          disabled={isSubmitting || isUploading}
        >
          {isUploading ? (
            <View style={styles.avatarPlaceholder}>
              <ActivityIndicator size='large' color={theme.primary} />
            </View>
          ) : avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : user?.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <FontAwesome name='user' size={60} color='#ccc' />
            </View>
          )}
          <View style={styles.editBadge}>
            <FontAwesome name='camera' size={14} color='#fff' />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={formData.firstName}
          onChangeText={(value) => handleChange('firstName', value)}
          placeholder='Enter your first name'
          editable={!isSubmitting}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={formData.lastName}
          onChangeText={(value) => handleChange('lastName', value)}
          placeholder='Enter your last name'
          editable={!isSubmitting}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={formData.phoneNumber}
          onChangeText={(value) => handleChange('phoneNumber', value)}
          placeholder='Enter your phone number'
          keyboardType='phone-pad'
          editable={!isSubmitting}
        />

        <Text style={styles.label}>Nationality</Text>
        <TextInput
          style={styles.input}
          value={formData.nationality}
          onChangeText={(value) => handleChange('nationality', value)}
          placeholder='Enter your nationality'
          editable={!isSubmitting}
        />

        <Text style={styles.label}>Blood Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.bloodType}
            onValueChange={(value) => handleChange('bloodType', value)}
            style={styles.picker}
            enabled={!isSubmitting}
          >
            {bloodTypes.map((type) => (
              <Picker.Item key={type} label={type} value={type} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
          disabled={isSubmitting}
        >
          <Text>{formData.dateOfBirth.toLocaleDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={formData.dateOfBirth}
            mode='date'
            display='default'
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color='white' size='small' />
          ) : (
            <Text style={styles.buttonText}>Update Profile</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: theme.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 50,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: theme.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UpdateProfileForm;
