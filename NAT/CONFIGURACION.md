# Guía de Configuración del Simulador NAT

## 📋 **Configuraciones Disponibles**

### **1. Cantidad de Dispositivos**
```javascript
// En config.js - RED
MAX_DISPOSITIVOS: 7,    // Máximo de dispositivos (1-7)
MIN_DISPOSITIVOS: 1,    // Mínimo de dispositivos (1-7)
```

**Uso para pruebas:**
- **1 dispositivo**: Prueba básica de NAT
- **3-4 dispositivos**: Configuración estándar
- **5-7 dispositivos**: Prueba de carga y múltiples traducciones

### **2. Rangos de IP**
```javascript
// IPs Privadas (RFC1918)
RANGO_IP_PRIVADA: '192.168.1.',
INICIO_IP_PRIVADA: 10,  // IPs: 192.168.1.10, 192.168.1.11, etc.

// IPs Públicas
RANGO_IP_PUBLICA: '181.50.23.',
IP_PUBLICA_MIN: 1,      // IPs: 181.50.23.1, 181.50.23.2, etc.
IP_PUBLICA_MAX: 100,
```

**Personalización:**
- Cambiar `RANGO_IP_PRIVADA` para usar diferentes subredes
- Modificar `IP_PUBLICA_MIN/MAX` para diferentes rangos públicos

### **3. Puertos**
```javascript
PUERTO_BASE: 5000,      // Puertos: 5001, 5002, 5003, etc.
```

**Ejemplos de puertos generados:**
- Dispositivo 1: Puerto 5001
- Dispositivo 2: Puerto 5002
- Dispositivo 3: Puerto 5003

### **4. Animaciones**
```javascript
DURACION: {
  RAPIDA: 1.0,          // Animaciones rápidas
  NORMAL: 1.3,          // Animaciones normales
  LENTA: 1.05           // Animaciones lentas
},
RETRASO: {
  ESCALONADO_DISPOSITIVO: 360,  // ms entre dispositivos
  ESCALONADO_PARTICULA: 80,     // ms entre partículas
  RETRASO_EXPLOSION: 160        // ms para efectos de bloqueo
}
```

### **5. Dispositivos Personalizados**
```javascript
DISPOSITIVOS: [
  { 
    id: 'laptop',
    name: 'Laptop Oficina', 
    icon: '💻',
    request: 'Conectar a Teams' 
  },
  
]
```

**Agregar nuevos dispositivos:**
1. Añadir objeto al array `DISPOSITIVOS`
2. Actualizar `MAX_DISPOSITIVOS` si es necesario
3. Agregar elementos SVG correspondientes en `index.html`

### **Modificar Tiempos de Animación**
```javascript
// Para animaciones más rápidas
DURACION: {
  RAPIDA: 0.5,
  NORMAL: 0.8,
  LENTA: 0.6
}

// Para animaciones más lentas
DURACION: {
  RAPIDA: 2.0,
  NORMAL: 2.5,
  LENTA: 2.2
}
```

### **Cambiar Rango de Puertos**
```javascript
// Para puertos más altos
PUERTO_BASE: 8000,  // Genera: 8001, 8002, 8003...

// Para puertos más bajos
PUERTO_BASE: 1000,  // Genera: 1001, 1002, 1003...
```

## 📝 **Notas Importantes**

1. **Sincronización**: Los cambios en `config.js` requieren recarga de la página
2. **Límites**: No exceder 7 dispositivos sin actualizar el HTML
3. **IPs**: Usar rangos válidos según RFC1918 para IPs privadas
4. **Puertos**: Evitar puertos reservados del sistema (0-1023)
5. **Animaciones**: Tiempos muy bajos pueden causar problemas de rendimiento

