import { CONFIG } from '../config.js';
import { logger } from '../utils/Logger.js';
import { Validator } from '../utils/Validator.js';

export class SVGService {
  constructor(elementoSVG) {
    if (!Validator.validarElemento(elementoSVG, 'svg')) {
      throw new Error('Elemento SVG es requerido para SVGService');
    }
    
    this.svg = elementoSVG;
    this.inicializarElementos();
  }

  inicializarElementos() {
    this.rutas = CONFIG.SELECTORES.RUTAS.map(selector => 
      document.querySelector(selector)
    ).filter(Boolean);
    
    this.enlaceRI = document.querySelector(CONFIG.SELECTORES.ENLACE_RI);
    this.gruposDispositivos = CONFIG.SELECTORES.GRUPOS_DISPOSITIVOS.map(selector => 
      document.querySelector(selector)
    ).filter(Boolean);
    
    this.ipsDispositivos = CONFIG.SELECTORES.IPS_DISPOSITIVOS.map(selector => 
      document.querySelector(selector)
    ).filter(Boolean);
    
    this.nodoRouter = document.querySelector(CONFIG.SELECTORES.NODO_ROUTER);
    this.nodoInternet = document.querySelector(CONFIG.SELECTORES.NODO_INTERNET);
    this.elipseInternet = this.nodoInternet?.querySelector('ellipse');


    const elementosRequeridos = [
      { elemento: this.enlaceRI, nombre: 'enlace router-internet' },
      { elemento: this.nodoRouter, nombre: 'nodo router' },
      { elemento: this.nodoInternet, nombre: 'nodo internet' },
      { elemento: this.elipseInternet, nombre: 'elipse internet' }
    ];

    elementosRequeridos.forEach(({ elemento, nombre }) => {
      if (!Validator.validarElemento(elemento, nombre)) {
        throw new Error(`Elemento SVG requerido no encontrado: ${nombre}`);
      }
    });

    this.mostrarRutasActivas(4);
  }

  obtenerTraduccion(elemento) {
    if (!elemento) return { x: 0, y: 0 };
    
    const transformacion = elemento.getAttribute('transform') || '';
    const coincidencia = /translate\(([-\d.]+)\s*,\s*([-\d.]+)\)/.exec(transformacion);
    
    return coincidencia ? { x: +coincidencia[1], y: +coincidencia[2] } : { x: 0, y: 0 };
  }

  establecerTraduccion(elemento, x, y) {
    if (!elemento) return;
    elemento.setAttribute('transform', `translate(${x}, ${y})`);
  }

  disenarSimetrico(cantidadDispositivos) {
    if (!Validator.validarCantidadDispositivos(cantidadDispositivos)) {
      logger.error('Cantidad de dispositivos inválida para diseño', { cantidadDispositivos });
      return;
    }

    const { DISPOSITIVO, ROUTER, INTERNET } = CONFIG.SVG;
    const { x: rx, y: ry } = this.obtenerTraduccion(this.nodoRouter);
    const centroYRouter = ry + ROUTER.ALTO / 2;
    const derechaXRouter = rx + ROUTER.ANCHO;

    const { x: cx, y: cy } = this.obtenerTraduccion(this.nodoInternet);
    const ex = Number(this.elipseInternet.getAttribute('rx'));
    const izquierdaXInternet = cx - ex;
    const centroYInternet = cy;

    const superior = DISPOSITIVO.Y_SUPERIOR;
    const inferior = DISPOSITIVO.Y_INFERIOR;
    const espacio = cantidadDispositivos === 1 ? 0 : (inferior - superior) / (cantidadDispositivos - 1);

    this.gruposDispositivos.forEach((grupo, indice) => {
      if (indice < cantidadDispositivos) {
        this.posicionarDispositivo(grupo, indice, espacio, superior, DISPOSITIVO);
        this.actualizarRutaDispositivo(grupo, indice, espacio, superior, DISPOSITIVO, centroYRouter, rx, cantidadDispositivos);
      } else {
        this.ocultarElemento(grupo);
        this.ocultarElemento(this.rutas[indice]);
      }
    });

    this.actualizarRutaRouterInternet(derechaXRouter, centroYRouter, izquierdaXInternet, centroYInternet);
    this.mostrarRutasActivas(cantidadDispositivos);
  }

