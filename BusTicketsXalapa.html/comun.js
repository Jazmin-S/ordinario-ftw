/* ======================
    FUNCIONES COMPARTIDAS
====================== */

// Variables globales para almacenar la información del viaje
let viajeSeleccionado = null;

/* ======================
    FUNCIÓN PARA CALCULAR DURACIÓN ENTRE HORAS EN FORMATO HH:mm
====================== */
function calcularDuracion(salida, llegada) {
    const formatoHora = /^\d{2}:\d{2}$/;
    if (!formatoHora.test(salida) || !formatoHora.test(llegada)) return 'N/A';

    const [hS, mS] = salida.split(':').map(Number);
    const [hL, mL] = llegada.split(':').map(Number);

    if (hS > 23 || mS > 59 || hL > 23 || mL > 59) return 'N/A';

    let minutosTotales = (hL * 60 + mL) - (hS * 60 + mS);
    if (minutosTotales < 0) minutosTotales += 24 * 60;

    const horas = Math.floor(minutosTotales / 60);
    const minutos = minutosTotales % 60;
    return `${horas}h ${minutos.toString().padStart(2, '0')}m`;
}

/* ======================
    FUNCIÓN PARA MOSTRAR MENSAJE DE ERROR
====================== */
function mostrarError(mensaje, elementoContenedor) {
    const contenedor = document.querySelector(elementoContenedor);
    if (!contenedor) return;

    contenedor.innerHTML = `
        <div class="error">
            <p>${mensaje}</p>
            <button class="btn-reintentar">Reintentar</button>
        </div>`;
    
    contenedor.querySelector('.btn-reintentar').addEventListener('click', reintentarAccion);
}

/* ======================
    FUNCIONES AUXILIARES PARA PAGO
====================== */
function generarAsientos(cantidad) {
    const asientos = [];
    for (let i = 0; i < cantidad; i++) {
        const fila = Math.floor(Math.random() * 10) + 1;
        const letra = String.fromCharCode(65 + Math.floor(Math.random() * 4)); // A-D
        asientos.push(`${fila}${letra}`);
    }
    return asientos;
}

function generarNombreChoferAleatorio() {
    const nombres = ['Juan Pérez', 'María González', 'Carlos López', 'Ana Martínez', 'Pedro Sánchez'];
    return nombres[Math.floor(Math.random() * nombres.length)];
}

function formatearNumeroTarjeta(e) {
    let valor = e.target.value.replace(/\s/g, '');
    if (valor.length > 16) valor = valor.substring(0, 16);
    
    let formateado = '';
    for (let i = 0; i < valor.length; i++) {
        if (i > 0 && i % 4 === 0) formateado += ' ';
        formateado += valor[i];
    }
    
    e.target.value = formateado;
}

function formatearFechaExpiracion(e) {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 2) {
        valor = valor.substring(0, 2) + '/' + valor.substring(2, 4);
    }
    e.target.value = valor;
}

/* ======================
    FUNCIÓN PARA MOSTRAR EL MODAL DE PAGO
====================== */
function mostrarModalPago() {
    const modal = document.getElementById('modal-pago');
    if (!modal) return;
    
    modal.style.display = 'block';
    
    // Configurar evento para cerrar modal
    document.querySelector('.cerrar-modal').onclick = () => {
        modal.style.display = 'none';
    };
    
    // Configurar evento para cerrar al hacer clic fuera
    window.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };
    
    // Configurar validación del formulario de pago
    const formularioPago = document.getElementById('formulario-pago');
    if (formularioPago) {
        formularioPago.onsubmit = (e) => {
            e.preventDefault();
            if (validarPago()) {
                procesarPago();
            }
        };
    }
    
    // Formatear inputs de tarjeta
    const numeroTarjeta = document.getElementById('numero-tarjeta');
    const fechaExpiracion = document.getElementById('fecha-expiracion');
    
    if (numeroTarjeta) {
        numeroTarjeta.addEventListener('input', formatearNumeroTarjeta);
    }
    if (fechaExpiracion) {
        fechaExpiracion.addEventListener('input', formatearFechaExpiracion);
    }
}

/* ======================
    FUNCIÓN PARA VALIDAR EL PAGO
====================== */
function validarPago() {
    const nombre = document.getElementById('nombre-tarjeta')?.value.trim();
    const numero = document.getElementById('numero-tarjeta')?.value.replace(/\s/g, '');
    const fecha = document.getElementById('fecha-expiracion')?.value;
    const cvv = document.getElementById('cvv')?.value;
    const email = document.getElementById('email-pago')?.value.trim();
    const cantidadAsientos = document.getElementById('cantidad-asientos')?.value;
    
    // Validaciones básicas
    if (!nombre || nombre.length < 3) {
        alert('Por favor ingrese un nombre válido');
        return false;
    }
    
    if (!/^\d{16}$/.test(numero)) {
        alert('Por favor ingrese un número de tarjeta válido (16 dígitos)');
        return false;
    }
    
    if (!/^\d{2}\/\d{2}$/.test(fecha)) {
        alert('Por favor ingrese una fecha de expiración válida (MM/AA)');
        return false;
    }
    
    if (!/^\d{3}$/.test(cvv)) {
        alert('Por favor ingrese un CVV válido (3 dígitos)');
        return false;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert('Por favor ingrese un email válido');
        return false;
    }
    
    if (!cantidadAsientos || cantidadAsientos < 1) {
        alert('Por favor seleccione la cantidad de asientos');
        return false;
    }
    
    return true;
}

