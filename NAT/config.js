export const CONFIG = {
  APLICACION: {
    NOMBRE: 'Simulador de NAT — PRO',
    VERSION: '2.0.0',
    DESCRIPCION: 'Conexión a Internet perfecta'
  },

  RED: {
    RANGO_IP_PRIVADA: '192.168.1.',
    INICIO_IP_PRIVADA: 10,
    RANGO_IP_PUBLICA: '181.50.23.',
    IP_PUBLICA_MIN: 1,
    IP_PUBLICA_MAX: 100,
    PUERTO_BASE: 5000,
    MAX_DISPOSITIVOS: 7,
    MIN_DISPOSITIVOS: 1
  },

  ANIMACION: {
    DURACION: {
      RAPIDA: 1.0,
      NORMAL: 1.3,
      LENTA: 1.05
    },
    RETRASO: {
      ESCALONADO_DISPOSITIVO: 360,
      ESCALONADO_PARTICULA: 80,
      RETRASO_EXPLOSION: 160
    },
    PARTICULAS: {
      CANTIDAD: 3,
      TAMANOS: [6, 5, 4],
      OPACIDADES: [1, 0.7, 0.45],
      RETRASOS: [0, 0.08, 0.16]
    }
  },

  SVG: {
    CAJA_VISTA: '0 0 1300 600',
    DISPOSITIVO: {
      ANCHO: 180,
      ALTO: 65,
      X_IZQUIERDA: 50,
      Y_SUPERIOR: 80,
      Y_INFERIOR: 560
    },
    ROUTER: {
      ANCHO: 120,
      ALTO: 120,
      X: 600,
      Y: 300
    },
    INTERNET: {
      RADIO_X: 100,
      RADIO_Y: 60,
      X: 950,
      Y: 300
    }
  },

  DISPOSITIVOS: [
    { 
      id: 'laptop',
      name: 'Laptop Oficina', 
      icon: '💻',
      request: 'Conectar a Teams' 
    },
    { 
      id: 'desktop',
      name: 'PC Escritorio', 
      icon: '🖥️',
      request: 'Abrir Google' 
    },
    { 
      id: 'smartphone',
      name: 'Smartphone', 
      icon: '📱',
      request: 'Entrar a WhatsApp Web' 
    },
    { 
      id: 'tablet',
      name: 'Tablet', 
      icon: '📱',
      request: 'Revisar correo Gmail' 
    },
    { 
      id: 'printer',
      name: 'Impresora WiFi', 
      icon: '🖨️',
      request: 'Enviar reporte a servidor' 
    },
    { 
      id: 'smarttv',
      name: 'Smart TV', 
      icon: '📺',
      request: 'Ver Netflix' 
    },
    { 
      id: 'server',
      name: 'Servidor Local', 
      icon: '🖥️',
      request: 'Subir archivos al Drive' 
    }
  ],

  MENSAJES: {
    NAT: {
      PISTA: 'En NAT, múltiples IP privadas comparten una IP pública usando puertos diferentes (PAT).',
      EXITO: 'Respuesta desde Internet para {request} → entregada a {device} ({ip})'
    },
    SIN_NAT: {
      PISTA: 'Sin NAT, las IP privadas (RFC1918) no atraviesan a Internet: el router las bloquea.',
      ERROR: 'Bloqueado: dirección privada {ip} no ruteable en Internet (RFC1918)'
    },
    MARCADORES: {
      SIN_DATOS: 'Sin datos aún',
      MARCADOR_IP: '–'
    }
  },

  CLASES: {
    ACTIVO: 'active',
    OCULTO: 'hidden',
    PULSO: 'pulse',
    ESTADO_OK: 'status-ok',
    ESTADO_MALO: 'status-bad'
  },

  SELECTORES: {
    BTN_NAT: '#btnNat',
    BTN_SIN_NAT: '#btnNoNat',
    BTN_SIMULAR: '#btnSim',
    BTN_LIMPIAR: '#btnClear',
    
    KV_MODO: '#kvModo',
    KV_PUBLICA: '#kvPub',
    KV_PARES: '#kvPairs',
    KV_DISPOSITIVOS: '#kvDevs',
    KV_PISTA: '#kvHint',
    
    ROUTER_NAT: '#routerNat',
    ROUTER_PUBLICA: '#routerPub',
    INSIGNIA_MODO: '#modeBadge',
    
    TABLA_PRINCIPAL: '#tabla tbody',
    TABLA_NAT: '#natTable tbody',
    
    SVG: 'svg',
    RUTAS: ['#p1', '#p2', '#p3', '#p4', '#p5', '#p6', '#p7'],
    ENLACE_RI: '#pr',
    GRUPOS_DISPOSITIVOS: ['#dev1', '#dev2', '#dev3', '#dev4', '#dev5', '#dev6', '#dev7'],
    IPS_DISPOSITIVOS: ['#dev1Ip', '#dev2Ip', '#dev3Ip', '#dev4Ip', '#dev5Ip', '#dev6Ip', '#dev7Ip'],
    NODO_ROUTER: '#router',
    NODO_INTERNET: '#internet'
  },

  ERRORES: {
    MODO_INVALIDO: 'Modo inválido especificado',
    DISPOSITIVO_NO_ENCONTRADO: 'Dispositivo no encontrado',
    ELEMENTO_SVG_FALTANTE: 'Elemento SVG requerido no encontrado',
    ANIMACION_FALLO: 'Error en animación',
    CONFIGURACION_INVALIDA: 'Configuración inválida'
  }
};

export const CONFIGURACION_POR_DEFECTO = {
  modo: 'nat',
  inicioAutomatico: true,
  mostrarAnimaciones: true,
  cantidadDispositivos: null,
  dispositivosPersonalizados: [],
  tema: 'dark'
};

export const REGLAS_VALIDACION = {
  MODOS: ['nat', 'no-nat'],
  MIN_CANTIDAD_DISPOSITIVOS: 1,
  MAX_CANTIDAD_DISPOSITIVOS: 7,
  MIN_PUERTO: 1024,
  MAX_PUERTO: 65535
};
