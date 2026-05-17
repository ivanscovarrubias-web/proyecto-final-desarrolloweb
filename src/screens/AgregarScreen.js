import React, { useState, createElement } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AgregarScreen() {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [caducidad, setCaducidad] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [caducidadWeb, setCaducidadWeb] = useState(new Date().toISOString().split('T')[0]); // Fallback para web
  const [mensajeExito, setMensajeExito] = useState('');

  const handleGuardar = async () => {
    if (!nombre.trim() || !categoria.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre y selecciona una categoría.');
      return;
    }

    try {
      const fechaFinal = Platform.OS === 'web' 
        ? caducidadWeb 
        : caducidad.toISOString().split('T')[0];

      if (!fechaFinal) {
        Alert.alert('Error', 'Por favor selecciona una fecha de caducidad válida.');
        return;
      }

      const nuevoProducto = {
        id: Date.now().toString(),
        nombre: nombre.trim(),
        categoria,
        caducidad: fechaFinal,
      };

      const existingItems = await AsyncStorage.getItem('pantry_items');
      const parsedItems = existingItems ? JSON.parse(existingItems) : [];
      
      parsedItems.push(nuevoProducto);
      
      await AsyncStorage.setItem('pantry_items', JSON.stringify(parsedItems));
      
      // Limpiar formulario
      setNombre('');
      setCategoria('');
      setCaducidad(new Date());
      setCaducidadWeb(new Date().toISOString().split('T')[0]);
      
      setMensajeExito('¡ Producto agregado correctamente !');
      setTimeout(() => setMensajeExito(''), 3000);
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      Alert.alert('Error', 'No se pudo guardar el producto.');
    }
  };

  const onChangeDate = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setCaducidad(selectedDate);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Agregar Producto</Text>

        {mensajeExito !== '' && (
          <View style={styles.successBanner}>
            <Text style={styles.successText}>{mensajeExito}</Text>
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre del Producto</Text>
            <TextInput 
              style={styles.input}
              placeholder="Ej. Tomates"
              placeholderTextColor="#BDC3C7"
              value={nombre}
              onChangeText={setNombre}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoría</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={categoria}
                onValueChange={(itemValue) => setCategoria(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Selecciona una categoría..." value="" />
                <Picker.Item label="Lácteos" value="Lácteos" />
                <Picker.Item label="Verduras" value="Verduras" />
                <Picker.Item label="Frutas" value="Frutas" />
                <Picker.Item label="Carnes" value="Carnes" />
                <Picker.Item label="Granos" value="Granos" />
                <Picker.Item label="Bebidas" value="Bebidas" />
                <Picker.Item label="Otros" value="Otros" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fecha de Caducidad</Text>
            {Platform.OS === 'web' ? (
              createElement('input', {
                type: 'date',
                value: caducidadWeb,
                onChange: (e) => setCaducidadWeb(e.target.value),
                style: {
                  padding: '12px',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: '#E0E6ED',
                  borderRadius: '8px',
                  fontSize: '16px',
                  color: '#2C3E50',
                  backgroundColor: '#F8FAFC',
                  width: '100%',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  outline: 'none'
                }
              })
            ) : Platform.OS === 'ios' ? (
              <DateTimePicker
                value={caducidad}
                mode="date"
                display="inline"
                onChange={onChangeDate}
                style={styles.datePickerIOS}
              />
            ) : (
              <>
                <TouchableOpacity 
                  style={styles.datePickerButton} 
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateText}>{caducidad.toISOString().split('T')[0]}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={caducidad}
                    mode="date"
                    display="calendar"
                    onChange={onChangeDate}
                  />
                )}
              </>
            )}
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginBottom: 30,
    marginTop: 40,
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E6ED',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2C3E50',
    backgroundColor: '#F8FAFC',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E0E6ED',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#E0E6ED',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F8FAFC',
  },
  dateText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  datePickerIOS: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: '#2ECC71',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
