import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RecetasScreen() {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const openRecipeDetails = async (id) => {
    setModalVisible(true);
    setLoadingDetails(true);
    setRecipeDetails(null);
    try {
      const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=8e1268f97a6a4ddc959da87e3467c3bc`;
      const response = await fetch(url);
      const data = await response.json();
      setRecipeDetails(data);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const fetchRecetas = async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem('pantry_items');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) {
          const ingredientes = parsed.map(item => item.nombre).join(',');
          const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientes}&apiKey=8e1268f97a6a4ddc959da87e3467c3bc`;
          const response = await fetch(url);
          const data = await response.json();
          setRecetas(data);
        } else {
          setRecetas([]);
        }
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRecetas();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recetas Sugeridas</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3498DB" style={{ marginTop: 50 }} />
      ) : recetas.length === 0 ? (
        <Text style={styles.emptyText}>No hay recetas disponibles. Agrega ingredientes a tu despensa.</Text>
      ) : (
        <FlatList
          data={recetas}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.gridContainer}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.gridItem} onPress={() => openRecipeDetails(item.id)}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.cardContent}>
                <Text style={styles.recipeTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.recipeMeta}>Faltan {item.missedIngredientCount} ingredientes:</Text>
                {item.missedIngredients && item.missedIngredients.length > 0 && (
                  <Text style={styles.missingIngredientsList} numberOfLines={2}>
                    {item.missedIngredients.map(i => i.name).join(', ')}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {loadingDetails ? (
              <ActivityIndicator size="large" color="#3498DB" />
            ) : recipeDetails ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Image source={{ uri: recipeDetails.image }} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{recipeDetails.title}</Text>
                
                <Text style={styles.modalSubtitle}>Ingredientes y medidas:</Text>
                {recipeDetails.extendedIngredients && recipeDetails.extendedIngredients.map((ing, idx) => (
                  <Text key={idx} style={styles.modalText}>• {ing.original}</Text>
                ))}

                <Text style={styles.modalSubtitle}>Instrucciones:</Text>
                {recipeDetails.analyzedInstructions && recipeDetails.analyzedInstructions.length > 0 ? (
                  recipeDetails.analyzedInstructions[0].steps.map((step, idx) => (
                    <Text key={idx} style={styles.modalStepText}>
                      <Text style={{fontWeight: 'bold'}}>{step.number}.</Text> {step.step}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.modalText}>No hay instrucciones detalladas disponibles para esta receta.</Text>
                )}

                <TouchableOpacity 
                  style={styles.closeButton} 
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </ScrollView>
            ) : (
              <Text style={styles.modalText}>Hubo un error al cargar los detalles.</Text>
            )}
          </View>
        </View>
      </Modal>
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
  gridContainer: {
    paddingBottom: 20,
  },
  row: {
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
  image: {
    height: 120,
    width: '100%',
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 12,
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 4,
  },
  recipeMeta: {
    fontSize: 12,
    color: '#E74C3C',
    fontWeight: '500',
  },
  missingIngredientsList: {
    fontSize: 11,
    color: '#E67E22',
    marginTop: 2,
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    color: '#7F8C8D',
    marginTop: 20,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495E',
    marginTop: 15,
    marginBottom: 5,
  },
  modalText: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 5,
  },
  modalStepText: {
    fontSize: 16,
    color: '#34495E',
    marginBottom: 10,
    lineHeight: 22,
  },
  closeButton: {
    backgroundColor: '#E74C3C',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
