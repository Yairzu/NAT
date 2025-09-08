import { NATSimulator } from './core/NATSimulator.js';
import { logger } from './utils/Logger.js';
import { CONFIG } from './config.js';

class AplicacionSimuladorNAT {
  constructor() {
    this.simulador = null;
    this.estaInicializado = false;
  }

  async inicializar() {
    try {
      
      if (document.readyState === 'loading') {
        await new Promise(resolver => {
          document.addEventListener('DOMContentLoaded', resolver);
        });
      }

      this.simulador = new NATSimulator();
      this.estaInicializado = true;
      
      this.configurarManejoErrores();
      
      
      
    } catch (error) {
      logger.error('Error al inicializar aplicación', error);
      this.manejarErrorInicializacion(error);
    }
  }

  configurarManejoErrores() {
    window.addEventListener('unhandledrejection', (evento) => {
      logger.error('Promesa rechazada no manejada', evento.reason);
      evento.preventDefault();
    });

    window.addEventListener('error', (evento) => {
      logger.error('Error global de JavaScript', {
        mensaje: evento.message,
        nombreArchivo: evento.filename,
        numeroLinea: evento.lineno,
        numeroColumna: evento.colno,
        error: evento.error
      });
    });

  }


  manejarErrorInicializacion(error) {
    const contenedorError = document.createElement('div');
    contenedorError.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--bad);
      color: white;
      padding: 24px;
      border-radius: 12px;
      text-align: center;
      z-index: 10000;
      box-shadow: var(--shadow);
      max-width: 400px;
    `;
    
    contenedorError.innerHTML = `
      <h3 style="margin: 0 0 12px 0; font-size: 18px;">Error de Inicialización</h3>
      <p style="margin: 0 0 16px 0;">No se pudo cargar la aplicación. Por favor, recarga la página.</p>
      <button onclick="window.location.reload()" style="
        background: white;
        color: var(--bad);
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
      ">Recargar Página</button>
    `;
    
    document.body.appendChild(contenedorError);
  }


  destruir() {
    if (this.simulador) {
      this.simulador.destruir();
      this.simulador = null;
    }
    
    this.estaInicializado = false;
  }
}

const aplicacion = new AplicacionSimuladorNAT();

aplicacion.inicializar().catch(error => {
  console.error('Error crítico de aplicación:', error);
});

if (CONFIG.APLICACION.VERSION.includes('dev') || window.location.hostname === 'localhost') {
  window.aplicacionSimuladorNAT = aplicacion;
}

window.addEventListener('beforeunload', () => {
  aplicacion.destruir();
});

export { aplicacion, AplicacionSimuladorNAT };