/* ======================
    FUNCIÓN PARA PROCESAR EL PAGO
====================== */
function procesarPago() {
    const cantidadAsientos = parseInt(document.getElementById('cantidad-asientos').value) || 1;
    const precioUnitario = parseFloat(viajeSeleccionado.precio);
    
    viajeSeleccionado.asientos = generarAsientos(cantidadAsientos);
    viajeSeleccionado.precioTotal = (precioUnitario * cantidadAsientos).toFixed(2);
    
    setTimeout(() => {
        document.getElementById('modal-pago').style.display = 'none';
        generarTicket();
    }, 1500);
}

/* ======================
    FUNCIÓN PARA GENERAR EL TICKET
====================== */
function generarTicket() {
    const modalTicket = document.getElementById('modal-ticket');
    const contenidoTicket = document.getElementById('contenido-ticket');
    if (!modalTicket || !contenidoTicket) return;
    
    // Obtener cantidad de asientos
    const cantidadAsientos = document.getElementById('cantidad-asientos')?.value || 1;
    const precioUnitario = parseFloat(viajeSeleccionado.precio);
    const precioTotal = (precioUnitario * cantidadAsientos).toFixed(2);
    
    // Generar número de reserva aleatorio
    const numeroReserva = 'RES-' + Math.floor(100000 + Math.random() * 900000);
    
    // Obtener fecha y hora actual
    const ahora = new Date();
    const fechaCompra = ahora.toLocaleDateString('es-MX', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
    const horaCompra = ahora.toLocaleTimeString('es-MX', {
        hour: '2-digit', minute: '2-digit'
    });
    
    // Generar HTML del ticket
    contenidoTicket.innerHTML = `
        <div class="ticket-header">
            <h3>BusTickets Xalapa</h3>
            <p>¡Gracias por tu compra!</p>
        </div>
        
        <div class="ticket-info">
            <div>
                <strong>Número de reserva:</strong>
                ${numeroReserva}
            </div>
            <div>
                <strong>Fecha de compra:</strong>
                ${fechaCompra} ${horaCompra}
            </div>
            <div>
                <strong>Destino:</strong>
                ${viajeSeleccionado?.destino || 'N/A'}
            </div>
            <div>
                <strong>Salida:</strong>
                ${viajeSeleccionado?.salida || 'N/A'}
            </div>
            <div>
                <strong>Llegada estimada:</strong>
                ${viajeSeleccionado?.llegada || 'N/A'}
            </div>
            <div>
                <strong>Duración:</strong>
                ${viajeSeleccionado?.duracion || 'N/A'}
            </div>
            <div>
                <strong>Tipo de autobús:</strong>
                ${viajeSeleccionado?.tipo || 'N/A'}
            </div>
            <div>
                <strong>Precio Total:</strong>
                $${precioTotal} MXN (${cantidadAsientos} asiento${cantidadAsientos > 1 ? 's' : ''})
            </div>
            <div>
                <strong>Chofer:</strong>
                ${viajeSeleccionado?.chofer || 'N/A'}
            </div>
            <div>
                <strong>Pasajero:</strong>
                ${document.getElementById('nombre-tarjeta')?.value || 'N/A'}
            </div>
        </div>
        
        <div class="ticket-asientos">
            <strong>Asientos asignados:</strong><br>
            ${viajeSeleccionado?.asientos?.join(', ') || 'N/A'}
        </div>
        
        <div class="ticket-footer">
            <p>Presenta este ticket al abordar el autobús</p>
            <p>Para cualquier duda, contacta a: contacto@busticketsxalapa.com</p>
        </div>
    `;
    
    // Mostrar modal de ticket
    modalTicket.style.display = 'block';
    
    // Configurar eventos para el modal de ticket
    document.getElementById('btn-cerrar-ticket')?.addEventListener('click', () => {
        modalTicket.style.display = 'none';
    });
    
    document.getElementById('btn-descargar-ticket')?.addEventListener('click', () => {
        descargarTicket(numeroReserva);
    });
    
    window.onclick = (e) => {
        if (e.target === modalTicket) {
            modalTicket.style.display = 'none';
        }
    };
}

/* ======================
    FUNCIÓN PARA DESCARGAR EL TICKET
====================== */
function descargarTicket(numeroReserva) {
    const contenido = document.getElementById('contenido-ticket')?.innerHTML;
    if (!contenido) return;

    const estilo = `
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
            .ticket-header { text-align: center; margin-bottom: 20px; border-bottom: 2px dashed #000; padding-bottom: 15px; }
            .ticket-header h3 { margin: 0; color: #b31c1c; font-size: 24px; }
            .ticket-info { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
            .ticket-info div { margin-bottom: 10px; }
            .ticket-info strong { display: block; margin-bottom: 5px; }
            .ticket-asientos { background: #f0f0f0; padding: 15px; text-align: center; margin: 15px 0; }
            .ticket-footer { text-align: center; margin-top: 20px; border-top: 2px dashed #000; padding-top: 15px; font-size: 14px; }
        </style>
    `;
    
    const ventana = window.open('', '_blank');
    ventana.document.write(`
        <html>
            <head>
                <title>Ticket ${numeroReserva}</title>
                ${estilo}
            </head>
            <body>
                ${contenido}
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                        }, 200);
                    };
                </script>
            </body>
        </html>
    `);
    ventana.document.close();
}