import { CONFIG } from '../config.js';
import { logger } from '../utils/Logger.js';
import { Validator } from '../utils/Validator.js';

export class DataService {
  constructor() {
    this.cuerpoTablaPrincipal = document.querySelector(CONFIG.SELECTORES.TABLA_PRINCIPAL);
    this.cuerpoTablaNAT = document.querySelector(CONFIG.SELECTORES.TABLA_NAT);
    this.elementosPanel = this.inicializarElementosPanel();
    
    this.validarElementos();
  }

  inicializarElementosPanel() {
    return {
      modo: document.querySelector(CONFIG.SELECTORES.KV_MODO),
      ipPublica: document.querySelector(CONFIG.SELECTORES.KV_PUBLICA),
      pares: document.querySelector(CONFIG.SELECTORES.KV_PARES),
      dispositivos: document.querySelector(CONFIG.SELECTORES.KV_DISPOSITIVOS),
      pista: document.querySelector(CONFIG.SELECTORES.KV_PISTA),
      insigniaModo: document.querySelector(CONFIG.SELECTORES.INSIGNIA_MODO)
    };
  }

  validarElementos() {
    const elementosRequeridos = [
      { elemento: this.cuerpoTablaPrincipal, nombre: 'cuerpo de tabla principal' },
      { elemento: this.cuerpoTablaNAT, nombre: 'cuerpo de tabla NAT' },
      { elemento: this.elementosPanel.modo, nombre: 'elemento de panel de modo' },
      { elemento: this.elementosPanel.ipPublica, nombre: 'elemento de panel de IP pública' },
      { elemento: this.elementosPanel.pares, nombre: 'elemento de panel de pares' },
      { elemento: this.elementosPanel.dispositivos, nombre: 'elemento de panel de dispositivos' },
      { elemento: this.elementosPanel.pista, nombre: 'elemento de panel de pista' },
      { elemento: this.elementosPanel.insigniaModo, nombre: 'elemento de insignia de modo' }
    ];

    elementosRequeridos.forEach(({ elemento, nombre }) => {
      if (!Validator.validarElemento(elemento, nombre)) {
        throw new Error(`Elemento DOM requerido no encontrado: ${nombre}`);
      }
    });

  }

  actualizarPanel(modo, ipPublica, pares, dispositivos) {
    if (!Validator.validarModo(modo)) {
      logger.error('Modo inválido para actualización de panel', { modo });
      return;
    }

    const esModoNAT = modo === 'nat';
    
    this.elementosPanel.modo.textContent = esModoNAT ? 'Con NAT' : 'Sin NAT';
    this.elementosPanel.ipPublica.textContent = ipPublica || '–';
    this.elementosPanel.pares.textContent = pares;
    this.elementosPanel.dispositivos.textContent = dispositivos;
    
    this.elementosPanel.pista.textContent = esModoNAT 
      ? CONFIG.MENSAJES.NAT.PISTA 
      : CONFIG.MENSAJES.SIN_NAT.PISTA;
    
    this.elementosPanel.insigniaModo.textContent = esModoNAT ? 'Con NAT' : 'Sin NAT';

  }

  renderizarTablaNAT(traducciones) {
    if (!Array.isArray(traducciones)) {
      logger.error('Array de traducciones inválido', { traducciones });
      return;
    }

    if (traducciones.length === 0) {
      this.cuerpoTablaNAT.innerHTML = `
        <tr>
          <td colspan="3" style="color: var(--muted); padding: 12px">
            Sin datos aún
          </td>
        </tr>
      `;
    } else {
      this.cuerpoTablaNAT.innerHTML = traducciones.map(traduccion => `
        <tr>
          <td>${traduccion.privada}:${traduccion.puertoPriv}</td>
          <td>→</td>
          <td>${traduccion.publica}:${traduccion.puertoPub}</td>
        </tr>
      `).join('');
    }

  }

  agregarResultadoDispositivo(resultado) {
    if (!this.validarResultadoDispositivo(resultado)) {
      logger.error('Resultado de dispositivo inválido', { resultado });
      return;
    }

    const fila = this.crearFilaTabla(resultado);
    this.cuerpoTablaPrincipal.appendChild(fila);

  }

  crearFilaTabla(resultado) {
    const fila = document.createElement('tr');
    const claseEstado = resultado.success ? 'status-ok' : 'status-bad';
    
    fila.innerHTML = `
      <td>${resultado.device.name}</td>
      <td>${resultado.privateIP}</td>
      <td>${resultado.request}</td>
      <td>${resultado.publicIP || '–'}</td>
      <td>${resultado.port || '–'}</td>
      <td class="${claseEstado}">${resultado.response}</td>
    `;
    
    return fila;
  }

  validarResultadoDispositivo(resultado) {
    if (!resultado || typeof resultado !== 'object') {
      return false;
    }

    const camposRequeridos = ['device', 'privateIP', 'request', 'success', 'response'];
    return camposRequeridos.every(campo => resultado.hasOwnProperty(campo));
  }

  limpiarTablas() {
    this.cuerpoTablaPrincipal.innerHTML = '';
    this.renderizarTablaNAT([]);
  }

  limpiarTablaPrincipal() {
    this.cuerpoTablaPrincipal.innerHTML = '';
  }

  limpiarTablaNAT() {
    this.renderizarTablaNAT([]);
  }

  obtenerDatosTabla() {
    const filasTablaPrincipal = Array.from(this.cuerpoTablaPrincipal.querySelectorAll('tr'));
    const filasTablaNAT = Array.from(this.cuerpoTablaNAT.querySelectorAll('tr'));
    
    return {
      tablaPrincipal: {
        cantidadFilas: filasTablaPrincipal.length,
        filas: filasTablaPrincipal.map(fila => ({
          dispositivo: fila.cells[0]?.textContent || '',
          ipPrivada: fila.cells[1]?.textContent || '',
          solicitud: fila.cells[2]?.textContent || '',
          ipPublica: fila.cells[3]?.textContent || '',
          puerto: fila.cells[4]?.textContent || '',
          respuesta: fila.cells[5]?.textContent || '',
          exito: fila.cells[5]?.classList.contains('status-ok') || false
        }))
      },
      tablaNAT: {
        cantidadFilas: filasTablaNAT.length,
        filas: filasTablaNAT.map(fila => ({
          privada: fila.cells[0]?.textContent || '',
          publica: fila.cells[2]?.textContent || ''
        }))
      }
    };
  }

  exportarDatosTabla() {
    const datos = this.obtenerDatosTabla();
    return JSON.stringify(datos, null, 2);
  }

  actualizarEstadisticas(estadisticas) {
    if (!estadisticas || typeof estadisticas !== 'object') {
      logger.error('Objeto de estadísticas inválido', { estadisticas });
      return;
    }

  }

  resaltarFila(fila, duracion = 2000) {
    if (!fila) return;

    fila.style.backgroundColor = 'rgba(34, 211, 238, 0.1)';
    fila.style.transition = 'background-color 0.3s ease';
    
    setTimeout(() => {
      fila.style.backgroundColor = '';
    }, duracion);

  }

  desplazarHaciaAbajo() {
    const contenedorTabla = this.cuerpoTablaPrincipal.closest('.table-wrap');
    if (contenedorTabla) {
      contenedorTabla.scrollTop = contenedorTabla.scrollHeight;
    }
  }
}
