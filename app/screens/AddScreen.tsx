import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function AddScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigation = useNavigation();

  // Reset state when screen loses focus
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        // This runs when screen loses focus
        setSelectedImage(null);
      };
    }, [])
  );

  // Also reset state when component unmounts
  useEffect(() => {
    return () => {
      setSelectedImage(null);
    };
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return false;
      }
      return true;
    }
    return true;
  };

  const handleCameraPress = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleGalleryPress = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleNext = () => {
    if (selectedImage) {
      // @ts-ignore - We'll fix this type later
      navigation.navigate('PostDetails', { imageUri: selectedImage });
    }
  };

  if (selectedImage) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        <TouchableOpacity 
          style={styles.option}
          onPress={handleCameraPress}
        >
          <Ionicons name="camera" size={32} color="#000" />
          <Text style={styles.optionText}>Camera</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity 
          style={styles.option}
          onPress={handleGalleryPress}
        >
          <Ionicons name="images" size={32} color="#000" />
          <Text style={styles.optionText}>Gallery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
  },
  option: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionText: {
    marginTop: 8,
    fontSize: 14,
    color: '#262626',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#dbdbdb',
  },
  selectedImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
    backgroundColor: '#f0f0f0',
  },
  nextButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#0095f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});