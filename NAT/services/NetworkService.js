import { CONFIG } from '../config.js';
import { logger } from '../utils/Logger.js';
import { Validator } from '../utils/Validator.js';

export class NetworkService {
  constructor() {
    this.dispositivos = CONFIG.DISPOSITIVOS;
  }

  generarIPPublica() {
    const numeroAleatorio = Math.floor(
      Math.random() * (CONFIG.RED.IP_PUBLICA_MAX - CONFIG.RED.IP_PUBLICA_MIN + 1)
    ) + CONFIG.RED.IP_PUBLICA_MIN;
    
    const ip = `${CONFIG.RED.RANGO_IP_PUBLICA}${numeroAleatorio}`;
    return ip;
  }

  generarIPPrivada(indice) {
    const ip = `${CONFIG.RED.RANGO_IP_PRIVADA}${CONFIG.RED.INICIO_IP_PRIVADA + indice}`;
    return ip;
  }

  generarPuerto(indice) {
    const puerto = CONFIG.RED.PUERTO_BASE + (indice + 1);
    if (!Validator.validarPuerto(puerto)) {
      throw new Error(`Puerto inválido generado: ${puerto}`);
    }
    return puerto;
  }

  seleccionarDispositivos(cantidad = null) {
    const cantidadDispositivos = cantidad || this.obtenerCantidadDispositivosAleatoria();
    
    if (!Validator.validarCantidadDispositivos(cantidadDispositivos)) {
      throw new Error(`Cantidad de dispositivos inválida: ${cantidadDispositivos}`);
    }

    const mezclados = [...this.dispositivos].sort(() => 0.5 - Math.random());
    const seleccionados = mezclados.slice(0, cantidadDispositivos);
    
    
    return seleccionados;
  }

  obtenerCantidadDispositivosAleatoria() {
    const minimo = CONFIG.RED.MIN_DISPOSITIVOS;
    const maximo = CONFIG.RED.MAX_DISPOSITIVOS;
    return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
  }

  crearTraduccionNAT(ipPrivada, puertoPrivado, ipPublica, puertoPublico) {
    if (!Validator.validarIP(ipPrivada) || !Validator.validarIP(ipPublica)) {
      throw new Error('Direcciones IP inválidas para traducción NAT');
    }

    if (!Validator.validarPuerto(puertoPrivado) || !Validator.validarPuerto(puertoPublico)) {
      throw new Error('Números de puerto inválidos para traducción NAT');
    }

    const traduccion = {
      privada: ipPrivada,
      puertoPriv: puertoPrivado,
      publica: ipPublica,
      puertoPub: puertoPublico
    };

    return traduccion;
  }

  generarResultadoDispositivo(dispositivo, indice, conNAT, ipPublica = null) {
    if (!Validator.validarDispositivo(dispositivo)) {
      throw new Error('Objeto de dispositivo inválido');
    }

    const ipPrivada = this.generarIPPrivada(indice);
    const puerto = this.generarPuerto(indice);
    
    const resultado = {
      device: dispositivo,
      privateIP: ipPrivada,
      request: dispositivo.request,
      publicIP: conNAT ? ipPublica : null,
      port: conNAT ? puerto : null,
      success: conNAT,
      response: this.generarRespuesta(dispositivo, ipPrivada, conNAT)
    };

    return resultado;
  }

  generarRespuesta(dispositivo, ipPrivada, conNAT) {
    if (conNAT) {
      return CONFIG.MENSAJES.NAT.EXITO
        .replace('{request}', dispositivo.request)
        .replace('{device}', dispositivo.name)
        .replace('{ip}', ipPrivada);
    } else {
      return CONFIG.MENSAJES.SIN_NAT.ERROR
        .replace('{ip}', ipPrivada);
    }
  }

  validarConfiguracionRed() {
    try {
      const ipPrueba = this.generarIPPublica();
      if (!Validator.validarIP(ipPrueba)) {
        return false;
      }

      const dispositivosPrueba = this.seleccionarDispositivos(2);
      if (!Array.isArray(dispositivosPrueba) || dispositivosPrueba.length === 0) {
        return false;
      }

      const traduccionPrueba = this.crearTraduccionNAT(
        '192.168.1.10', 5001, '181.50.23.1', 5001
      );
      if (!traduccionPrueba) {
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Validación de configuración de red falló', error);
      return false;
    }
  }
}
