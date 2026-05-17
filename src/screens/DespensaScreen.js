import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const productos = [
  { id: '1', nombre: 'Manzanas', categoria: 'Frutas', caducidad: '2026-05-25' },
  { id: '2', nombre: 'Queso Panela', categoria: 'Lácteos', caducidad: '2026-05-22' },
  { id: '3', nombre: 'Frijoles Negros', categoria: 'Abarrotes', caducidad: '2027-01-10' },
];

export default function DespensaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Despensa</Text>
      
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.productName}>{item.nombre}</Text>
              <Text style={styles.categoryBadge}>{item.categoria}</Text>
            </View>
            <Text style={styles.expirationText}>Caduca: {item.caducidad}</Text>
          </View>
        )}
      />
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
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495E',
  },
  categoryBadge: {
    backgroundColor: '#3498DB',
    color: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    fontSize: 12,
    overflow: 'hidden',
  },
  expirationText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
});
