/* ======================
   INICIALIZACIÓN PÁGINA PRINCIPAL
====================== */
// Espera a que el DOM esté completamente cargado para ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
    // Si existe un elemento con clase 'carrusel', inicializa el carrusel
    if (document.querySelector('.carrusel')) {
        iniciarCarrusel();
    }

    // Configura el botón "Ver más detalles"
    configurarBotonVerMas();
});

/* ======================
   FUNCIÓN PARA INICIAR EL CARRUSEL
====================== */
function iniciarCarrusel() {
    const carrusel = document.querySelector('.carrusel'); // Selecciona el contenedor del carrusel
    const slides = carrusel?.querySelectorAll('.slide'); // Obtiene todos los slides dentro del carrusel
    if (!slides || slides.length === 0) return; // Si no hay slides, termina la función

    let indiceActual = 0; // Índice del slide que se está mostrando actualmente
    const totalSlides = slides.length; // Número total de slides

    // Función para mostrar un slide según el índice, moviendo el carrusel horizontalmente
    const mostrarSlide = (indice) => {
        // Actualizar atributos ARIA para accesibilidad
        slides.forEach((slide, i) => {
            slide.setAttribute('aria-hidden', i !== indice);
            if (i === indice) {
                slide.setAttribute('tabindex', '0');
            } else {
                slide.removeAttribute('tabindex');
            }
        });
        
        carrusel.style.transform = `translateX(-${indice * 100}%)`;
    };

    // Función para pasar al siguiente slide de forma cíclica
    const siguienteSlide = () => {
        indiceActual = (indiceActual + 1) % totalSlides; // Incrementa índice y vuelve a 0 al final
        mostrarSlide(indiceActual); // Muestra el slide actual
    };

    // Inicializar el carrusel
    mostrarSlide(0);

    // Inicia un intervalo para cambiar el slide cada 5 segundos (5000 ms)
    let intervalo = setInterval(siguienteSlide, 5000);

    // Cuando el usuario pasa el cursor sobre el carrusel, se pausa el cambio automático
    carrusel.addEventListener('mouseenter', () => clearInterval(intervalo));

    // Cuando el usuario quita el cursor, vuelve a iniciar el cambio automático de slides
    carrusel.addEventListener('mouseleave', () => {
        intervalo = setInterval(siguienteSlide, 5000);
    });
}

/* ======================
   BOTÓN "VER MÁS DETALLES"
====================== */
function configurarBotonVerMas() {
    const btnVerMas = document.querySelector('.btn-ver-mas'); // Botón para ver más detalles
    const infoAdicional = document.querySelector('.informacion-adicional'); // Contenedor con info extra

    if (!btnVerMas || !infoAdicional) return; // Si no existen, no hace nada

    // Añade el evento click al botón
    btnVerMas.addEventListener('click', () => {
        const estaMostrando = infoAdicional.classList.toggle('mostrar');
        
        // Actualizar atributos ARIA
        btnVerMas.setAttribute('aria-expanded', estaMostrando.toString());
        
        // Alterna la clase 'activo' en el botón para cambiar estilos visuales
        btnVerMas.classList.toggle('activo');
        
        // Cambia el texto e icono del botón según si la info adicional está visible o no
        if (estaMostrando) {
            btnVerMas.innerHTML = '<i class="fas fa-chevron-up"></i> Ver menos detalles';
            
            // Para accesibilidad, enfoca el primer elemento dentro de la info adicional
            const primerElemento = infoAdicional.querySelector('h3, .detalle-item');
            if (primerElemento) {
                primerElemento.setAttribute('tabindex', '0');
                primerElemento.focus();
            }
        } else {
            btnVerMas.innerHTML = '<i class="fas fa-chevron-down"></i> Ver más detalles';
            btnVerMas.focus();
        }
    });

    // Manejar teclado para accesibilidad
    btnVerMas.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btnVerMas.click();
        }
    });
}