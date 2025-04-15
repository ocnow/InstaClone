import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

const Tab = createBottomTabNavigator();

// Placeholder screens for each tab
function HomeScreen() {
  return (
    <View style={styles.screen}>
      <Text>Home</Text>
    </View>
  );
}

function SearchScreen() {
  return (
    <View style={styles.screen}>
      <Text>Search</Text>
    </View>
  );
}

function AddScreen() {
  return (
    <View style={styles.screen}>
      <Text>Add</Text>
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

export default function Home() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Add') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Reels') {
            iconName = focused ? 'play-circle' : 'play-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Add" component={AddScreen} />
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
});
