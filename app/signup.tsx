import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet,Image } from 'react-native';
import { supabase } from '../lib/supabase';
import Logo from '@/components/logo';
import { useRouter } from 'expo-router';

export default function SignUp() {
    const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email: username, // using email as username
      password,
    });

    if (error) alert(error.message);
    else {
        alert('Sign up successful you can now login');
        router.replace(`/?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
    }
  };

  return (
    <View style={styles.container}>
      <Logo />

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  logo: { fontSize: 32, textAlign: 'center', marginBottom: 40 },
  input: {
    height: 44,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#3797EF',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});