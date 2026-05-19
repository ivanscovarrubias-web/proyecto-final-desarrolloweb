import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
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
  if (diffDays <= 5) return '#F39C12'; // Naranja
  return '#2ECC71'; // Verde
};

export default function InicioScreen() {
  const [proximos, setProximos] = useState([]);
  const navigation = useNavigation();

  const loadDashboardData = async () => {
    try {
      const stored = await AsyncStorage.getItem('pantry_items');
      if (stored) {
        const parsed = JSON.parse(stored);

        const itemsAviso = parsed.filter(item => {
          if (!item.caducidad) return false;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const [year, month, day] = item.caducidad.split('-');
          const expDateLocal = new Date(year, month - 1, day);
          const diffTime = expDateLocal - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 5;
        }).map(item => ({
          ...item,
          color: getExpirationColor(item.caducidad)
        }));

        const colorPriority = {
          '#4D1911': 1,
          '#E74C3C': 2,
          '#F39C12': 3,
        };

        itemsAviso.sort((a, b) => {
          if (colorPriority[a.color] !== colorPriority[b.color]) {
            return (colorPriority[a.color] || 4) - (colorPriority[b.color] || 4);
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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity 
          onPress={async () => {
            await AsyncStorage.removeItem('alreadyLaunched');
            alert('¡Listo! Reinicia la app o recarga para ver la Bienvenida de nuevo.');
          }}
          style={{ backgroundColor: '#E74C3C', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, marginTop: 20 }}
        >
          <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold' }}>Reset Onboarding</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>¡Urgente! Consumir pronto</Text>
        {proximos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.motivationalText}>¡Tu despensa está al día!</Text>
            <Text style={styles.emptySubtext}>No tienes productos por vencer pronto.</Text>
          </View>
        ) : (
          <FlatList
            data={proximos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.item, { borderLeftWidth: 4, borderLeftColor: item.color }]}
                onPress={() => navigation.navigate('Despensa')}
                activeOpacity={0.7}
              >
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, item.color === '#4D1911' && { color: item.color }]}>
                    {item.color === '#4D1911' && '⚠️ '}
                    {item.nombre}
                  </Text>
                  <Text style={styles.itemCategory}>{item.categoria}</Text>
                </View>
                <Text style={[styles.itemDate, { color: item.color }]}>
                  {item.color === '#4D1911' ? 'CADUCADO' : `Vence: ${item.caducidad}`}
                </Text>
              </TouchableOpacity>
            )}
            style={{ maxHeight: 400 }}
            showsVerticalScrollIndicator={false}
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
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 80,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E74C3C',
    marginBottom: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  motivationalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2ECC71',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  itemDate: {
    fontSize: 14,
    fontWeight: 'bold',
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
