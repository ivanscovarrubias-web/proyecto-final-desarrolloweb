import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const recetas = [
  { 
    id: '1', 
    titulo: 'Ensalada Fresca', 
    tiempo: '15 min',
    dificultad: 'Fácil',
    // Using a placeholder color since it's static and we don't have images yet
    color: '#FAD7A1'
  },
  { 
    id: '2', 
    titulo: 'Sopa de Tomate', 
    tiempo: '30 min',
    dificultad: 'Media',
    color: '#F5B041'
  },
];

export default function RecetasScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Recetas Sugeridas</Text>

      <View style={styles.gridContainer}>
        {recetas.map((receta) => (
          <View key={receta.id} style={styles.gridItem}>
            <View style={[styles.imagePlaceholder, { backgroundColor: receta.color }]} />
            <View style={styles.cardContent}>
              <Text style={styles.recipeTitle}>{receta.titulo}</Text>
              <Text style={styles.recipeMeta}>{receta.tiempo} • {receta.dificultad}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imagePlaceholder: {
    height: 120,
    width: '100%',
  },
  cardContent: {
    padding: 12,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 4,
  },
  recipeMeta: {
    fontSize: 12,
    color: '#7F8C8D',
  },
});