  posicionarDispositivo(grupo, indice, espacio, superior, configuracionDispositivo) {
    const ySuperior = superior + indice * espacio - configuracionDispositivo.ALTO / 2;
    this.establecerTraduccion(grupo, configuracionDispositivo.X_IZQUIERDA, ySuperior);
    grupo.style.display = '';
  }

  actualizarRutaDispositivo(grupo, indice, espacio, superior, configuracionDispositivo, centroYRouter, rx, cantidadDispositivos) {
    const ySuperior = superior + indice * espacio - configuracionDispositivo.ALTO / 2;
    const cxDispositivo = configuracionDispositivo.X_IZQUIERDA + configuracionDispositivo.ANCHO / 2;
    const cyDispositivo = ySuperior + configuracionDispositivo.ALTO / 2;

    const c1x = configuracionDispositivo.X_IZQUIERDA + configuracionDispositivo.ANCHO + 90;
    const c1y = cyDispositivo;
    const c2x = rx - 120;
    const c2y = centroYRouter + (indice - (cantidadDispositivos - 1) / 2) * 28;

    const ruta = this.rutas[indice];
    if (ruta) {
      ruta.setAttribute('d', 
        `M ${cxDispositivo + 30} ${cyDispositivo} C ${c1x} ${c1y} ${c2x} ${c2y} ${rx} ${centroYRouter}`
      );
      ruta.style.display = '';
    }
  }

  actualizarRutaRouterInternet(derechaXRouter, centroYRouter, izquierdaXInternet, centroYInternet) {
    const c1x = derechaXRouter + 100;
    const c1y = centroYRouter - 10;
    const c2x = izquierdaXInternet - 80;
    const c2y = centroYInternet;

    this.enlaceRI.setAttribute('d',
      `M ${derechaXRouter} ${centroYRouter} C ${c1x} ${c1y} ${c2x} ${c2y} ${izquierdaXInternet} ${centroYInternet}`
    );
  }

  establecerIPsDispositivos(cantidad) {
    this.ipsDispositivos.forEach(elementoIP => {
      if (elementoIP) {
        elementoIP.textContent = 'IP: –';
      }
    });

    for (let i = 0; i < cantidad && i < this.ipsDispositivos.length; i++) {
      if (this.ipsDispositivos[i]) {
        this.ipsDispositivos[i].textContent = `IP: ${CONFIG.RED.RANGO_IP_PRIVADA}${CONFIG.RED.INICIO_IP_PRIVADA + i}`;
      }
    }

  }

  establecerEnlaceActivo(ruta, activo) {
    if (!ruta) return;
    ruta.classList.toggle(CONFIG.CLASES.ACTIVO, activo);
  }

  reiniciarEnlaces() {
    [...this.rutas, this.enlaceRI].forEach(ruta => {
      this.establecerEnlaceActivo(ruta, false);
      if (ruta) {
        ruta.style.display = '';
      }
    });
  }

  ocultarElemento(elemento) {
    if (elemento) {
      elemento.style.display = 'none';
    }
  }



  mostrarRutasActivas(cantidadDispositivos) {
    this.rutas.forEach((ruta, indice) => {
      if (ruta) {
        if (indice < cantidadDispositivos) {
          ruta.style.display = '';
          ruta.style.visibility = 'visible';
          ruta.style.opacity = '1';
        } else {
          ruta.style.display = 'none';
        }
      }
    });
    
    if (this.enlaceRI) {
      this.enlaceRI.style.display = '';
      this.enlaceRI.style.visibility = 'visible';
      this.enlaceRI.style.opacity = '1';
    }
  }


  actualizarInformacionRouter(natHabilitado, ipPublica = null) {
    const textoNAT = this.nodoRouter?.querySelector('#routerNat');
    const textoPublico = this.nodoRouter?.querySelector('#routerPub');

    if (textoNAT) {
      textoNAT.textContent = `NAT: ${natHabilitado ? 'ON' : 'OFF'}`;
    }

    if (textoPublico) {
      textoPublico.textContent = `IP Pública: ${ipPublica || '—'}`;
    }

  }

}
