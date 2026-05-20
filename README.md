# NoCaduca 🍎✅

Una aplicación móvil inteligente diseñada para gestionar tu despensa y evitar el desperdicio de alimentos. Registra tus productos, supervisa las fechas de caducidad y obtén alertas visuales antes de que sea demasiado tarde.

## Integrantes
- **Santiago Covarrubias Ivan Raul** se especializo en el desarrollo de prompts y correccion de errores 
- **Magaña Mojica Jesus Isamel** se especializo en la creacion de estilos, requerimientos y diagramas, funciones del programa asi como la redaccion de gran parte del README.md

**Materia:** Desarrollo de Aplicaciones Web  
**Profesor:** Zeus Cobian  

---

## Descripción

**NoCaduca** es una herramienta práctica y amigable que te ayuda a tener un control total sobre los artículos en tu refrigerador y alacena. A través de un sistema de alertas por colores, la aplicación te notifica qué productos están próximos a vencer, ayudándote a consumir de forma más inteligente y a ahorrar dinero.

---

## Tecnologías Utilizadas

- **React Native & Expo**: Framework principal para el desarrollo de la aplicación móvil (compatible con iOS, Android y Web).
- **React Navigation**: Manejo de rutas, pestañas inferiores (Bottom Tabs) y Stack Navigators para el flujo de bienvenida.
- **AsyncStorage**: Almacenamiento local persistente para guardar productos y configuraciones de usuario sin necesidad de base de datos externa.
- **React Native Picker & DateTimePicker**: Interfaces nativas para la selección de categorías y fechas precisas.

---

## Funcionalidades Principales

1. **Onboarding / Bienvenida**: Pantalla de introducción que resalta los beneficios de la app (Control de Despensa, Ahorro Inteligente y Recetas al Instante). Se muestra automáticamente solo la primera vez que se abre la app.
2. **Dashboard (Inicio)**: Panel de control inteligente que resume los productos con alerta urgente (5 días o menos para caducar) con etiquetas de advertencia.
3. **Agregar Productos**: Formulario intuitivo para añadir un nuevo elemento a la despensa usando un calendario funcional y menús desplegables.
4. **Mi Despensa**: Lista completa de tus alimentos registrados. Incluye un sistema visual tipo semáforo que evalúa fechas dinámicamente:
   - 🟢 **Verde**: Más de 7 días para caducar.
   - 🟠 **Naranja**: Entre 4 y 7 días para caducar.
   - 🔴 **Rojo**: 3 días o menos, o producto ya caducado.
5. **Eliminación de Artículos**: Función para borrar artículos rápidamente una vez que han sido consumidos o desechados, con alertas de confirmación.

---
## Prompts principales utilizados

1. "Quiero crear una aplicacion movil para gestionar una despensa"
2. "Quiero que la aplicacion sea compatible con iOS y Android"
3. "Quiero que la aplicacion sea compatible con Web"
4. "Quiero que la aplicacion sea compatible con Android y Web"
5. "Quiero que la aplicacion sea compatible con iOS y Web"
6. "Quiero que la aplicacion sea compatible con iOS y Android y Web"

---

## Instrucciones de Instalación y Ejecución

Asegúrate de tener instalado [Node.js](https://nodejs.org/) en tu equipo. Además, descarga la app [Expo Go](https://expo.dev/client) en tu teléfono móvil si deseas probar en tu propio dispositivo.

1. **Clonar el repositorio** (O descargar los archivos del proyecto):
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd proyecto-final-desarrolloweb
   ```

2. **Instalar dependencias**:
   Instala todos los paquetes requeridos por el proyecto.
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**:
   ```bash
   npx expo start --tunnel
   ```

4. **Probar la aplicación**:
   - **Dispositivo Físico (Recomendado)**: Escanea el código QR que aparece en tu terminal utilizando la app **Expo Go** (Android) o la cámara de tu teléfono (iOS).
   - **Navegador Web**: Presiona la tecla `w` en la terminal para abrir la versión web.
   - **Emulador**: Presiona `a` para Android o `i` para iOS (requiere configuración de Android Studio/Xcode previamente).

---

## Diagrama de Funcionamiento

A continuación se muestra el flujo básico de uso de la aplicación y su arquitectura de componentes y almacenamiento.

    A[Apertura de App] --> B{¿Es la primera vez?}
    
    B -- Sí --> C[Pantalla: WelcomeScreen]
    C -->|Usuario presiona 'Comenzar'| D[Guardar bandera en AsyncStorage]
    D --> E[Root Navigation: Dashboard]
    
    B -- No --> E[Pantalla: Inicio / Dashboard]
    
    E --> F{¿Hay productos en riesgo?}
    F -- Sí --> G[Mostrar lista de 'Urgente' en Naranja/Rojo]
    F -- No --> H[Mostrar mensaje '¡Tu despensa está al día!']
    
    E --> I[Pantalla: Agregar Producto]
    E --> J[Pantalla: Mi Despensa]
    
    I -->|Llenar y Validar Formulario| K[Crear objeto Producto]
    K --> L[(Almacenamiento Local: pantry_items)]
    
    J -->|Cargar lista al entrar| L
    L --> M[Cálculo de días restantes y color]
    M --> N[Renderizar FlatList con Tarjetas Visuales]
    
    N -->|Botón Eliminar| O[Filtrar arreglo sin el producto]
    O --> L

---

## Link del video explicativo

https://drive.google.com/file/d/15AP_71j9Libx-2dOBn83Uc6qK4japRQC/view?usp=sharing

---
## Conclusiones del equipo

**Magaña Mojica Jesus Ismael**: Me gusto mucho hacer este proyecto porque puede realizar una app de manera super sencilla y rápidamente, realmente la ia es muy útil para realizar apps de celular.
**Santiago Covarrubias Ivan Raul**: Quede maravillado con el potencial con el cual se puede crear una aplicacion desde 0 de manera sencilla, crear y usar y ejecutar todas las herramientas que necesitábamos para crear esta app, desde la creacion hasta la simulacion y ejecucion en un celular 

---
