// ======================
// contacto.js - Versión con validación visual y mensajes flotantes
// ======================

document.addEventListener('DOMContentLoaded', () => {
    configurarFormularioContacto();
    configurarValidacionEnTiempoReal();
    configurarEventosTeclado();
});

function configurarFormularioContacto() {
    const formulario = document.getElementById('formulario-contacto');
    if (!formulario) return;

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        const esValido = validarFormularioContacto();
        
        if (esValido) {
            mostrarMensajeExitoFlotante('¡Mensaje enviado con éxito!', 'Gracias por contactarnos. Nos pondremos en contacto contigo pronto.');
            formulario.reset();
            // Quitar clases de validación al resetear
            document.querySelectorAll('.grupo-formulario input, .grupo-formulario textarea').forEach(campo => {
                campo.classList.remove('campo-valido');
            });
        }
    });
}

function configurarValidacionEnTiempoReal() {
    const campos = ['nombre', 'email', 'mensaje', 'telefono'];
    
    campos.forEach(id => {
        const campo = document.getElementById(id);
        if (!campo) return;
        
        campo.addEventListener('blur', () => {
            validarCampo(campo);
        });
        
        campo.addEventListener('input', () => {
            if (campo.value.trim() === '') {
                limpiarValidacion(campo);
            } else {
                validarCampo(campo);
            }
        });
    });
}

function validarCampo(campo) {
    const valor = campo.value.trim();
    let esValido = true;
    let mensajeError = '';
    
    switch(campo.id) {
        case 'nombre':
            if (!valor) {
                esValido = false;
                mensajeError = 'El nombre es requerido';
            } else if (valor.length < 3) {
                esValido = false;
                mensajeError = 'Mínimo 3 caracteres';
            }
            break;
            
        case 'email':
            if (!valor) {
                esValido = false;
                mensajeError = 'El correo electrónico es requerido';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
                esValido = false;
                mensajeError = 'Correo electrónico inválido';
            }
            break;
            
        case 'mensaje':
            if (!valor) {
                esValido = false;
                mensajeError = 'El mensaje es requerido';
            } else if (valor.length < 10) {
                esValido = false;
                mensajeError = 'Mínimo 10 caracteres';
            }
            break;
            
        case 'telefono':
            // Validación opcional para teléfono
            if (valor && !/^[\d\s+-]{10,15}$/.test(valor)) {
                esValido = false;
                mensajeError = 'Teléfono inválido (10-15 dígitos)';
            }
            break;
    }
    
    if (!esValido) {
        mostrarErrorCampo(campo, mensajeError);
        return false;
    }
    
    // Si el campo es válido
    mostrarCampoValido(campo);
    return true;
}

function mostrarErrorCampo(campo, mensaje) {
    limpiarValidacion(campo);
    
    const errorId = `${campo.id}-error`;
    let errorElement = document.getElementById(errorId);
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = errorId;
        errorElement.className = 'mensaje-error-campo';
        errorElement.setAttribute('role', 'alert');
        errorElement.setAttribute('aria-live', 'polite');
        campo.insertAdjacentElement('afterend', errorElement);
    }
    
    errorElement.textContent = mensaje;
    campo.setAttribute('aria-invalid', 'true');
    campo.setAttribute('aria-describedby', errorId);
    campo.classList.add('campo-invalido');
}

function mostrarCampoValido(campo) {
    limpiarValidacion(campo);
    campo.classList.add('campo-valido');
    campo.setAttribute('aria-invalid', 'false');
}

function limpiarValidacion(campo) {
    const errorId = `${campo.id}-error`;
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
        errorElement.remove();
    }
    
    campo.removeAttribute('aria-invalid');
    campo.removeAttribute('aria-describedby');
    campo.classList.remove('campo-invalido', 'campo-valido');
}

function validarFormularioContacto() {
    let esValido = true;
    const camposRequeridos = ['nombre', 'email', 'mensaje'];
    
    camposRequeridos.forEach(id => {
        const campo = document.getElementById(id);
        if (campo && !validarCampo(campo)) {
            if (esValido) {
                campo.focus();
                esValido = false;
            }
        }
    });
    
    // Validar teléfono (opcional)
    const telefono = document.getElementById('telefono');
    if (telefono && telefono.value.trim() !== '' && !validarCampo(telefono)) {
        if (esValido) {
            telefono.focus();
            esValido = false;
        }
    }
    
    if (!esValido) {
        mostrarMensajeErrorFlotante('Error en el formulario', 'Por favor corrige los errores marcados');
    }
    
    return esValido;
}

