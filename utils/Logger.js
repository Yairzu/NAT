export class Logger {
  constructor(nivel = 'info') {
    this.nivel = nivel;
    this.niveles = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
  }

  _deberiaRegistrar(nivel) {
    return this.niveles[nivel] <= this.niveles[this.nivel];
  }

  _formatearMensaje(nivel, mensaje, datos = null) {
    const marcaTiempo = new Date().toISOString();
    const prefijo = `[${marcaTiempo}] [${nivel.toUpperCase()}]`;
    
    if (datos) {
      return `${prefijo} ${mensaje}`, datos;
    }
    return `${prefijo} ${mensaje}`;
  }

  error(mensaje, datos = null) {
    if (this._deberiaRegistrar('error')) {
      console.error(this._formatearMensaje('error', mensaje), datos || '');
    }
  }

  warn(mensaje, datos = null) {
    if (this._deberiaRegistrar('warn')) {
      console.warn(this._formatearMensaje('warn', mensaje), datos || '');
    }
  }

  info(mensaje, datos = null) {
    if (this._deberiaRegistrar('info')) {
      console.info(this._formatearMensaje('info', mensaje), datos || '');
    }
  }

  debug(mensaje, datos = null) {
    if (this._deberiaRegistrar('debug')) {
      console.debug(this._formatearMensaje('debug', mensaje), datos || '');
    }
  }

  establecerNivel(nivel) {
    if (this.niveles.hasOwnProperty(nivel)) {
      this.nivel = nivel;
    } else {
      this.warn(`Nivel de registro inválido: ${nivel}`);
    }
  }
}

export const logger = new Logger('info');
