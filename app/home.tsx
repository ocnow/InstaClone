import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import React from 'react';
import AddScreen from './screens/AddScreen';
import PostDetailsScreen from './screens/PostDetailsScreen';
import HomeScreen from './screens/HomeScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function SearchScreen() {
  return (
    <View style={styles.screen}>
      <Text>Search</Text>
    </View>
  );
}

function ReelsScreen() {
  return (
    <View style={styles.screen}>
      <Text>Reels</Text>
    </View>
  );
}

function ProfileScreen() {
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      alert('Error logging out');
    }
  };

  return (
    <View style={styles.screen}>
      <Text>Profile</Text>
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

function AddStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="AddPhoto" 
        component={AddScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PostDetails"
        component={PostDetailsScreen}
        options={{
          headerTitle: 'New Post',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
}

export default function Home() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              return <Ionicons name={iconName} size={26} color={color} />;
            case 'Search':
              iconName = focused ? 'search' : 'search-outline';
              return <Ionicons name={iconName} size={26} color={color} />;
            case 'Create':
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              return <Ionicons name={iconName} size={26} color={color} />;
            case 'Reels':
              iconName = focused ? 'play-circle' : 'play-circle-outline';
              return <Ionicons name={iconName} size={26} color={color} />;
            case 'Profile':
              return (
                <View style={[
                  styles.profileIcon,
                  focused && styles.profileIconActive
                ]}>
                  <Ionicons 
                    name={focused ? 'person-circle' : 'person-circle-outline'} 
                    size={26} 
                    color={color} 
                  />
                </View>
              );
            default:
              iconName = 'home';
              return <Ionicons name={iconName} size={26} color={color} />;
          }
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#262626',
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 85 : 60,
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: Platform.OS === 'ios' ? 30 : 12,
          backgroundColor: '#fff',
          borderTopWidth: 0.5,
          borderTopColor: '#dbdbdb',
          elevation: 0, // Remove Android shadow
          shadowOpacity: 0, // Remove iOS shadow
        },
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen 
        name="Create" 
        component={AddStackNavigator}
      />
      <Tab.Screen name="Reels" component={ReelsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#3797EF',
    borderRadius: 5,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 15,
  },
  cancelButton: {
    marginTop: 15,
    padding: 15,
    alignItems: 'center',
  },
  cancelText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#3797EF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    marginTop: Platform.OS === 'ios' ? -10 : 0,
  },
  profileIcon: {
    borderRadius: 13,
    overflow: 'hidden',
  },
  profileIconActive: {
    borderWidth: 1,
    borderColor: '#000',
  },
});
