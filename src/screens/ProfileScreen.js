import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActionSheetIOS,
  Platform,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_PIC_KEY = '@product_app/profile_picture';

const MENU_ITEMS = [
  { icon: '📦', label: 'My Orders' },
  { icon: '📍', label: 'Saved Addresses' },
  { icon: '💳', label: 'Payment Methods' },
  { icon: '🔔', label: 'Notifications' },
  { icon: '🔒', label: 'Privacy & Security' },
  { icon: '❓', label: 'Help & Support' },
  { icon: 'ℹ️', label: 'About' },
  { icon: '🚪', label: 'Log Out' },
];

export default function ProfileScreen() {
  const [profilePic, setProfilePic] = useState(null);
  const [loadingPic, setLoadingPic] = useState(true);

  // Load persisted profile picture on mount (survives app close/reopen).
  useEffect(() => {
    (async () => {
      try {
        const uri = await AsyncStorage.getItem(PROFILE_PIC_KEY);
        if (uri) setProfilePic(uri);
      } catch (e) {
        console.warn('Failed to load profile picture', e);
      } finally {
        setLoadingPic(false);
      }
    })();
  }, []);

  const persistProfilePic = useCallback(async (uri) => {
    setProfilePic(uri);
    try {
      await AsyncStorage.setItem(PROFILE_PIC_KEY, uri);
    } catch (e) {
      console.warn('Failed to save profile picture', e);
      Alert.alert('Error', 'Could not save your profile picture. Please try again.');
    }
  }, []);

  const pickFromLibrary = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'We need access to your photo library to update your profile picture. Please enable it in your device settings.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      persistProfilePic(result.assets[0].uri);
    }
  }, [persistProfilePic]);

  const takePhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Camera Permission Denied',
        'We need access to your camera to take a new profile picture. Please enable camera permission in your device settings.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      persistProfilePic(result.assets[0].uri);
    }
  }, [persistProfilePic]);

  // Tapping the pencil icon offers a choice: take a new photo or pick from gallery.
  const handleEditPicture = useCallback(() => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Library'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) takePhoto();
          else if (buttonIndex === 2) pickFromLibrary();
        }
      );
    } else {
      Alert.alert('Update Profile Picture', 'Choose an option', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickFromLibrary },
      ]);
    }
  }, [takePhoto, pickFromLibrary]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={styles.avatarSection}>
        <View style={styles.avatarWrapper}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarPlaceholderText}>👤</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditPicture}
            accessibilityLabel="Edit profile picture"
          >
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>Rohit Neel</Text>
        <Text style={styles.email}>rohitneel007@gmail.com</Text>
      </View>

      <View style={styles.menuSection}>
        {MENU_ITEMS.map((item, idx) => (
          // These menu items are intentionally non-functional per the spec —
          // they're for display only, with no action attached.
          <View key={idx} style={styles.menuItem}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuChevron}>›</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 28,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarWrapper: { position: 'relative' },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#f0f0f0',
  },
  avatarPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  avatarPlaceholderText: { fontSize: 48 },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  editIcon: { fontSize: 15 },
  name: { fontSize: 18, fontWeight: '700', color: '#222', marginTop: 14 },
  email: { fontSize: 13, color: '#888', marginTop: 2 },
  menuSection: { paddingTop: 8 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  menuIcon: { fontSize: 18, width: 32 },
  menuLabel: { flex: 1, fontSize: 15, color: '#333' },
  menuChevron: { fontSize: 18, color: '#bbb' },
});
