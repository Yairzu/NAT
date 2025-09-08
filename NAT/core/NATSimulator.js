import { CONFIG, CONFIGURACION_POR_DEFECTO } from '../config.js';
import { logger } from '../utils/Logger.js';
import { Validator } from '../utils/Validator.js';
import { NetworkService } from '../services/NetworkService.js';
import { AnimationService } from '../services/AnimationService.js';
import { SVGService } from '../services/SVGService.js';
import { DataService } from '../services/DataService.js';

export class NATSimulator {
  constructor(configuracion = {}) {
    this.configuracion = { ...CONFIGURACION_POR_DEFECTO, ...configuracion };
    this.modoActual = this.configuracion.modo;
    this.estaEjecutando = false;
    this.simulacionActual = null;
    
    this.inicializarServicios();
    
    this.inicializarInterfaz();
    
    this.validarConfiguracion();
    
  }

  inicializarServicios() {
    try {
      const elementoSVG = document.querySelector(CONFIG.SELECTORES.SVG);
      if (!elementoSVG) {
        throw new Error('Elemento SVG no encontrado');
      }

      this.servicioRed = new NetworkService();
      this.servicioAnimacion = new AnimationService(elementoSVG);
      this.servicioSVG = new SVGService(elementoSVG);
      this.servicioDatos = new DataService();

    } catch (error) {
      logger.error('Error al inicializar servicios', error);
      throw error;
    }
  }

  inicializarInterfaz() {
    this.inicializarBotones();
    this.inicializarCambioModo();
    this.actualizarInterfaz();
    
    if (this.configuracion.inicioAutomatico) {
      this.iniciarSimulacion();
    }
  }

  inicializarBotones() {
    const btnSimular = document.querySelector(CONFIG.SELECTORES.BTN_SIMULAR);
    const btnLimpiar = document.querySelector(CONFIG.SELECTORES.BTN_LIMPIAR);

    if (btnSimular) {
      btnSimular.addEventListener('click', () => this.iniciarSimulacion());
    }

    if (btnLimpiar) {
      btnLimpiar.addEventListener('click', () => this.limpiarSimulacion());
    }

  }

  inicializarCambioModo() {
    const btnConNAT = document.querySelector(CONFIG.SELECTORES.BTN_NAT);
    const btnSinNAT = document.querySelector(CONFIG.SELECTORES.BTN_SIN_NAT);

    if (btnConNAT) {
      btnConNAT.addEventListener('click', () => this.establecerModo('nat'));
    }

    if (btnSinNAT) {
      btnSinNAT.addEventListener('click', () => this.establecerModo('no-nat'));
    }

  }

  validarConfiguracion() {
    if (!Validator.validarConfiguracion(CONFIG)) {
      throw new Error('Configuración de aplicación inválida');
    }

    if (!this.servicioRed.validarConfiguracionRed()) {
      throw new Error('Validación de configuración del servicio de red falló');
    }

  }

  establecerModo(modo) {
    if (!Validator.validarModo(modo)) {
      logger.error('Modo inválido especificado', { modo });
      return;
    }

    if (this.modoActual === modo) {
      return;
    }

    this.modoActual = modo;
    document.body.setAttribute('data-mode', modo);
    
    this.actualizarBotonesModo();
    this.actualizarInterfaz();
    
    
    this.iniciarSimulacion();
    
  }

  actualizarBotonesModo() {
    const btnConNAT = document.querySelector(CONFIG.SELECTORES.BTN_NAT);
    const btnSinNAT = document.querySelector(CONFIG.SELECTORES.BTN_SIN_NAT);

    if (btnConNAT && btnSinNAT) {
      const esModoNAT = this.modoActual === 'nat';
      
      btnConNAT.classList.toggle(CONFIG.CLASES.ACTIVO, esModoNAT);
      btnSinNAT.classList.toggle(CONFIG.CLASES.ACTIVO, !esModoNAT);
      
      btnConNAT.setAttribute('aria-selected', esModoNAT);
      btnSinNAT.setAttribute('aria-selected', !esModoNAT);
    }
  }

