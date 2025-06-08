/* ======================
   contacto.js actualizado con notificación flotante
====================== */
document.addEventListener('DOMContentLoaded', () => {
    configurarFormularioContacto();
});

function configurarFormularioContacto() {
    const formulario = document.getElementById('formulario-contacto');
    if (!formulario) return;

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validarFormularioContacto()) {
            enviarFormularioContacto();
        }
    });
}

function validarFormularioContacto() {
    const nombre = document.getElementById('nombre')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const mensaje = document.getElementById('mensaje')?.value.trim();

    if (!nombre || nombre.length < 3) {
        mostrarMensajeError('Por favor ingrese un nombre válido (mínimo 3 caracteres)');
        return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        mostrarMensajeError('Por favor ingrese un correo electrónico válido');
        return false;
    }
    if (!mensaje || mensaje.length < 10) {
        mostrarMensajeError('Por favor ingrese un mensaje válido (mínimo 10 caracteres)');
        return false;
    }
    return true;
}

function enviarFormularioContacto() {
    setTimeout(() => {
        mostrarMensajeExito();
        document.getElementById('formulario-contacto').reset();
    }, 1000);
}

function mostrarMensajeExito() {
    const mensaje = document.createElement('div');
    mensaje.className = 'mensaje-flotante mensaje-exito';
    mensaje.innerHTML = `
        <div class="mensaje-contenido">
            <span class="icono"><i class="fas fa-check-circle"></i></span>
            <div class="texto">
                <h3>¡Mensaje enviado con éxito!</h3>
                <p>Gracias por contactarnos. Nos pondremos en contacto contigo pronto.</p>
            </div>
            <button class="btn-cerrar-mensaje" aria-label="Cerrar mensaje">&times;</button>
        </div>
        <div class="progreso-tiempo"></div>
    `;

    document.body.appendChild(mensaje);

    setTimeout(() => {
        mensaje.classList.add('ocultando');
        setTimeout(() => mensaje.remove(), 500);
    }, 5000);

    mensaje.querySelector('.btn-cerrar-mensaje').addEventListener('click', () => {
        mensaje.classList.add('ocultando');
        setTimeout(() => mensaje.remove(), 500);
    });
}

function mostrarMensajeError(texto) {
    const mensaje = document.createElement('div');
    mensaje.className = 'mensaje-flotante mensaje-error';
    mensaje.innerHTML = `
        <div class="mensaje-contenido">
            <span class="icono"><i class="fas fa-exclamation-circle"></i></span>
            <div class="texto">
                <h3>Error en el formulario</h3>
                <p>${texto}</p>
            </div>
            <button class="btn-cerrar-mensaje" aria-label="Cerrar mensaje">&times;</button>
        </div>
        <div class="progreso-tiempo"></div>
    `;

    document.body.appendChild(mensaje);

    setTimeout(() => {
        mensaje.classList.add('ocultando');
        setTimeout(() => mensaje.remove(), 500);
    }, 5000);

    mensaje.querySelector('.btn-cerrar-mensaje').addEventListener('click', () => {
        mensaje.classList.add('ocultando');
        setTimeout(() => mensaje.remove(), 500);
    });
}
