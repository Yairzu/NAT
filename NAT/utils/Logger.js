export class Logger {
  error(mensaje, datos = null) {
    console.error(`[ERROR] ${mensaje}`, datos || '');
  }

  warn(mensaje, datos = null) {
    console.warn(`[WARN] ${mensaje}`, datos || '');
  }
}

export const logger = new Logger();