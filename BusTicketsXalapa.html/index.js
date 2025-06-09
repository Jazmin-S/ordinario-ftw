/* ======================
   INICIALIZACIÓN PÁGINA PRINCIPAL
====================== */
// Espera a que el DOM esté completamente cargado para ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
    // Configurar observador de intersección
    configurarObservadorSecciones();
    // Si existe un elemento con clase 'carrusel', inicializa el carrusel
    if (document.querySelector('.carrusel')) {
        iniciarCarrusel();
    }

    // Configura el botón "Ver más detalles"
    configurarBotonVerMas();
    configurarHoverDetalles();
});
function configurarObservadorSecciones() {
    const secciones = document.querySelectorAll('section[aria-labelledby]');
    
    const opciones = {
        threshold: 0.5
    };
    
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                // Actualizar ARIA para lector de pantalla
                entrada.target.setAttribute('aria-current', 'location');
                
                // Enfocar el encabezado de la sección de manera accesible
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
    
    // Validación básica
    if (slides.length === 0 || slides.length !== indicadores.length) {
        console.warn('El número de slides e indicadores no coincide');
        return;
    }

    let indiceActual = 0;
    const totalSlides = slides.length;
    let intervalo;

    // Función para actualizar el estado de slides e indicadores
    function actualizarEstado(indice) {
        // Actualizar slides
        slides.forEach((slide, i) => {
            const estaActivo = i === indice;
            slide.setAttribute('aria-hidden', !estaActivo);
            slide.style.transform = `translateX(-${indice * 100}%)`;
        });

        // Actualizar indicadores
        indicadores.forEach((indicador, i) => {
            const estaActivo = i === indice;
            indicador.classList.toggle('active', estaActivo);
            indicador.setAttribute('aria-selected', estaActivo);
            indicador.setAttribute('tabindex', estaActivo ? '0' : '-1');
        });
    }

    // Función para ir a un slide específico
    function irASlide(indice) {
        indiceActual = indice;
        actualizarEstado(indiceActual);
        reiniciarIntervalo();
    }

    // Función para avanzar al siguiente slide
    function siguienteSlide() {
        indiceActual = (indiceActual + 1) % totalSlides;
        actualizarEstado(indiceActual);
    }

    // Función para reiniciar el intervalo automático
    function reiniciarIntervalo() {
        clearInterval(intervalo);
        intervalo = setInterval(siguienteSlide, 5000);
    }

    // Configurar eventos para los indicadores
    indicadores.forEach((indicador, i) => {
        indicador.addEventListener('click', () => irASlide(i));
        
        // Para accesibilidad con teclado
        indicador.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                irASlide(i);
            }
        });
    });

    // Eventos para pausar/reanudar el carrusel
    carrusel.addEventListener('mouseenter', () => clearInterval(intervalo));
    carrusel.addEventListener('mouseleave', reiniciarIntervalo);
    carrusel.addEventListener('focusin', () => clearInterval(intervalo));
    carrusel.addEventListener('focusout', reiniciarIntervalo);

    // Inicialización
    actualizarEstado(0);
    reiniciarIntervalo();
}

// Llamar la función cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', iniciarCarrusel);


/* ======================
   BOTÓN "VER MÁS DETALLES"
====================== */
function configurarBotonVerMas() {
    const btnVerMas = document.querySelector('.btn-ver-mas');
    const infoAdicional = document.querySelector('.informacion-adicional');

    if (!btnVerMas || !infoAdicional) return;

    // Establecer relación ARIA explícita
    btnVerMas.setAttribute('aria-controls', 'informacion-adicional');
    infoAdicional.setAttribute('aria-labelledby', 'informacion-adicional-heading');

    btnVerMas.addEventListener('click', () => {
        const estaMostrando = infoAdicional.hasAttribute('hidden');
        
        // Alternar el atributo hidden
        if (estaMostrando) {
            infoAdicional.removeAttribute('hidden');
            infoAdicional.classList.add('mostrar');
            
            // Enfocar el primer elemento del contenido expandido
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
        
        // Actualizar atributos ARIA
        btnVerMas.setAttribute('aria-expanded', (!estaMostrando).toString());
        btnVerMas.classList.toggle('activo');
        
        // Cambiar texto e icono
        btnVerMas.innerHTML = estaMostrando 
            ? '<i class="fas fa-chevron-up"></i> Ver menos detalles' 
            : '<i class="fas fa-chevron-down"></i> Ver más detalles';
    });

    // Manejar eventos de teclado
    btnVerMas.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btnVerMas.click();
        }
    });
}

// Modificar la función del carrusel para mejorar accesibilidad
function actualizarEstado(indice) {
    // Actualizar slides
    slides.forEach((slide, i) => {
        const estaActivo = i === indice;
        slide.setAttribute('aria-hidden', !estaActivo);
        slide.style.transform = `translateX(-${indice * 100}%)`;
        // Solo el slide activo debe ser enfocable
        slide.querySelector('img').setAttribute('tabindex', estaActivo ? '0' : '-1');
    });

    // Actualizar indicadores
    indicadores.forEach((indicador, i) => {
        const estaActivo = i === indice;
        indicador.classList.toggle('active', estaActivo);
        indicador.setAttribute('aria-selected', estaActivo);
        indicador.setAttribute('tabindex', estaActivo ? '0' : '-1');
    });
}
function configurarHoverDetalles() {
    const detallesItems = document.querySelectorAll('.detalle-item');
    
    detallesItems.forEach(item => {
        // Para mouse (hover)
        item.addEventListener('mouseenter', () => {
            item.classList.add('destacado');
        });
        
        item.addEventListener('mouseleave', () => {
            item.classList.remove('destacado');
        });
        
        // Para teclado (focus)
        item.addEventListener('focus', () => {
            item.classList.add('destacado');
        });
        
        item.addEventListener('blur', () => {
            item.classList.remove('destacado');
        });
    });
}
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

  // Detecta cualquier tecla que pueda mover foco (Tab, flechas, Enter, Espacio, etc)
  window.addEventListener('keydown', (e) => {
    const teclasFoco = ['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' ', 'Escape'];
    if (teclasFoco.includes(e.key)) {
      activarModoTeclado();
    }
  });

  // Detecta click o toque para desactivar modo teclado
  window.addEventListener('mousedown', desactivarModoTeclado);
  window.addEventListener('touchstart', desactivarModoTeclado);

  // Opcional: detecta foco vía teclado (sin tecla) para mayor compatibilidad
  window.addEventListener('focusin', (e) => {
    // Solo activa modo teclado si no hay mouse/touch reciente
    if (!document.body.classList.contains('modo-teclado')) {
      activarModoTeclado();
    }
  });
}

detectarModoTeclado();

