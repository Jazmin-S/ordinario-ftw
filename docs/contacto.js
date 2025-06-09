// ======================
// contacto.js - Versión con validación visual y mensajes flotantes
// ======================

// Espera a que el DOM esté completamente cargado antes de ejecutar configuraciones
document.addEventListener('DOMContentLoaded', () => {
    configurarFormularioContacto();           // Configura la lógica al enviar el formulario
    configurarValidacionEnTiempoReal();       // Habilita validación mientras se escribe
    configurarEventosTeclado();               // Mejora accesibilidad con eventos de teclado
});

// Configura el envío del formulario y muestra mensaje de éxito si es válido
function configurarFormularioContacto() {
    const formulario = document.getElementById('formulario-contacto');
    if (!formulario) return;

    formulario.addEventListener('submit', (e) => {
        e.preventDefault(); // Previene envío tradicional
        const esValido = validarFormularioContacto();
        
        if (esValido) {
            // Muestra mensaje flotante de éxito
            mostrarMensajeExitoFlotante('¡Mensaje enviado con éxito!', 'Gracias por contactarnos. Nos pondremos en contacto contigo pronto.');
            formulario.reset(); // Limpia formulario
            // Quita clases de validación de todos los campos
            document.querySelectorAll('.grupo-formulario input, .grupo-formulario textarea').forEach(campo => {
                campo.classList.remove('campo-valido');
            });
        }
    });
}

// Habilita validación automática al escribir o salir del campo
function configurarValidacionEnTiempoReal() {
    const campos = ['nombre', 'email', 'mensaje', 'telefono'];
    
    campos.forEach(id => {
        const campo = document.getElementById(id);
        if (!campo) return;
        
        // Valida al salir del campo
        campo.addEventListener('blur', () => {
            validarCampo(campo);
        });
        
        // Valida al escribir si no está vacío, o limpia validación si lo está
        campo.addEventListener('input', () => {
            if (campo.value.trim() === '') {
                limpiarValidacion(campo);
            } else {
                validarCampo(campo);
            }
        });
    });
}

// Lógica de validación para cada campo del formulario
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
            // El campo es opcional pero si se llena debe tener entre 10 y 15 dígitos válidos
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
    
    mostrarCampoValido(campo); // Muestra visual de campo correcto
    return true;
}

// Muestra mensaje de error debajo del campo correspondiente
function mostrarErrorCampo(campo, mensaje) {
    limpiarValidacion(campo); // Elimina validaciones anteriores
    
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

// Aplica estilos e indicadores ARIA para campos válidos
function mostrarCampoValido(campo) {
    limpiarValidacion(campo);
    campo.classList.add('campo-valido');
    campo.setAttribute('aria-invalid', 'false');
}

// Elimina mensajes de error y clases visuales del campo
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

// Valida todos los campos del formulario
function validarFormularioContacto() {
    let esValido = true;
    const camposRequeridos = ['nombre', 'email', 'mensaje'];
    
    camposRequeridos.forEach(id => {
        const campo = document.getElementById(id);
        if (campo && !validarCampo(campo)) {
            if (esValido) {
                campo.focus(); // Enfoca el primer campo con error
                esValido = false;
            }
        }
    });
    
    // Valida campo de teléfono si se ha llenado
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

// Crea y muestra mensaje flotante de éxito
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
    mensajeElement.focus(); // Asegura lectura por lector de pantalla

    const btnCerrar = mensajeElement.querySelector('.btn-cerrar-mensaje');
    btnCerrar.addEventListener('click', () => {
        cerrarMensajeFlotante(mensajeElement);
    });

    setTimeout(() => {
        cerrarMensajeFlotante(mensajeElement);
    }, 5000); // Se cierra automáticamente tras 5 segundos
}

// Muestra un mensaje flotante de error similar al de éxito
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

// Añade una clase para ocultar suavemente y luego elimina el mensaje del DOM
function cerrarMensajeFlotante(elemento) {
    elemento.classList.add('ocultando');
    setTimeout(() => {
        elemento.remove();
    }, 500); // Tiempo para permitir transición CSS
}

// Mejora accesibilidad del grupo de radio buttons y permite cerrar mensajes con ESC
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
    
    // Cierra mensajes flotantes presionando Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const mensajes = document.querySelectorAll('.mensaje-flotante');
            mensajes.forEach(mensaje => {
                cerrarMensajeFlotante(mensaje);
            });
        }
    });
}
