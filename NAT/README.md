# Simulador de NAT (Network Address Translation)

## Descripción

Simulador de Network Address Translation (NAT). Esta aplicación permite visualizar y comprender el funcionamiento del protocolo NAT en redes de computadoras, mostrando el flujo de datos entre dispositivos privados y la red pública a través de un router NAT.


## Estructura del Proyecto

```
NAT/
├── index.html              # Punto de entrada de la aplicación
├── styles.css              # Estilos y tema de la aplicación
├── main.js                 # Inicialización y configuración global
├── config.js               # Configuración centralizada
├── core/
│   └── NATSimulator.js     # Lógica principal del simulador
├── services/
│   ├── NetworkService.js   # Servicios de red y generación de datos
│   ├── AnimationService.js # Gestión de animaciones SVG
│   ├── SVGService.js       # Manipulación de elementos SVG
│   └── DataService.js      # Gestión de datos y tablas
└── utils/
    ├── Logger.js           # Sistema de logging
    └── Validator.js        # Validación de datos
```


## 🎮 **Cómo Funciona**

### **Modo NAT**
- Los dispositivos privados envían solicitudes
- El router NAT traduce las IPs privadas a públicas
- Se asignan puertos únicos para cada dispositivo
- La comunicación con Internet es exitosa

### **Modo Sin NAT**
- Los dispositivos privados intentan conectarse
- El router bloquea las direcciones RFC1918
- Se muestra el error de "dirección no ruteable"
- La comunicación falla


## 🔧 **Personalización**

El simulador se puede configurar desde `config.js`:

- **Parámetros de Red**: Rangos de IP, puertos, cantidad de dispositivos
- **Configuración Visual**: Colores, tamaños, animaciones
- **Mensajes**: Textos y etiquetas personalizables
- **Comportamiento**: Tiempos de animación y efectos

## 📈 **Arquitectura Técnica**

- **NetworkService**: Lógica de red y generación de datos
- **AnimationService**: Gestión de animaciones SVG
- **SVGService**: Manipulación de elementos gráficos
- **DataService**: Gestión de datos y tablas
