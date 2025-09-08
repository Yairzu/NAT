import { CONFIG } from '../config.js';
import { logger } from '../utils/Logger.js';
import { Validator } from '../utils/Validator.js';

export class AnimationService {
  constructor(elementoSVG) {
    if (!Validator.validarElemento(elementoSVG, 'svg')) {
      throw new Error('Elemento SVG es requerido para AnimationService');
    }
    
    this.svg = elementoSVG;
    this.animacionesActivas = new Set();
    this.colaAnimaciones = [];
  }

  animarPorRuta(ruta, color, duracion = CONFIG.ANIMACION.DURACION.NORMAL, alFinalizar = null) {
    return new Promise((resolver) => {
      if (!Validator.validarElemento(ruta, 'path')) {
        logger.error('Elemento de ruta inválido para animación');
        resolver();
        return;
      }

      const idAnimacion = `animacion_${Date.now()}_${Math.random()}`;
      this.animacionesActivas.add(idAnimacion);

      const particulas = CONFIG.ANIMACION.PARTICULAS;
      const elementosCreados = [];

      particulas.RETRASOS.forEach((retraso, indice) => {
        const punto = this.crearParticula(
          particulas.TAMANOS[indice],
          color,
          particulas.OPACIDADES[indice]
        );
        
        const animacion = this.crearAnimacionMovimiento(
          ruta,
          duracion,
          retraso,
          idAnimacion
        );
        
        punto.appendChild(animacion);
        this.svg.appendChild(punto);
        elementosCreados.push(punto);
      });

      const tiempoLimpieza = (duracion + Math.max(...particulas.RETRASOS)) * 1000 + 60;
      setTimeout(() => {
        elementosCreados.forEach(elemento => {
          if (elemento.parentNode) {
            elemento.parentNode.removeChild(elemento);
          }
        });
        
        this.animacionesActivas.delete(idAnimacion);
        
        if (alFinalizar) {
          alFinalizar();
        }
        resolver();
      }, tiempoLimpieza);

    });
  }

  crearParticula(radio, color, opacidad) {
    const punto = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    punto.setAttribute('r', radio);
    punto.setAttribute('fill', color);
    punto.setAttribute('opacity', opacidad);
    punto.style.display = 'block';
    punto.style.visibility = 'visible';
    punto.style.filter = 'drop-shadow(0 0 6px rgba(255,255,255,.45))';
    return punto;
  }

