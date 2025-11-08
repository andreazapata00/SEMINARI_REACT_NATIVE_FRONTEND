// screens/HomeScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, Text, StyleSheet, 
  SafeAreaView, FlatList, ActivityIndicator, 
  ScrollView, Alert, Pressable,
  Dimensions,
  Platform 
} from 'react-native';
import { useAuth } from '../AuthContext';    
import apiClient from '../apiClient'; 
import { COLORS, SIZES } from '../theme';
import StyledInput from '../components/StyledInput';
import StyledButton from '../components/StyledButton';

// Hook para detectar el ancho de la pantalla
const useScreenDimensions = () => {
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  useEffect(() => {
    const onChange = ({ window }) => {
      setScreenWidth(window.width);
    };
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);
  
  // 768px es un breakpoint estándar para tablets
  return { isWideScreen: screenWidth > 768 }; 
};

export default function HomeScreen() {
  const { logout } = useAuth();
  const { isWideScreen } = useScreenDimensions();
  
  // --- Estados ---
  const [usuarios, setUsuarios] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado del formulario
  const [eventName, setEventName] = useState('');
  const [eventSchedule, setEventSchedule] = useState('');
  const [eventAddress, setEventAddress] = useState('');
  
  // Estado para la lista de usuarios
  const [showUsers, setShowUsers] =useState(false);

  // --- Funciones de Carga y Creación ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [userResponse, eventResponse] = await Promise.all([
        apiClient.get('/user'),
        apiClient.get('/event')
      ]);
      setUsuarios(userResponse.data);
      setEventos(eventResponse.data);
    } catch (e) { 
      console.error("Error pidiendo datos protegidos:", e); 
      setError('Falló la carga de datos.'); 
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(); 
  }, [fetchData]);

  const handleCreateEvent = async () => {
    if (!eventName || !eventSchedule) {
      Alert.alert('Error', 'Nombre y Horario son obligatorios.');
      return;
    }
    try {
      await apiClient.post('/event', {
        name: eventName,
        schedule: eventSchedule,
        address: eventAddress || undefined,
      });
      setEventName('');
      setEventSchedule('');
      setEventAddress('');
      Alert.alert('Éxito', 'Evento creado correctamente.');
      fetchData(); 
    } catch (e) {
      console.error("Error creando evento:", e);
      Alert.alert('Error', 'No se pudo crear el evento.');
    }
  };

  // ---  FUNCIÓN DE BORRADO  ---
  const handleDeleteEvent = async (eventId) => {
    
    // Esta es la acción que se ejecutará si el usuario confirma
    const performDelete = async () => {
      try {
        await apiClient.delete(`/event/${eventId}`);
        // El Alert de 'Éxito'
        Alert.alert('Éxito', 'Evento eliminado.');
        fetchData(); // Recarga la lista
      } catch (e) {
        console.error("Error eliminando evento:", e);
        Alert.alert('Error', 'No se pudo eliminar el evento.');
      }
    };

    const confirmationMessage = "¿Estás seguro de que quieres eliminar este evento?";

    // Comprobamos la plataforma
    if (Platform.OS === 'web') {
      // --- Para Web: Usamos 'window.confirm' ---
      if (window.confirm(confirmationMessage)) {
        await performDelete();
      }
    } else {
      // --- Para Móvil: Usamos 'Alert.alert' ---
      Alert.alert(
        "Confirmar Eliminación",
        confirmationMessage,
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Eliminar", 
            style: "destructive", 
            onPress: performDelete 
          }
        ]
      );
    }
  };
  // ------------------------------------------

  // --- Renderers ---
  const renderUserItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.username}</Text>
      <Text style={styles.cardText}>Email: {item.gmail}</Text>
    </View>
  );

  const renderEventItem = ({ item }) => (
    <View style={styles.card}>
      {/* Botón de Borrar (con 'position: absolute') */}
      <Pressable 
        style={styles.deleteButton} 
        onPress={() => handleDeleteEvent(item._id)}
      >
        <Text style={styles.deleteButtonText}>X</Text>
      </Pressable>
      
      {/* Contenido de la tarjeta */}
      <Text style={styles.cardTitle}>{item.name}</Text> 
      <Text style={styles.cardText}>Horario: {item.schedule}</Text>
      {item.address && <Text style={styles.cardDate}>Dirección: {item.address}</Text>}
    </View>
  );

  // --- Pantallas de Carga / Error ---
  if (loading && !usuarios.length) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando datos del dashboard...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable onPress={logout}>
          <Text style={styles.logoutButton}>Cerrar Sesión</Text>
        </Pressable>
      </View>
    );
  }
  
  // --- JSX Principal ---
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          
          {/* --- Cabecera --- */}
          <View style={styles.header}>
            <Text style={styles.title}>¡Bienvenido!</Text>
            <Pressable onPress={logout}>
              <Text style={styles.logoutButton}>Cerrar Sesión</Text>
            </Pressable>
          </View>
          
          {/* --- Contenido Principal (Izquierda/Derecha) --- */}
          <View style={[
            styles.mainContent, 
            { 
              flexDirection: isWideScreen ? 'row' : 'column',
              gap: SIZES.padding // 'gap' gestiona el espacio
            }
          ]}>
            
            {/* --- Columna Izquierda (Formulario) --- */}
            <View style={[styles.column, { flex: 1 }]}>
              <View style={styles.formContainer}>
                <Text style={styles.listTitle}>Crear Nuevo Evento</Text>
                <StyledInput
                  placeholder="Nombre del Evento *"
                  value={eventName} onChangeText={setEventName}
                />
                <StyledInput
                  placeholder="Horario (ej. 19:00 - 21:00) *"
                  value={eventSchedule} onChangeText={setEventSchedule}
                />
                <StyledInput
                  placeholder="Dirección (Opcional)"
                  value={eventAddress} onChangeText={setEventAddress}
                />
                <StyledButton title="Crear Evento" onPress={handleCreateEvent} />
              </View>
            </View>
            
            {/* --- Columna Derecha (Eventos) --- */}
            <View style={[styles.column, { flex: 1 }]}>
              <View style={[styles.listContainer, { height: 500 }]}>
                <Text style={styles.listTitle}>Eventos</Text>
                {loading && <ActivityIndicator size="small" style={{marginVertical: 10}}/>} 
                <FlatList
                  data={eventos}
                  keyExtractor={(item) => item._id.toString()} 
                  renderItem={renderEventItem}
                  ListEmptyComponent={<Text style={styles.emptyText}>No hay eventos</Text>}
                  scrollEnabled={true} // Scroll habilitado para esta lista
                />
              </View>
            </View>
            
          </View> {/* --- Fin de mainContent --- */}
          
          {/* --- Sección de Usuarios (Abajo) --- */}
          <View style={styles.usersSection}>
            <StyledButton
              title={showUsers ? "Ocultar Usuarios" : "Mostrar Usuarios"}
              onPress={() => setShowUsers(!showUsers)} // Toggle
            />
            
            {showUsers && ( // Renderizado condicional
              <View style={styles.listContainer}>
                <Text style={styles.listTitle}>Usuarios</Text>
                {loading && <ActivityIndicator size="small" style={{marginVertical: 10}}/>} 
                <FlatList
                  data={usuarios}
                  keyExtractor={(item) => item._id.toString()} 
                  renderItem={renderUserItem}
                  ListEmptyComponent={<Text style={styles.emptyText}>No hay usuarios</Text>}
                  scrollEnabled={false} 
                />
              </View>
            )}
          </View>
          
        </View> 
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.grayLight,
  },
  scrollContainer: {
    alignItems: 'center',
    padding: SIZES.padding,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 1200, // Ancho máximo para el dashboard
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: SIZES.padding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  title: { 
    fontSize: SIZES.h1, 
    fontWeight: 'bold', 
    color: COLORS.primary,
  },
  logoutButton: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: SIZES.body3,
  },
  mainContent: {
    marginVertical: SIZES.padding,
  },
  column: {
    width: '100%',
  },
  usersSection: {
    marginTop: SIZES.padding,
  },
  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  listContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  listTitle: { 
    fontSize: SIZES.h2, 
    fontWeight: 'bold', 
    marginBottom: SIZES.base * 2,
    color: COLORS.black,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding / 1.5,
    marginBottom: SIZES.base * 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.grayMedium,
  },
  cardTitle: { 
    fontSize: SIZES.h3, 
    fontWeight: 'bold',
    color: COLORS.black,
    paddingRight: SIZES.padding, // Para que el título no se ponga debajo de la 'X'
  },
  cardText: { 
    fontSize: SIZES.body3, 
    color: COLORS.grayDark,
    marginTop: SIZES.base / 2,
  },
  cardDate: { 
    fontSize: 14, 
    color: COLORS.grayDark, 
    fontStyle: 'italic', 
    marginTop: SIZES.base
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 5,
  },
  deleteButtonText: {
    color: COLORS.danger,
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: { 
    color: COLORS.danger, 
    textAlign: 'center', 
    fontSize: SIZES.h3, 
    marginBottom: SIZES.padding
  },
  emptyText: { 
    textAlign: 'center', 
    color: COLORS.grayDark, 
    fontSize: SIZES.body3, 
    marginVertical: SIZES.base
  },
});