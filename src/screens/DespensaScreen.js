import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getExpirationColor = (caducidad) => {
  if (!caducidad) return '#7F8C8D';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const [year, month, day] = caducidad.split('-');
  const expDateLocal = new Date(year, month - 1, day);
  
  const diffTime = expDateLocal - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return '#4D1911'; // Caducado
  if (diffDays <= 3) return '#E74C3C'; // Rojo
  if (diffDays <= 7) return '#F39C12'; // Naranja
  return '#2ECC71'; // Verde
};

export default function DespensaScreen() {
  const [productos, setProductos] = useState([]);
  const [mensajeExito, setMensajeExito] = useState('');

  const loadProductos = async () => {
    try {
      const stored = await AsyncStorage.getItem('pantry_items');
      if (stored) {
        const parsed = JSON.parse(stored);
        const colorPriority = {
          '#4D1911': 1,
          '#E74C3C': 2,
          '#F39C12': 3,
          '#7F8C8D': 4,
          '#2ECC71': 5,
        };
        parsed.sort((a, b) => {
          const colorA = getExpirationColor(a.caducidad);
          const colorB = getExpirationColor(b.caducidad);
          if (colorPriority[colorA] !== colorPriority[colorB]) {
            return colorPriority[colorA] - colorPriority[colorB];
          }
          return new Date(a.caducidad) - new Date(b.caducidad);
        });
        setProductos(parsed);
      } else {
        setProductos([]);
      }
    } catch (error) {
      console.error('Error cargando la despensa', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProductos();
    }, [])
  );

  const eliminarProducto = async (id) => {
    try {
      const stored = await AsyncStorage.getItem('pantry_items');
      if (stored) {
        const parsed = JSON.parse(stored);
        const filtrados = parsed.filter(item => item.id !== id);
        await AsyncStorage.setItem('pantry_items', JSON.stringify(filtrados));
        setProductos(filtrados);
        setMensajeExito('¡ Producto eliminado correctamente !');
        setTimeout(() => setMensajeExito(''), 3000);
      }
    } catch (error) {
      console.error('Error eliminando producto', error);
      Alert.alert('Error', 'No se pudo eliminar el producto');
    }
  };

  const confirmEliminar = (id, nombre) => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm(`¿Estás seguro de que deseas eliminar ${nombre}?`);
      if (confirm) {
        eliminarProducto(id);
      }
    } else {
      Alert.alert(
        'Eliminar Producto',
        `¿Estás seguro de que deseas eliminar ${nombre}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Eliminar', style: 'destructive', onPress: () => eliminarProducto(id) }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Despensa</Text>

      {mensajeExito !== '' && (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>{mensajeExito}</Text>
        </View>
      )}
      
      {productos.length === 0 ? (
        <Text style={styles.emptyText}>Tu despensa está vacía. Agrega productos desde la pantalla de Agregar.</Text>
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const expirationColor = getExpirationColor(item.caducidad);
            return (
              <View style={[styles.card, { borderLeftWidth: 5, borderLeftColor: expirationColor }]}>
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.productName}>{item.nombre}</Text>
                    <Text style={styles.categoryBadge}>{item.categoria}</Text>
                  </View>
                  <Text style={[styles.expirationText, { color: expirationColor, fontWeight: 'bold' }]}>
                    {expirationColor === '#4D1911' ? '⚠️ PRODUCTO CADUCADO: ' : 'Caduca: '}
                    {item.caducidad}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton} 
                  onPress={() => confirmEliminar(item.id, item.nombre)}
                >
                  <Text style={styles.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardContent: {
    flex: 1,
    marginRight: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495E',
    marginRight: 8,
    marginBottom: 4,
  },
  categoryBadge: {
    backgroundColor: '#3498DB',
    color: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    fontSize: 12,
    overflow: 'hidden',
    marginBottom: 4,
  },
  expirationText: {
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  successBanner: {
    backgroundColor: '#D5F5E3',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#2ECC71',
  },
  successText: {
    color: '#27AE60',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
