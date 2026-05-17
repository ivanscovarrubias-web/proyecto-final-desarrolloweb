import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const proximosVencer = [
  { id: '1', nombre: 'Leche Deslactosada', fecha: '2026-05-18' },
  { id: '2', nombre: 'Yogurt Natural', fecha: '2026-05-19' },
  { id: '3', nombre: 'Pan de Caja', fecha: '2026-05-20' },
];

export default function InicioScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Próximos a vencer</Text>
        <FlatList
          data={proximosVencer}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemName}>{item.nombre}</Text>
              <Text style={styles.itemDate}>Vence: {item.fecha}</Text>
            </View>
          )}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Integrantes: Ivan Santiago, Jesus Magaña</Text>
        <Text style={styles.footerText}>Materia: DAW</Text>
        <Text style={styles.footerText}>Profesor: Zeus Cobian</Text>
        <Text style={styles.footerText}>2026</Text>
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