  async iniciarSimulacion() {
    if (this.estaEjecutando) {
      return;
    }

    try {
      this.estaEjecutando = true;
      this.limpiarSimulacion();
      
      const simulacion = this.crearSimulacion();
      this.simulacionActual = simulacion;
      
      await this.ejecutarSimulacion(simulacion);
      
    } catch (error) {
      logger.error('Simulación falló', error);
      this.manejarErrorSimulacion(error);
    } finally {
      this.estaEjecutando = false;
    }
  }

  crearSimulacion() {
    const esModoNAT = this.modoActual === 'nat';
    const dispositivos = this.servicioRed.seleccionarDispositivos(this.configuracion.cantidadDispositivos);
    const ipPublica = esModoNAT ? this.servicioRed.generarIPPublica() : null;
    
    const simulacion = {
      modo: this.modoActual,
      dispositivos: dispositivos,
      ipPublica: ipPublica,
      resultados: [],
      traduccionesNAT: []
    };

    dispositivos.forEach((dispositivo, indice) => {
      const resultado = this.servicioRed.generarResultadoDispositivo(
        dispositivo, indice, esModoNAT, ipPublica
      );
      simulacion.resultados.push(resultado);
      
      if (esModoNAT) {
        const traduccion = this.servicioRed.crearTraduccionNAT(
          resultado.privateIP,
          resultado.port,
          ipPublica,
          resultado.port
        );
        simulacion.traduccionesNAT.push(traduccion);
      }
    });


    return simulacion;
  }

  async ejecutarSimulacion(simulacion) {
    const { dispositivos, resultados, traduccionesNAT, ipPublica } = simulacion;
    const esModoNAT = this.modoActual === 'nat';
    
    this.servicioSVG.disenarSimetrico(dispositivos.length);
    this.servicioSVG.establecerIPsDispositivos(dispositivos.length);
    this.servicioSVG.actualizarInformacionRouter(esModoNAT, ipPublica);
    
    this.servicioDatos.actualizarPanel(
      this.modoActual,
      ipPublica,
      traduccionesNAT.length,
      dispositivos.length
    );
    
    this.servicioDatos.renderizarTablaNAT(traduccionesNAT);
    
    resultados.forEach(resultado => {
      this.servicioDatos.agregarResultadoDispositivo(resultado);
    });

    await this.ejecutarAnimaciones(resultados, esModoNAT, ipPublica);
  }

  async ejecutarAnimaciones(resultados, esModoNAT, ipPublica) {
    const retraso = CONFIG.ANIMACION.RETRASO.ESCALONADO_DISPOSITIVO;
    
    for (let i = 0; i < resultados.length; i++) {
      setTimeout(async () => {
        await this.animarDispositivo(i, resultados[i], esModoNAT, ipPublica);
      }, i * retraso);
    }
  }

  async animarDispositivo(indice, resultado, esModoNAT, ipPublica) {
    const ruta = this.servicioSVG.rutas[indice];
    const grupoDispositivo = this.servicioSVG.gruposDispositivos[indice];
    
    if (!ruta || !grupoDispositivo) {
      logger.error('Elementos SVG faltantes para animación', { indice });
      return;
    }

    this.servicioSVG.establecerEnlaceActivo(ruta, true);
    this.servicioAnimacion.pulsarNodo(grupoDispositivo);

    if (esModoNAT) {
      await this.animarFlujoNAT(ruta, indice, ipPublica);
    } else {
      await this.animarFlujoBloqueado(ruta);
    }
  }

