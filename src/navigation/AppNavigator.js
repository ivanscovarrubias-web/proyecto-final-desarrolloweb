import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import InicioScreen from '../screens/InicioScreen';
import DespensaScreen from '../screens/DespensaScreen';
import AgregarScreen from '../screens/AgregarScreen';
import RecetasScreen from '../screens/RecetasScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Despensa') {
            iconName = focused ? 'basket' : 'basket-outline';
          } else if (route.name === 'Agregar') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Recetas') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2ECC71',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Inicio" component={InicioScreen} />
      <Tab.Screen name="Despensa" component={DespensaScreen} />
      <Tab.Screen name="Agregar" component={AgregarScreen} />
      <Tab.Screen name="Recetas" component={RecetasScreen} />
    </Tab.Navigator>
  );
}
