import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
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

export default function InicioScreen() {
  const [proximos, setProximos] = useState([]);

  const loadDashboardData = async () => {
    try {
      const stored = await AsyncStorage.getItem('pantry_items');
      if (stored) {
        const parsed = JSON.parse(stored);

        const itemsAviso = parsed.map(item => ({
          ...item,
          color: getExpirationColor(item.caducidad)
        })).filter(item => item.color === '#4D1911' || item.color === '#E74C3C' || item.color === '#F39C12');

        const colorPriority = {
          '#4D1911': 1,
          '#E74C3C': 2,
          '#F39C12': 3,
        };

        itemsAviso.sort((a, b) => {
          if (colorPriority[a.color] !== colorPriority[b.color]) {
            return colorPriority[a.color] - colorPriority[b.color];
          }

          const dateA = new Date(a.caducidad);
          const dateB = new Date(b.caducidad);
          return dateA - dateB;
        });

        setProximos(itemsAviso);
      } else {
        setProximos([]);
      }
    } catch (error) {
      console.error('Error cargando despensa en dashboard', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Próximos a vencer</Text>
        {proximos.length === 0 ? (
          <Text style={{ color: '#7F8C8D', marginTop: 10 }}>No hay productos por caducar pronto.</Text>
        ) : (
          <FlatList
            data={proximos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.item, { borderLeftWidth: 4, borderLeftColor: item.color, paddingLeft: 10 }]}>
                <Text style={[styles.itemName, item.color === '#4D1911' && { color: item.color }]}>
                  {item.color === '#4D1911' && '⚠️ '}
                  {item.nombre}
                </Text>
                <Text style={[styles.itemDate, { color: item.color, fontWeight: 'bold' }]}>
                  {item.color === '#4D1911' ? 'PRODUCTO CADUCADO: ' : 'Vence: '}
                  {item.caducidad}
                </Text>
              </View>
            )}
            style={{ maxHeight: 300 }}
          />
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Integrantes: Ivan Santiago y Jesus Magaña</Text>
        <Text style={styles.footerText}>Materia: Desarrollo de aplicaciones web</Text>
        <Text style={styles.footerText}>Profesor: Zeus Cobian</Text>
      </View>
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E74C3C',
    marginBottom: 15,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  itemName: {
    fontSize: 16,
    color: '#34495E',
  },
  itemDate: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2C3E50',
    padding: 20,
    alignItems: 'center',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  footerText: {
    color: '#ECF0F1',
    fontSize: 14,
    marginBottom: 5,
  },
});
