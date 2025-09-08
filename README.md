# Simulador de NAT — Visual PRO

Un simulador interactivo y educativo de NAT (Network Address Translation) con arquitectura limpia y escalable.

## 🚀 Características

- **Visualización en tiempo real** de flujos de red
- **Animaciones fluidas** que muestran el proceso de NAT
- **Comparación directa** entre modo con NAT y sin NAT
- **Interfaz moderna** con tema oscuro y diseño responsivo
- **Arquitectura modular** y escalable
- **Accesibilidad completa** con soporte para lectores de pantalla
- **Manejo robusto de errores** y validaciones

## 🏗️ Arquitectura

El proyecto utiliza una arquitectura limpia con separación de responsabilidades:

```
├── index.html              # Punto de entrada HTML
├── styles.css              # Estilos CSS organizados
├── main.js                 # Punto de entrada de la aplicación
├── config.js               # Configuración centralizada
├── core/
│   └── NATSimulator.js     # Clase principal del simulador
├── services/
│   ├── NetworkService.js   # Lógica de red y generación de datos
│   ├── AnimationService.js # Gestión de animaciones SVG
│   ├── SVGService.js       # Manipulación de elementos SVG
│   └── DataService.js      # Gestión de datos y tablas
└── utils/
    ├── Logger.js           # Sistema de logging
    └── Validator.js        # Validaciones y verificaciones
```

## 🛠️ Tecnologías

- **HTML5** con semántica accesible
- **CSS3** con variables personalizadas y animaciones
- **JavaScript ES6+** con módulos
- **SVG** para visualizaciones vectoriales
- **Arquitectura orientada a servicios**

## 📦 Instalación

1. Clona o descarga el proyecto
2. Abre `index.html` en un navegador moderno
3. ¡Disfruta del simulador!

## 🎮 Uso

1. **Selecciona el modo**: Con NAT o Sin NAT
2. **Ejecuta la simulación**: Haz clic en "▶ Ejecutar simulación"
3. **Observa las animaciones**: Los flujos de datos se muestran visualmente
4. **Revisa los resultados**: Consulta las tablas de información

## 🔧 Configuración

El archivo `config.js` contiene toda la configuración centralizada:

- **Dispositivos disponibles**: Lista de dispositivos para simular
- **Configuración de red**: Rangos de IP, puertos, etc.
- **Parámetros de animación**: Duraciones, delays, efectos
- **Mensajes de UI**: Textos y mensajes de la interfaz
- **Selectores DOM**: Referencias a elementos HTML

## 🎨 Personalización

### Agregar nuevos dispositivos

Edita el array `DEVICES` en `config.js`:

```javascript
{
  id: 'nuevo-dispositivo',
  name: 'Nuevo Dispositivo',
  icon: '🔧',
  request: 'Nueva solicitud'
}
```

### Modificar animaciones

Ajusta los parámetros en `CONFIG.ANIMATION`:

```javascript
ANIMATION: {
  DURATION: {
    FAST: 1.0,    // Duración rápida
    NORMAL: 1.3,  // Duración normal
    SLOW: 1.05    // Duración lenta
  }
}
```

### Cambiar colores

Modifica las variables CSS en `styles.css`:

```css
:root {
  --accent: #22d3ee;      /* Color principal */
  --accent-2: #60a5fa;    /* Color secundario */
  --ok: #28d07f;          /* Color de éxito */
  --bad: #ff5577;         /* Color de error */
}
```

## 🧪 Desarrollo

### Estructura de servicios

Cada servicio tiene responsabilidades específicas:

- **NetworkService**: Genera IPs, puertos, selecciona dispositivos
- **AnimationService**: Maneja todas las animaciones SVG
- **SVGService**: Posiciona elementos y actualiza layout
- **DataService**: Gestiona tablas y datos de la UI

### Agregar nuevas funcionalidades

1. **Crea un nuevo servicio** en la carpeta `services/`
2. **Importa y usa** en `NATSimulator.js`
3. **Actualiza la configuración** en `config.js` si es necesario
4. **Agrega tests** y documentación

### Logging y debugging

El sistema incluye logging estructurado:

```javascript
import { logger } from './utils/Logger.js';

logger.info('Mensaje informativo');
logger.error('Error ocurrido', { datos: 'adicionales' });
logger.debug('Información de debug');
```

## 🎯 Principios de diseño

- **Separación de responsabilidades**: Cada clase tiene una función específica
- **Inyección de dependencias**: Los servicios se pasan como parámetros
- **Configuración centralizada**: Todo configurable en un solo lugar
- **Manejo de errores**: Validaciones y recuperación graceful
- **Accesibilidad**: Soporte completo para tecnologías asistivas
- **Performance**: Optimizaciones para animaciones fluidas

## 🔍 Debugging

Para debugging en desarrollo:

```javascript
// Acceso global a la aplicación
window.natSimulatorApp.getState();

// Logging detallado
logger.setLevel('debug');
```

## 📱 Responsive Design

El simulador se adapta a diferentes tamaños de pantalla:

- **Desktop**: Layout de dos columnas
- **Tablet**: Layout de una columna
- **Mobile**: Optimizado para pantallas pequeñas

## ♿ Accesibilidad

- **ARIA labels** en todos los elementos interactivos
- **Navegación por teclado** completa
- **Lectores de pantalla** compatibles
- **Alto contraste** y colores accesibles
- **Reducción de movimiento** respetada

## 🚀 Performance

- **Animaciones optimizadas** con requestAnimationFrame
- **Limpieza automática** de elementos temporales
- **Lazy loading** de recursos pesados
- **Debouncing** en eventos frecuentes

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Para soporte o preguntas, por favor abre un issue en el repositorio.
