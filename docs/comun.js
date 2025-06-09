/* ======================
    FUNCIONES COMPARTIDAS
====================== */

// Variable global para almacenar el viaje que ha seleccionado el usuario
let viajeSeleccionado = null;

/* ======================
    FUNCIÓN PARA CALCULAR DURACIÓN ENTRE HORAS EN FORMATO HH:mm
====================== */
function calcularDuracion(salida, llegada) {
    const formatoHora = /^\d{2}:\d{2}$/; // Expresión regular para validar formato HH:mm
    if (!formatoHora.test(salida) || !formatoHora.test(llegada)) return 'N/A';

    const [hS, mS] = salida.split(':').map(Number); // Separar y convertir a número la hora de salida
    const [hL, mL] = llegada.split(':').map(Number); // Separar y convertir a número la hora de llegada

    // Validar que las horas y minutos estén en rango válido
    if (hS > 23 || mS > 59 || hL > 23 || mL > 59) return 'N/A';

    // Calcular minutos totales del viaje
    let minutosTotales = (hL * 60 + mL) - (hS * 60 + mS);
    if (minutosTotales < 0) minutosTotales += 24 * 60; // Ajuste para viajes que cruzan medianoche

    const horas = Math.floor(minutosTotales / 60);
    const minutos = minutosTotales % 60;
    return `${horas}h ${minutos.toString().padStart(2, '0')}m`;
}

/* ======================
    FUNCIÓN PARA MOSTRAR MENSAJE DE ERROR
====================== */
function mostrarError(mensaje, elementoContenedor) {
    const contenedor = document.querySelector(elementoContenedor); // Selecciona el contenedor por selector
    if (!contenedor) return;

    // Inserta mensaje de error con botón de reintento
    contenedor.innerHTML = `
        <div class="error">
            <p>${mensaje}</p>
            <button class="btn-reintentar">Reintentar</button>
        </div>`;
    
    // Asocia el evento al botón para volver a intentar la acción
    contenedor.querySelector('.btn-reintentar').addEventListener('click', reintentarAccion);
}

/* ======================
    FUNCIONES AUXILIARES PARA PAGO
====================== */

// Genera una cantidad de asientos aleatorios en formato fila + letra (ej. 3B)
function generarAsientos(cantidad) {
    const asientos = [];
    for (let i = 0; i < cantidad; i++) {
        const fila = Math.floor(Math.random() * 10) + 1;
        const letra = String.fromCharCode(65 + Math.floor(Math.random() * 4)); // Letras A-D
        asientos.push(`${fila}${letra}`);
    }
    return asientos;
}

// Genera un nombre de chofer aleatorio de una lista predefinida
function generarNombreChoferAleatorio() {
    const nombres = ['Juan Pérez', 'María González', 'Carlos López', 'Ana Martínez', 'Pedro Sánchez'];
    return nombres[Math.floor(Math.random() * nombres.length)];
}

// Formatea el número de tarjeta con espacios cada 4 dígitos
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

// Formatea la fecha de expiración como MM/AA
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

    // Cerrar el modal al hacer clic en la X
    document.querySelector('.cerrar-modal').onclick = () => {
        modal.style.display = 'none';
    };

    // Cerrar el modal al hacer clic fuera del contenido
    window.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Validar y procesar el pago al enviar el formulario
    const formularioPago = document.getElementById('formulario-pago');
    if (formularioPago) {
        formularioPago.onsubmit = (e) => {
            e.preventDefault();
            if (validarPago()) {
                procesarPago();
            }
        };
    }

    // Formatear campos de tarjeta y expiración en tiempo real
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
    // Obtener datos del formulario
    const nombre = document.getElementById('nombre-tarjeta')?.value.trim();
    const numero = document.getElementById('numero-tarjeta')?.value.replace(/\s/g, '');
    const fecha = document.getElementById('fecha-expiracion')?.value;
    const cvv = document.getElementById('cvv')?.value;
    const email = document.getElementById('email-pago')?.value.trim();
    const cantidadAsientos = document.getElementById('cantidad-asientos')?.value;

    // Validaciones básicas con alertas
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

    // Generar y asignar asientos aleatorios al viaje
    viajeSeleccionado.asientos = generarAsientos(cantidadAsientos);
    viajeSeleccionado.precioTotal = (precioUnitario * cantidadAsientos).toFixed(2);

    // Esperar un momento y luego mostrar el ticket
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

    const cantidadAsientos = document.getElementById('cantidad-asientos')?.value || 1;
    const precioUnitario = parseFloat(viajeSeleccionado.precio);
    const precioTotal = (precioUnitario * cantidadAsientos).toFixed(2);

    const numeroReserva = 'RES-' + Math.floor(100000 + Math.random() * 900000);

    const ahora = new Date();
    const fechaCompra = ahora.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const horaCompra = ahora.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

    // Crear HTML para mostrar los detalles del ticket
    contenidoTicket.innerHTML = `
        <div class="ticket-header">
            <h3>BusTickets Xalapa</h3>
            <p>¡Gracias por tu compra!</p>
        </div>
        
        <div class="ticket-info">
            <div><strong>Número de reserva:</strong>${numeroReserva}</div>
            <div><strong>Fecha de compra:</strong>${fechaCompra} ${horaCompra}</div>
            <div><strong>Destino:</strong>${viajeSeleccionado?.destino || 'N/A'}</div>
            <div><strong>Salida:</strong>${viajeSeleccionado?.salida || 'N/A'}</div>
            <div><strong>Llegada estimada:</strong>${viajeSeleccionado?.llegada || 'N/A'}</div>
            <div><strong>Duración:</strong>${viajeSeleccionado?.duracion || 'N/A'}</div>
            <div><strong>Tipo de autobús:</strong>${viajeSeleccionado?.tipo || 'N/A'}</div>
            <div><strong>Precio Total:</strong>$${precioTotal} MXN (${cantidadAsientos} asiento${cantidadAsientos > 1 ? 's' : ''})</div>
            <div><strong>Chofer:</strong>${viajeSeleccionado?.chofer || 'N/A'}</div>
            <div><strong>Pasajero:</strong>${document.getElementById('nombre-tarjeta')?.value || 'N/A'}</div>
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

    modalTicket.style.display = 'block';

    // Evento para cerrar el modal del ticket
    document.getElementById('btn-cerrar-ticket')?.addEventListener('click', () => {
        modalTicket.style.display = 'none';
    });

    // Evento para descargar el ticket
    document.getElementById('btn-descargar-ticket')?.addEventListener('click', () => {
        descargarTicket(numeroReserva);
    });

    // Cerrar modal al hacer clic fuera
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

    // Estilo básico para el documento impreso
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

    // Crear nueva ventana para imprimir
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
