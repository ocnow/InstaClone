import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { uploadImage, createPost } from '../../lib/posts';
import { Ionicons } from '@expo/vector-icons';

export default function PostDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ visible: false, type: '', message: '' });
  const notificationOpacity = new Animated.Value(0);
  
  // @ts-ignore - We'll fix the types later
  const { imageUri } = route.params;

  useEffect(() => {
    if (notification.visible) {
      // Fade in
      Animated.timing(notificationOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto hide after 3 seconds
      const timer = setTimeout(() => {
        hideNotification();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification.visible]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ visible: true, type, message });
  };

  const hideNotification = () => {
    Animated.timing(notificationOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setNotification({ visible: false, type: '', message: '' });
    });
  };

  const handleShare = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      // First upload the image
      console.log('Uploading image:', imageUri);
      const imageUrl = await uploadImage(imageUri);
      console.log('Uploaded image URL:', imageUrl);
      
      // Then create the post
      await createPost(imageUrl, caption, tags);
      console.log('Post created with image URL:', imageUrl);
      
      // Show success notification
      showNotification('success', 'Post shared successfully!');
      
      // Navigate back to home after a short delay
      setTimeout(() => {
        // @ts-ignore
        navigation.navigate('Home');
      }, 1500);
      
    } catch (error) {
      console.error('Error sharing post:', error);
      showNotification('error', 'Failed to share post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.captionInput}
            placeholder="Write a caption..."
            multiline
            value={caption}
            onChangeText={setCaption}
            editable={!isLoading}
          />
          
          <TextInput
            style={styles.tagsInput}
            placeholder="Add tags (comma separated)"
            value={tags}
            onChangeText={setTags}
            editable={!isLoading}
          />
        </View>
      </ScrollView>
      
      <TouchableOpacity 
        style={[styles.shareButton, isLoading && styles.shareButtonDisabled]}
        onPress={handleShare}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.shareButtonText}>Share</Text>
        )}
      </TouchableOpacity>

      {notification.visible && (
        <Animated.View 
          style={[
            styles.notification,
            notification.type === 'success' ? styles.successNotification : styles.errorNotification,
            { opacity: notificationOpacity }
          ]}
        >
          <Ionicons 
            name={notification.type === 'success' ? 'checkmark-circle' : 'alert-circle'} 
            size={24} 
            color="#fff" 
            style={styles.notificationIcon}
          />
          <Text style={styles.notificationText}>{notification.message}</Text>
        </Animated.View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    padding: 15,
  },
  captionInput: {
    minHeight: 100,
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
    paddingVertical: 10,
    marginBottom: 15,
  },
  tagsInput: {
    minHeight: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
    paddingVertical: 10,
  },
  shareButton: {
    backgroundColor: '#0095f6',
    padding: 15,
    margin: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  shareButtonDisabled: {
    opacity: 0.7,
  },
  notification: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    right: 20,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  successNotification: {
    backgroundColor: '#4BB543',
  },
  errorNotification: {
    backgroundColor: '#ff3b30',
  },
  notificationText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
    marginLeft: 12,
  },
  notificationIcon: {
    marginRight: 8,
  },
});