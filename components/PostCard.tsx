import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Post, toggleLike } from '../lib/posts';

interface PostCardProps {
  post: Post;
  onLikeChange: () => void;
}

export default function PostCard({ post, onLikeChange }: PostCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleLike = async () => {
    try {
      await toggleLike(post.id);
      onLikeChange();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  useEffect(() => {
    console.log('PostCard image URL:', post.image_url);
  }, [post.image_url]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/40' }} // Replace with actual user avatar
          style={styles.avatar}
        />
        <Text style={styles.username}>User</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: post.image_url }}
          style={styles.image}
          onError={(error) => {
            console.error('Image loading error:', error.nativeEvent.error);
            setImageError(true);
          }}
          onLoad={() => {
            console.log('Image loaded successfully:', post.image_url);
          }}
        />
        {imageError && (
          <View style={styles.errorOverlay}>
            <Text style={styles.errorText}>Failed to load image</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
          <Ionicons
            name={post.liked_by_user ? 'heart' : 'heart-outline'}
            size={28}
            color={post.liked_by_user ? '#ed4956' : '#000'}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="paper-plane-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text style={styles.likes}>{post.likes} likes</Text>
        <View style={styles.captionContainer}>
          <Text style={styles.username}>User</Text>
          <Text style={styles.caption}>{post.caption}</Text>
        </View>
        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <Text style={styles.tags}>
            {post.tags.map(tag => `#${tag}`).join(' ')}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  imageContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#666',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    padding: 10,
  },
  actionButton: {
    marginRight: 15,
  },
  info: {
    padding: 10,
  },
  likes: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  captionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  caption: {
    flex: 1,
  },
  tags: {
    color: '#003569',
    marginTop: 5,
  },
});