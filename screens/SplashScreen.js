import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../utils/ThemeContext';

const SplashScreen = ({ navigation }) => {
  const { themeStyles } = useTheme();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.5,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      navigation.replace('Home');
    }, 3000);
  }, [fadeAnim, scaleAnim, navigation]);

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.accentColor }]}>
      <Animated.Text
        style={[styles.appName, { opacity: fadeAnim, transform: [{ scale: scaleAnim }], color: '#ffffff' }]}
      >
        FAIS LE 
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
  },
});

export default SplashScreen;