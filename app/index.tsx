import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function Login() {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/insta-logo.png')} style={styles.logo} />

      <TextInput placeholder="Phone number, username or email" style={styles.input} />
      <TextInput placeholder="Password" style={styles.input} secureTextEntry />

      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.fbContainer}>
        <Image
          source={{ uri: 'https://img.icons8.com/color/48/facebook-new.png' }}
          style={styles.fbIcon}
        />
        <Text style={styles.fbText}>Log in with Facebook</Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      <Text style={styles.signup}>
        Don’t have an account? <Text style={styles.signupLink}>Sign up.</Text>
      </Text>
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
  forgot: {
    textAlign: 'right',
    color: '#3797EF',
    marginBottom: 20,
    fontSize: 13,
  },
  loginButton: {
    backgroundColor: '#3797EF',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: { color: '#fff', fontWeight: 'bold' },
  fbContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  fbIcon: { width: 20, height: 20, marginRight: 8 },
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
