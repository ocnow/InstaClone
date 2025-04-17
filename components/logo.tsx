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
    width: 100,
    height: 30,
    resizeMode: 'contain',
    marginLeft: 15,
    marginVertical: 10,
  },
});
