import { Image, StyleSheet } from 'react-native';

export default function Logo() {
  return (
    <Image
      source={require('../assets/insta-logo.png')}
      style={styles.logo}
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 200,
    height: 60,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 40,
  },
});
