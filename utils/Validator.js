import { REGLAS_VALIDACION, CONFIG } from '../config.js';
import { logger } from './Logger.js';

export class Validator {
  static validarModo(modo) {
    const esValido = REGLAS_VALIDACION.MODOS.includes(modo);
    if (!esValido) {
      logger.error(CONFIG.ERRORES.MODO_INVALIDO, { modo });
    }
    return esValido;
  }

  static validarCantidadDispositivos(cantidad) {
    const esValido = cantidad >= REGLAS_VALIDACION.MIN_CANTIDAD_DISPOSITIVOS && 
                   cantidad <= REGLAS_VALIDACION.MAX_CANTIDAD_DISPOSITIVOS;
    if (!esValido) {
      logger.error('Cantidad de dispositivos inválida', { cantidad, min: REGLAS_VALIDACION.MIN_CANTIDAD_DISPOSITIVOS, max: REGLAS_VALIDACION.MAX_CANTIDAD_DISPOSITIVOS });
    }
    return esValido;
  }

  static validarPuerto(puerto) {
    const esValido = puerto >= REGLAS_VALIDACION.MIN_PUERTO && 
                   puerto <= REGLAS_VALIDACION.MAX_PUERTO;
    if (!esValido) {
      logger.error('Número de puerto inválido', { puerto, min: REGLAS_VALIDACION.MIN_PUERTO, max: REGLAS_VALIDACION.MAX_PUERTO });
    }
    return esValido;
  }

  static validarIP(ip) {
    const regexIP = /^(\d{1,3}\.){3}\d{1,3}$/;
    const esValido = regexIP.test(ip);
    if (!esValido) {
      logger.error('Formato de dirección IP inválido', { ip });
    }
    return esValido;
  }

  static validarElemento(elemento, selector) {
    const esValido = elemento !== null && elemento !== undefined;
    if (!esValido) {
      logger.error('Elemento DOM requerido no encontrado', { selector });
    }
    return esValido;
  }

  static validarConfiguracion(configuracion) {
    if (!configuracion || typeof configuracion !== 'object') {
      logger.error(CONFIG.ERRORES.CONFIGURACION_INVALIDA, { configuracion });
      return false;
    }

    return true;
  }

  static validarDispositivo(dispositivo) {
    if (!dispositivo || typeof dispositivo !== 'object') {
      logger.error('Objeto de dispositivo inválido', { dispositivo });
      return false;
    }

    const camposRequeridos = ['id', 'name', 'request'];
    const tieneCamposRequeridos = camposRequeridos.every(campo => 
      dispositivo.hasOwnProperty(campo) && dispositivo[campo]
    );

    if (!tieneCamposRequeridos) {
      logger.error('Dispositivo faltan campos requeridos', { dispositivo, camposRequeridos });
      return false;
    }

    return true;
  }
}
