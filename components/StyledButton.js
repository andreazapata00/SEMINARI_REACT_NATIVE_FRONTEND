// components/StyledButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

// Recibe un 'title' (texto) y un 'onPress' (función)
const StyledButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SIZES.base * 2,
    shadowColor: COLORS.primary, // Sombra para un toque 3D
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5, // Para Android
  },
  text: {
    color: COLORS.white,
    fontSize: SIZES.h3,
    fontWeight: 'bold',
  },
});

export default StyledButton;