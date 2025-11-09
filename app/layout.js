// App.js
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthProvider, useAuth } from '../AuthContext'; 
import LoginScreen from './screens/LoginScreen';      
import HomeScreen from './screens/HomeScreen';        
import RegisterScreen from './screens/RegisterScreen'; 

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { token, isLoading } = useAuth(); 

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {token ? (
          // Si hay token: Muestra la app
          <Stack.Screen name=" " component={HomeScreen} />
        ) : (
          // Si NO hay token: Muestra Login y Registro
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }} 
            />
            {/* --- 2. AÑADE LA PANTALLA AL NAVEGADOR --- */}
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{ title: " "}} // Le pone un título bonito
            />
            {/* ------------------------------------------- */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}