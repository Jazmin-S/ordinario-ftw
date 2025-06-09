/* ======================
   INICIALIZACIÓN PÁGINA PRINCIPAL
====================== */
document.addEventListener('DOMContentLoaded', () => {
    configurarObservadorSecciones(); // Observa qué sección está visible para lectores de pantalla
    if (document.querySelector('.carrusel')) {
        iniciarCarrusel(); // Inicia el carrusel si existe
    }

    configurarBotonVerMas(); // Configura el botón de "Ver más detalles"
    configurarHoverDetalles(); // Añade efectos al pasar el mouse o enfocar con teclado
});

// Observa las secciones visibles y mejora accesibilidad
function configurarObservadorSecciones() {
    const secciones = document.querySelectorAll('section[aria-labelledby]');
    
    const opciones = {
        threshold: 0.5
    };
    
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.setAttribute('aria-current', 'location');

                const heading = entrada.target.querySelector('h1, h2, h3, h4, h5, h6');
                if (heading) {
                    heading.setAttribute('tabindex', '-1');
                    heading.focus({preventScroll: true});
                    setTimeout(() => heading.removeAttribute('tabindex'), 0);
                }

                setTimeout(() => {
                    entrada.target.removeAttribute('aria-current');
                }, 3000);
            }
        });
    }, opciones);
    
    secciones.forEach(seccion => {
        observador.observe(seccion);
    });
}

/* ======================
   FUNCIÓN PARA INICIAR EL CARRUSEL
====================== */
function iniciarCarrusel() {
    const carrusel = document.querySelector('.carrusel');
    const slides = carrusel.querySelectorAll('.slide');
    const indicadores = document.querySelectorAll('.carrusel-indicador');

    if (slides.length === 0 || slides.length !== indicadores.length) {
        console.warn('El número de slides e indicadores no coincide');
        return;
    }

    let indiceActual = 0;
    const totalSlides = slides.length;
    let intervalo;

    function actualizarEstado(indice) {
        slides.forEach((slide, i) => {
            const estaActivo = i === indice;
            slide.setAttribute('aria-hidden', !estaActivo);
            slide.style.transform = `translateX(-${indice * 100}%)`;
        });

        indicadores.forEach((indicador, i) => {
            const estaActivo = i === indice;
            indicador.classList.toggle('active', estaActivo);
            indicador.setAttribute('aria-selected', estaActivo);
            indicador.setAttribute('tabindex', estaActivo ? '0' : '-1');
        });
    }

    function irASlide(indice) {
        indiceActual = indice;
        actualizarEstado(indiceActual);
        reiniciarIntervalo();
    }

    function siguienteSlide() {
        indiceActual = (indiceActual + 1) % totalSlides;
        actualizarEstado(indiceActual);
    }

    function reiniciarIntervalo() {
        clearInterval(intervalo);
        intervalo = setInterval(siguienteSlide, 5000);
    }

    indicadores.forEach((indicador, i) => {
        indicador.addEventListener('click', () => irASlide(i));
        indicador.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                irASlide(i);
            }
        });
    });

    carrusel.addEventListener('mouseenter', () => clearInterval(intervalo));
    carrusel.addEventListener('mouseleave', reiniciarIntervalo);
    carrusel.addEventListener('focusin', () => clearInterval(intervalo));
    carrusel.addEventListener('focusout', reiniciarIntervalo);

    actualizarEstado(0);
    reiniciarIntervalo();
}

document.addEventListener('DOMContentLoaded', iniciarCarrusel);

/* ======================
   BOTÓN "VER MÁS DETALLES"
====================== */
function configurarBotonVerMas() {
    const btnVerMas = document.querySelector('.btn-ver-mas');
    const infoAdicional = document.querySelector('.informacion-adicional');

    if (!btnVerMas || !infoAdicional) return;

    btnVerMas.setAttribute('aria-controls', 'informacion-adicional');
    infoAdicional.setAttribute('aria-labelledby', 'informacion-adicional-heading');

    btnVerMas.addEventListener('click', () => {
        const estaMostrando = infoAdicional.hasAttribute('hidden');

        if (estaMostrando) {
            infoAdicional.removeAttribute('hidden');
            infoAdicional.classList.add('mostrar');

            setTimeout(() => {
                const primerElemento = infoAdicional.querySelector('h3, [tabindex], .detalle-item');
                if (primerElemento) {
                    primerElemento.setAttribute('tabindex', '0');
                    primerElemento.focus();
                }
            }, 100);
        } else {
            infoAdicional.setAttribute('hidden', '');
            infoAdicional.classList.remove('mostrar');
            btnVerMas.focus();
        }

        btnVerMas.setAttribute('aria-expanded', (!estaMostrando).toString());
        btnVerMas.classList.toggle('activo');
        btnVerMas.innerHTML = estaMostrando 
            ? '<i class="fas fa-chevron-up"></i> Ver menos detalles' 
            : '<i class="fas fa-chevron-down"></i> Ver más detalles';
    });

    btnVerMas.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btnVerMas.click();
        }
    });
}

/* ======================
   EFECTOS DE HOVER Y FOCUS EN DETALLES
====================== */
function configurarHoverDetalles() {
    const detallesItems = document.querySelectorAll('.detalle-item');

    detallesItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.classList.add('destacado');
        });

        item.addEventListener('mouseleave', () => {
            item.classList.remove('destacado');
        });

        item.addEventListener('focus', () => {
            item.classList.add('destacado');
        });

        item.addEventListener('blur', () => {
            item.classList.remove('destacado');
        });
    });
}

/* ======================
   DETECCIÓN DE MODO TECLADO
====================== */
function activarModoTeclado() {
  document.body.classList.add('modo-teclado');
  window.removeEventListener('keydown', onKeyDown);
  window.addEventListener('mousedown', onMouseDown);
}

function desactivarModoTeclado() {
  document.body.classList.remove('modo-teclado');
  window.removeEventListener('mousedown', onMouseDown);
  window.addEventListener('keydown', onKeyDown);
}

function onKeyDown(e) {
  const teclasNavegacion = ['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Space', 'Home', 'End', 'PageUp', 'PageDown'];
  if (teclasNavegacion.includes(e.key)) {
    activarModoTeclado();
  }
}

function onMouseDown() {
  desactivarModoTeclado();
}

window.addEventListener('keydown', onKeyDown);

function detectarModoTeclado() {
  function activarModoTeclado() {
    document.body.classList.add('modo-teclado');
  }

  function desactivarModoTeclado() {
    document.body.classList.remove('modo-teclado');
  }

  window.addEventListener('keydown', (e) => {
    const teclasFoco = ['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' ', 'Escape'];
    if (teclasFoco.includes(e.key)) {
      activarModoTeclado();
    }
  });

  window.addEventListener('mousedown', desactivarModoTeclado);
  window.addEventListener('touchstart', desactivarModoTeclado);

  window.addEventListener('focusin', (e) => {
    if (!document.body.classList.contains('modo-teclado')) {
      activarModoTeclado();
    }
  });
}

detectarModoTeclado();
