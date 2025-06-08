/* ======================
   INICIALIZACIÓN PÁGINA PRINCIPAL
====================== */
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.carrusel')) {
        iniciarCarrusel();
    }

    configurarBotonVerMas();
});

/* ======================
   FUNCIÓN PARA INICIAR EL CARRUSEL
====================== */
function iniciarCarrusel() {
    const carrusel = document.querySelector('.carrusel');
    const slides = carrusel?.querySelectorAll('.slide');
    if (!slides || slides.length === 0) return;

    let indiceActual = 0;
    const totalSlides = slides.length;

    const mostrarSlide = (indice) => {
        carrusel.style.transform = `translateX(-${indice * 100}%)`;
    };

    const siguienteSlide = () => {
        indiceActual = (indiceActual + 1) % totalSlides;
        mostrarSlide(indiceActual);
    };

    let intervalo = setInterval(siguienteSlide, 5000);

    carrusel.addEventListener('mouseenter', () => clearInterval(intervalo));
    carrusel.addEventListener('mouseleave', () => {
        intervalo = setInterval(siguienteSlide, 5000);
    });
}

/* ======================
   BOTÓN "VER MÁS DETALLES"
====================== */
function configurarBotonVerMas() {
    const btnVerMas = document.querySelector('.btn-ver-mas');
    const infoAdicional = document.querySelector('.informacion-adicional');

    if (!btnVerMas || !infoAdicional) return;

    btnVerMas.addEventListener('click', () => {
        infoAdicional.classList.toggle('mostrar');
        btnVerMas.classList.toggle('activo');
        
        const icono = btnVerMas.querySelector('i');
        if (infoAdicional.classList.contains('mostrar')) {
            btnVerMas.innerHTML = '<i class="fas fa-chevron-up"></i> Ver menos detalles';
            // Enfocar el primer elemento dentro de la información adicional para accesibilidad
            const primerElemento = infoAdicional.querySelector('h3, .detalle-item');
            if (primerElemento) primerElemento.setAttribute('tabindex', '-1');
        } else {
            btnVerMas.innerHTML = '<i class="fas fa-chevron-down"></i> Ver más detalles';
        }
    });
}