  crearAnimacionMovimiento(ruta, duracion, retraso, idAnimacion) {
    const animacion = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
    animacion.setAttribute('dur', `${duracion}s`);
    animacion.setAttribute('begin', `${retraso}s`);
    animacion.setAttribute('rotate', 'auto');
    animacion.setAttribute('data-animation-id', idAnimacion);
    
    const rutaMovimiento = document.createElementNS('http://www.w3.org/2000/svg', 'mpath');
    rutaMovimiento.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${ruta.id}`);
    animacion.appendChild(rutaMovimiento);
    
    return animacion;
  }

  pulsarNodo(nodo, duracion = 1050) {
    if (!Validator.validarElemento(nodo, 'node')) {
      logger.error('Elemento de nodo inválido para pulso');
      return;
    }

    nodo.classList.add(CONFIG.CLASES.PULSO);
    setTimeout(() => {
      nodo.classList.remove(CONFIG.CLASES.PULSO);
    }, duracion);

  }

  crearEfectoOndulacion(nodoInternet) {
    if (!Validator.validarElemento(nodoInternet, 'internet node')) {
      logger.error('Nodo de internet inválido para efecto de ondulación');
      return;
    }

    const transformacion = nodoInternet.getAttribute('transform') || '';
    const coincidenciaTraduccion = /translate\(([-\d.]+)\s*,\s*([-\d.]+)\)/.exec(transformacion);
    
    if (!coincidenciaTraduccion) {
      logger.error('No se pudo analizar la transformación del nodo de internet');
      return;
    }

    const [, x, y] = coincidenciaTraduccion;
    const elipse = nodoInternet.querySelector('ellipse');
    const radioX = Number(elipse.getAttribute('rx'));
    
    const xContacto = parseFloat(x) - radioX;
    const yContacto = parseFloat(y);

    const anillo = this.crearAnilloOndulacion(xContacto, yContacto);
    this.svg.appendChild(anillo);

    setTimeout(() => {
      if (anillo.parentNode) {
        anillo.parentNode.removeChild(anillo);
      }
    }, 820);

  }

  crearAnilloOndulacion(x, y) {
    const anillo = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    anillo.setAttribute('cx', x);
    anillo.setAttribute('cy', y);
    anillo.setAttribute('r', '6');
    anillo.setAttribute('fill', 'none');
    anillo.setAttribute('stroke', 'var(--ok)');
    anillo.setAttribute('stroke-width', '2');
    anillo.style.display = 'block';
    anillo.style.visibility = 'visible';
    anillo.style.opacity = '1';

    const animacionRadio = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    animacionRadio.setAttribute('attributeName', 'r');
    animacionRadio.setAttribute('from', '6');
    animacionRadio.setAttribute('to', '28');
    animacionRadio.setAttribute('dur', '0.8s');
    animacionRadio.setAttribute('fill', 'freeze');

    const animacionOpacidad = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    animacionOpacidad.setAttribute('attributeName', 'opacity');
    animacionOpacidad.setAttribute('from', '0.9');
    animacionOpacidad.setAttribute('to', '0');
    animacionOpacidad.setAttribute('dur', '0.8s');
    animacionOpacidad.setAttribute('fill', 'freeze');

    anillo.appendChild(animacionRadio);
    anillo.appendChild(animacionOpacidad);

    return anillo;
  }

  crearExplosionBloqueo(nodoRouter) {
    if (!Validator.validarElemento(nodoRouter, 'router node')) {
      logger.error('Nodo de router inválido para explosión de bloqueo');
      return;
    }

    const transformacion = nodoRouter.getAttribute('transform') || '';
    const coincidenciaTraduccion = /translate\(([-\d.]+)\s*,\s*([-\d.]+)\)/.exec(transformacion);
    
    if (!coincidenciaTraduccion) {
      logger.error('No se pudo analizar la transformación del nodo de router');
      return;
    }

    const [, x, y] = coincidenciaTraduccion;
    const xExplosion = parseFloat(x) + 126;
    const yExplosion = parseFloat(y) + 28;

    const textoExplosion = this.crearTextoExplosion(xExplosion, yExplosion);
    this.svg.appendChild(textoExplosion);

    setTimeout(() => {
      if (textoExplosion.parentNode) {
        textoExplosion.parentNode.removeChild(textoExplosion);
      }
    }, 900);

  }

  crearTextoExplosion(x, y) {
    const texto = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    texto.setAttribute('x', x);
    texto.setAttribute('y', y);
    texto.setAttribute('fill', 'var(--bad)');
    texto.setAttribute('font-size', '20');
    texto.setAttribute('font-weight', '700');
    texto.setAttribute('text-anchor', 'start');
    texto.setAttribute('dominant-baseline', 'middle');
    texto.style.display = 'block';
    texto.style.visibility = 'visible';
    texto.style.opacity = '1';
    texto.textContent = '✖';
    
    return texto;
  }

  mostrarInsigniaPuerto(texto, nodoRouter) {
    if (!Validator.validarElemento(nodoRouter, 'router node')) {
      logger.error('Nodo de router inválido para insignia de puerto');
      return;
    }

    const cajaSVG = this.svg.getBoundingClientRect();
    const cajaRouter = nodoRouter.getBBox();
    const x = cajaRouter.x + cajaRouter.width + 6;
    const y = cajaRouter.y + 24;

    const insignia = document.createElement('div');
    insignia.className = 'port-badge';
    insignia.style.left = (cajaSVG.left + (x / this.svg.viewBox.baseVal.width) * cajaSVG.width) + 'px';
    insignia.style.top = (cajaSVG.top + (y / this.svg.viewBox.baseVal.height) * cajaSVG.height) + 'px';
    insignia.textContent = 'NAT: ' + texto;
    
    document.body.appendChild(insignia);

    setTimeout(() => {
      if (insignia.parentNode) {
        insignia.parentNode.removeChild(insignia);
      }
    }, 1100);

  }

  detenerTodasAnimaciones() {
    this.animacionesActivas.clear();
    
    const elementosAnimados = this.svg.querySelectorAll('[data-animation-id]');
    elementosAnimados.forEach(elemento => {
      if (elemento.parentNode) {
        elemento.parentNode.removeChild(elemento);
      }
    });

    const insignias = document.querySelectorAll('.port-badge');
    insignias.forEach(insignia => {
      if (insignia.parentNode) {
        insignia.parentNode.removeChild(insignia);
      }
    });

  }

  obtenerCantidadAnimacionesActivas() {
    return this.animacionesActivas.size;
  }
}
