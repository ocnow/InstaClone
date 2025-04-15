import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { supabase } from '../lib/supabase';
import { FontAwesome } from '@expo/vector-icons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/insta-logo.png')} style={styles.logo} />

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.forgot}>
        <Text style={styles.forgotText}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.loginButton, loading && styles.disabledButton]} 
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginButtonText}>
          {loading ? 'Loading...' : 'Log in'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.fbContainer}>
        <FontAwesome name="facebook-square" size={20} color="#385185" style={styles.fbIcon} />
        <Text style={styles.fbText}>Log in with Facebook</Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity>
        <Text style={styles.signup}>
          Don't have an account? <Text style={styles.signupLink}>Sign up.</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  logo: { width: 200, height: 60, resizeMode: 'contain', alignSelf: 'center', marginBottom: 30 },
  input: {
    height: 44,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  forgot: { alignItems: 'flex-end', marginBottom: 20 },
  forgotText: { color: '#3797EF', fontSize: 13 },
  loginButton: {
    backgroundColor: '#3797EF',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: { opacity: 0.7 },
  loginButtonText: { color: '#fff', fontWeight: 'bold' },
  fbContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  fbIcon: { marginRight: 8 },
  fbText: { color: '#385185', fontWeight: 'bold' },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  orText: {
    marginHorizontal: 10,
    color: '#999',
    fontWeight: 'bold',
  },
  signup: { textAlign: 'center', color: '#999' },
  signupLink: { color: '#3797EF', fontWeight: 'bold' },
}); 