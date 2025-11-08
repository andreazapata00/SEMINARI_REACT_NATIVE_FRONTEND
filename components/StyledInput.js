// components/StyledInput.js
import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../theme';

const StyledInput = (props) => {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor={COLORS.grayDark}
      {...props} // Pasa todas las demás props (value, onChangeText, etc.)
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.grayMedium,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding / 1.5,
    marginVertical: SIZES.base,
    fontSize: SIZES.body3,
    color: COLORS.black,
  },
});

export default StyledInput;