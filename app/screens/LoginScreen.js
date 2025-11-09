// screens/LoginScreen.js
import React, { useState } from 'react';
// Importa ScrollView
import { View, StyleSheet, Text, Pressable, SafeAreaView, ScrollView } from 'react-native';
import { useAuth } from '../../AuthContext';
import { COLORS, SIZES } from '../../constants/theme';
import StyledInput from '../../components/StyledInput'; 
import StyledButton from '../../components/StyledButton';

export default function LoginScreen({ navigation }) { 
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      await login(username, password); 
    } catch (e) {
      setError('Usuario o contraseña incorrectos.'); 
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Este es el contenedor del formulario ("tarjeta") */}
        <View style={styles.formWrapper}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          
          <StyledInput
            placeholder="Nombre usuario"
            value={username}
            onChangeText={setUsername} 
            autoCapitalize="none"
          />
          <StyledInput
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <StyledButton title="Entrar" onPress={handleLogin} />

          <Pressable onPress={() => navigation.navigate('Register')} style={styles.registerButton}>
            <Text style={styles.registerText}>
              ¿No tienes cuenta? <Text style={styles.registerLink}>Regístrate aquí</Text>
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
    alignItems: 'center', // Centra el formWrapper horizontalmente
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