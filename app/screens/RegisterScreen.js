// screens/RegisterScreen.js
import React, { useState } from 'react';
// 1. Importa ScrollView
import { View, StyleSheet, Text, SafeAreaView, Pressable, ScrollView } from 'react-native';
import { useAuth } from '../../AuthContext';
import { COLORS, SIZES } from '../../constants/theme';
import StyledInput from '../../components/StyledInput';
import StyledButton from '../../components/StyledButton';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [gmail, setGmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthday, setBirthday] = useState('');
  const { register } = useAuth();
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');
    if (!username || !gmail || !password || !birthday) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    try {
      await register(username, gmail, password, birthday);
    } catch (e) {
      setError('Error al registrar. ¿El email o usuario ya existe?');
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/*Este es el contenedor del formulario ("tarjeta") */}
        <View style={styles.formWrapper}>
          <Text style={styles.title}>Crear Cuenta</Text>

          <StyledInput
            placeholder="Nombre usuario *"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <StyledInput
            placeholder="Email *"
            value={gmail}
            onChangeText={setGmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <StyledInput
            placeholder="Contraseña *"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <StyledInput
            placeholder="Fecha de nacimiento (AAAA-MM-DD) *"
            value={birthday}
            onChangeText={setBirthday}
            autoCapitalize="none"
          />
          
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <StyledButton title="Registrarse" onPress={handleRegister} />

          <Pressable onPress={() => navigation.goBack()} style={styles.registerButton}>
            <Text style={styles.registerText}>
              ¿Ya tienes cuenta? <Text style={styles.registerLink}>Inicia sesión</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- ESTILOS---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.grayLight,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center', //Centra el formWrapper horizontalmente
    paddingHorizontal: SIZES.padding, // Agrega padding horizontal aquí
  },
  formWrapper: {
    width: '100%',
    maxWidth: 450, // Mantén este maxWidth para pantallas grandes
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 1.5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: { 
    fontSize: SIZES.h1, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: SIZES.padding,
    color: COLORS.primary,
  },
  error: { 
    color: COLORS.danger, 
    textAlign: 'center', 
    marginVertical: SIZES.base,
  },
  registerButton: {
    marginTop: SIZES.base,
  },
  registerText: {
    color: COLORS.grayDark,
    textAlign: 'center',
  },
  registerLink: {
    color: COLORS.primary,
    fontWeight: 'bold',
  }
});