function mostrarMensajeExitoFlotante(titulo, mensaje) {
    const mensajeId = 'mensaje-flotante-exito-' + Date.now();
    const mensajeElement = document.createElement('div');
    mensajeElement.id = mensajeId;
    mensajeElement.className = 'mensaje-flotante mensaje-exito';
    mensajeElement.setAttribute('role', 'alert');
    mensajeElement.setAttribute('aria-live', 'assertive');
    mensajeElement.setAttribute('aria-atomic', 'true');
    mensajeElement.innerHTML = `
        <div class="mensaje-contenido">
            <span class="icono" aria-hidden="true"><i class="fas fa-check-circle"></i></span>
            <div class="texto">
                <h3>${titulo}</h3>
                <p>${mensaje}</p>
            </div>
            <button class="btn-cerrar-mensaje" aria-label="Cerrar mensaje">&times;</button>
        </div>
        <div class="progreso-tiempo"></div>
    `;

    document.body.appendChild(mensajeElement);
    mensajeElement.focus();

    const btnCerrar = mensajeElement.querySelector('.btn-cerrar-mensaje');
    btnCerrar.addEventListener('click', () => {
        cerrarMensajeFlotante(mensajeElement);
    });

    setTimeout(() => {
        cerrarMensajeFlotante(mensajeElement);
    }, 5000);
}

function mostrarMensajeErrorFlotante(titulo, mensaje) {
    const mensajeId = 'mensaje-flotante-error-' + Date.now();
    const mensajeElement = document.createElement('div');
    mensajeElement.id = mensajeId;
    mensajeElement.className = 'mensaje-flotante mensaje-error';
    mensajeElement.setAttribute('role', 'alert');
    mensajeElement.setAttribute('aria-live', 'assertive');
    mensajeElement.setAttribute('aria-atomic', 'true');
    mensajeElement.innerHTML = `
        <div class="mensaje-contenido">
            <span class="icono" aria-hidden="true"><i class="fas fa-exclamation-circle"></i></span>
            <div class="texto">
                <h3>${titulo}</h3>
                <p>${mensaje}</p>
            </div>
            <button class="btn-cerrar-mensaje" aria-label="Cerrar mensaje">&times;</button>
        </div>
        <div class="progreso-tiempo"></div>
    `;

    document.body.appendChild(mensajeElement);
    mensajeElement.focus();

    const btnCerrar = mensajeElement.querySelector('.btn-cerrar-mensaje');
    btnCerrar.addEventListener('click', () => {
        cerrarMensajeFlotante(mensajeElement);
    });

    setTimeout(() => {
        cerrarMensajeFlotante(mensajeElement);
    }, 5000);
}

function cerrarMensajeFlotante(elemento) {
    elemento.classList.add('ocultando');
    setTimeout(() => {
        elemento.remove();
    }, 500);
}

function configurarEventosTeclado() {
    const radios = document.querySelectorAll('[name="preferencia"]');
    
    radios.forEach(radio => {
        radio.addEventListener('keydown', (e) => {
            const radioGroup = Array.from(document.querySelectorAll('[name="preferencia"]'));
            const currentIndex = radioGroup.indexOf(e.target);
            
            switch(e.key) {
                case 'ArrowUp':
                case 'ArrowLeft':
                    e.preventDefault();
                    const prevIndex = (currentIndex - 1 + radioGroup.length) % radioGroup.length;
                    radioGroup[prevIndex].focus();
                    radioGroup[prevIndex].click();
                    break;
                    
                case 'ArrowDown':
                case 'ArrowRight':
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % radioGroup.length;
                    radioGroup[nextIndex].focus();
                    radioGroup[nextIndex].click();
                    break;
            }
        });
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const mensajes = document.querySelectorAll('.mensaje-flotante');
            mensajes.forEach(mensaje => {
                cerrarMensajeFlotante(mensaje);
            });
        }
    });
}