  async animarFlujoNAT(ruta, indice, ipPublica) {
    const puerto = CONFIG.RED.PUERTO_BASE + indice + 1;
    
    await this.servicioAnimacion.animarPorRuta(
      ruta, 
      'url(#gradAccent)', 
      CONFIG.ANIMACION.DURACION.RAPIDA,
      () => {
        this.servicioAnimacion.pulsarNodo(this.servicioSVG.nodoRouter);
        this.servicioSVG.establecerEnlaceActivo(this.servicioSVG.enlaceRI, true);
        this.servicioAnimacion.mostrarInsigniaPuerto(`${ipPublica}:${puerto}`, this.servicioSVG.nodoRouter);
        
        this.servicioAnimacion.animarPorRuta(
          this.servicioSVG.enlaceRI,
          'var(--ok)',
          CONFIG.ANIMACION.DURACION.LENTA,
          () => {
            this.servicioAnimacion.crearEfectoOndulacion(this.servicioSVG.nodoInternet);
            
            this.servicioAnimacion.animarPorRuta(
              this.servicioSVG.enlaceRI,
              'var(--ok)',
              CONFIG.ANIMACION.DURACION.LENTA,
              () => {
                this.servicioAnimacion.pulsarNodo(this.servicioSVG.nodoRouter);
                this.servicioAnimacion.animarPorRuta(ruta, 'var(--ok)', CONFIG.ANIMACION.DURACION.RAPIDA);
              }
            );
          }
        );
      }
    );
  }

  async animarFlujoBloqueado(ruta) {
    await this.servicioAnimacion.animarPorRuta(
      ruta,
      'var(--bad)',
      CONFIG.ANIMACION.DURACION.RAPIDA,
      () => {
        this.servicioAnimacion.pulsarNodo(this.servicioSVG.nodoRouter);
        this.servicioAnimacion.crearExplosionBloqueo(this.servicioSVG.nodoRouter);
        
        setTimeout(() => {
          this.servicioAnimacion.animarPorRuta(ruta, 'var(--bad)', CONFIG.ANIMACION.DURACION.RAPIDA);
        }, CONFIG.ANIMACION.RETRASO.RETRASO_EXPLOSION);
      }
    );
  }

  limpiarSimulacion() {
    this.servicioDatos.limpiarTablas();
    this.servicioSVG.reiniciarEnlaces();
    this.servicioSVG.establecerIPsDispositivos(0);
    this.servicioAnimacion.detenerTodasAnimaciones();
    this.simulacionActual = null;
    
  }

  actualizarInterfaz() {
    this.actualizarBotonesModo();
    this.actualizarPanel();
  }

  actualizarPanel() {
    const esModoNAT = this.modoActual === 'nat';
    this.servicioDatos.actualizarPanel(
      this.modoActual,
      null,
      0,
      0
    );
    
    this.servicioSVG.actualizarInformacionRouter(esModoNAT, null);
  }

  manejarErrorSimulacion(error) {
    logger.error('Error de simulación ocurrido', error);
    
    this.estaEjecutando = false;
    this.simulacionActual = null;
    
    this.mostrarMensajeError('Error en la simulación. Por favor, inténtalo de nuevo.');
  }

  mostrarMensajeError(mensaje) {
    const divError = document.createElement('div');
    divError.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--bad);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      z-index: 1000;
      box-shadow: var(--shadow);
    `;
    divError.textContent = mensaje;
    
    document.body.appendChild(divError);
    
    setTimeout(() => {
      if (divError.parentNode) {
        divError.parentNode.removeChild(divError);
      }
    }, 5000);
  }


  destruir() {
    this.limpiarSimulacion();
    this.servicioAnimacion.detenerTodasAnimaciones();
    
    const btnSimular = document.querySelector(CONFIG.SELECTORES.BTN_SIMULAR);
    const btnLimpiar = document.querySelector(CONFIG.SELECTORES.BTN_LIMPIAR);
    const btnConNAT = document.querySelector(CONFIG.SELECTORES.BTN_NAT);
    const btnSinNAT = document.querySelector(CONFIG.SELECTORES.BTN_SIN_NAT);

    [btnSimular, btnLimpiar, btnConNAT, btnSinNAT].forEach(boton => {
      if (boton) {
        boton.replaceWith(boton.cloneNode(true));
      }
    });

  }
}
