/* ======================
    INICIALIZACIÓN PÁGINA DE RUTAS
====================== */
// Espera que el DOM esté listo para ejecutar las funciones de carga y filtro de rutas
document.addEventListener('DOMContentLoaded', () => {
    cargarRutas('todos');        // Carga todas las rutas inicialmente
    configurarFiltroRutas();     // Configura el filtro para buscar rutas
});

/* ======================
    FUNCIÓN PARA CARGAR Y MOSTRAR RUTAS DESDE XML
====================== */
function cargarRutas(destino) {
    console.log(`Cargando rutas para destino: ${destino}`);

    // Realiza una petición para obtener el archivo XML con datos de rutas
    fetch('./rutas-data.xml')
        .then(response => {
            // Verifica si la respuesta es correcta, si no lanza error
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            return response.text(); // Extrae el contenido como texto
        })
        .then(xmlText => {
            // Parsea el texto XML en un documento XML manipulable
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");

            // Comprueba si hubo error en el parseo del XML
            const parseError = xmlDoc.querySelector('parsererror');
            if (parseError) throw new Error('Error al parsear XML');

            // Obtiene todos los nodos <ruta> del XML
            const rutasNodes = xmlDoc.querySelectorAll('ruta');

            // Convierte los nodos en objetos JavaScript con los datos que nos interesan
            const rutas = Array.from(rutasNodes).map(ruta => {
                const destinoRuta = ruta.querySelector('destino')?.textContent || 'N/A';
                const salida = ruta.querySelector('salida')?.textContent || 'N/A';
                const llegada = ruta.querySelector('llegada')?.textContent || 'N/A';
                const precio = ruta.querySelector('precio')?.textContent || 'N/A';
                const tipo = ruta.querySelector('tipo')?.textContent || 'N/A';

                // Calcula duración entre hora salida y llegada (función externa)
                return {
                    destino: destinoRuta,
                    salida,
                    llegada,
                    precio,
                    tipo,
                    duracion: calcularDuracion(salida, llegada)
                };
            });

            // Filtra rutas según el destino solicitado o muestra todas si es 'todos'
            const rutasFiltradas = destino.toLowerCase() === 'todos'
                ? rutas
                : rutas.filter(r => r.destino.toLowerCase().includes(destino.toLowerCase()));

            // Muestra las rutas filtradas en la tabla
            mostrarRutasEnTabla(rutasFiltradas);
        })
        .catch(error => {
            // En caso de error, muestra mensaje en consola y en la UI
            console.error('Error al cargar las rutas:', error);
            mostrarError('No se pudieron cargar las rutas. Intenta más tarde.', '.tabla-rutas-container');
        });
}

/* ======================
    FUNCIÓN PARA MOSTRAR RUTAS EN LA TABLA
====================== */
function mostrarRutasEnTabla(rutas) {
    const cuerpoTabla = document.getElementById('cuerpo-tabla');
    if (!cuerpoTabla) return; // Si no existe la tabla, no hace nada

    cuerpoTabla.innerHTML = ''; // Limpia contenido previo

    if (rutas.length === 0) {
        // Si no hay rutas, muestra mensaje indicando que no se encontraron
        cuerpoTabla.innerHTML = `
            <tr>
                <td colspan="7" class="no-rutas">No se encontraron rutas disponibles.</td>
            </tr>`;
        return;
    }

    // Por cada ruta crea una fila con sus datos y botón de compra
    rutas.forEach((ruta, i) => {
        const fila = document.createElement('tr');
        // Aplica clase para estilos alternados (filas pares e impares)
        fila.className = i % 2 === 0 ? 'fila-par' : 'fila-impar';

        // Contenido de la fila con los datos y atributos para el botón comprar
        fila.innerHTML = `
            <td>${ruta.destino}</td>
            <td>${ruta.salida}</td>
            <td>${ruta.llegada}</td>
            <td>${ruta.duracion}</td>
            <td>$${ruta.precio}</td>
            <td>${ruta.tipo}</td>
            <td>
                <button class="btn-comprar" aria-label="Comprar boleto para ${ruta.destino}" 
                    data-destino="${ruta.destino}" 
                    data-salida="${ruta.salida}"
                    data-llegada="${ruta.llegada}"
                    data-duracion="${ruta.duracion}"
                    data-precio="${ruta.precio}"
                    data-tipo="${ruta.tipo}">
                    Comprar
                </button>
            </td>`;

        // Agrega la fila a la tabla
        cuerpoTabla.appendChild(fila);
    });

    // Configura eventos para los botones de compra recién creados
    configurarBotonesCompraTabla();
}

/* ======================
    FUNCIÓN PARA CONFIGURAR FILTRO DE RUTAS
====================== */
function configurarFiltroRutas() {
    const formFiltro = document.getElementById('filtro-rutas');
    if (!formFiltro) return; // Si no existe formulario, no hace nada

    // Escucha el evento submit para filtrar rutas sin recargar la página
    formFiltro.addEventListener('submit', e => {
        e.preventDefault(); // Previene comportamiento predeterminado (recarga)

        // Obtiene el valor del campo destino o 'todos' por defecto
        const destino = document.getElementById('destino')?.value || 'todos';

/* ======================
    FUNCIÓN PARA MOSTRAR EL MODAL DE PAGO
====================== */
function mostrarModalPago() {
    const modalPago = document.getElementById('modal-pago');
    const formPago = document.getElementById('formulario-pago');
    const primerCampo = formPago.querySelector('input, select, button'); // Primer elemento enfocable
    
    // Mostrar el modal
    modalPago.style.display = 'block';
    
    // Configurar accesibilidad
    modalPago.setAttribute('aria-hidden', 'false');
    document.querySelector('main').setAttribute('aria-hidden', 'true');
    
    // Mover el foco al primer campo del formulario
    setTimeout(() => {
        primerCampo.focus();
    }, 100);
    
    // Atrapar el foco dentro del modal
    modalPago.addEventListener('keydown', trapFocus);
}

/* ======================
    FUNCIÓN PARA CERRAR EL MODAL DE PAGO
====================== */
function cerrarModalPago() {
    const modalPago = document.getElementById('modal-pago');
    
    // Ocultar el modal
    modalPago.style.display = 'none';
    
    // Restaurar accesibilidad
    modalPago.setAttribute('aria-hidden', 'true');
    document.querySelector('main').setAttribute('aria-hidden', 'false');
    
    // Devolver el foco al botón que abrió el modal
    const botonComprar = document.activeElement.closest('.btn-comprar');
    if (botonComprar) {
        botonComprar.focus();
    }
    
    // Remover el event listener de atrapar foco
    modalPago.removeEventListener('keydown', trapFocus);
}

/* ======================
    FUNCIÓN PARA ATRAPAR EL FOCO DENTRO DEL MODAL
====================== */
function trapFocus(e) {
    const modalPago = document.getElementById('modal-pago');
    if (modalPago.style.display !== 'block') return;
    
    const focusableElements = modalPago.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
    
    if (e.key === 'Escape') {
        cerrarModalPago();
    }
}

/* ======================
    CONFIGURACIÓN DE EVENTOS PARA EL MODAL
====================== */
document.addEventListener('DOMContentLoaded', function() {
    // Configurar botones de compra
    document.querySelectorAll('.btn-comprar').forEach(btn => {
        btn.addEventListener('click', function() {
            mostrarModalPago();
        });
    });
    
    // Configurar botón de cerrar
    document.querySelector('#modal-pago .cerrar-modal').addEventListener('click', cerrarModalPago);
    
    // Cerrar al hacer clic fuera del contenido
    document.getElementById('modal-pago').addEventListener('click', function(e) {
        if (e.target === this) {
            cerrarModalPago();
        }
    });
});        // Carga rutas filtradas según el destino ingresado
        cargarRutas(destino);
    });
}

/* ======================
    FUNCIÓN PARA CONFIGURAR BOTONES DE COMPRA EN TABLA
====================== */
function configurarBotonesCompraTabla() {
    // Selecciona todos los botones de comprar
    document.querySelectorAll('.btn-comprar').forEach(btn => {
        // Añade evento click a cada botón
        btn.addEventListener('click', e => {
            const b = e.currentTarget;

            // Guarda la información del viaje seleccionado usando los atributos data-*
            viajeSeleccionado = {
                destino: b.dataset.destino,
                salida: b.dataset.salida,
                llegada: b.dataset.llegada,
                duracion: b.dataset.duracion,
                precio: b.dataset.precio,
                tipo: b.dataset.tipo,
                chofer: generarNombreChoferAleatorio() // Asigna nombre de chofer aleatorio (función externa)
            };

            // Muestra el modal para realizar el pago
            mostrarModalPago();
        });
    });
}

/* ======================
    FUNCIÓN PARA REINTENTAR CARGA
====================== */
function reintentarAccion() {
    // Obtiene el valor actual del filtro destino
    const destinoInput = document.getElementById('destino');
    const destino = destinoInput ? destinoInput.value : 'todos';

    // Vuelve a cargar las rutas usando el valor actual o 'todos' si no hay valor
    cargarRutas(destino);
}
function mostrarModalTicket(infoTicket) {
    const modal = document.getElementById('modal-ticket');
    const contenidoTicket = document.getElementById('contenido-ticket');
    const contenidoPrincipal = document.getElementById('contenido-principal');

    // Oculta el contenido principal para lectores de pantalla
    contenidoPrincipal.setAttribute('aria-hidden', 'true');

    // Muestra el modal
    modal.hidden = false;

    // Inserta el contenido del ticket en formato accesible
    contenidoTicket.innerHTML = `
        <p><strong>Destino:</strong> ${infoTicket.destino}</p>
        <p><strong>Salida:</strong> ${infoTicket.salida}</p>
        <p><strong>Llegada:</strong> ${infoTicket.llegada}</p>
        <p><strong>Duración:</strong> ${infoTicket.duracion}</p>
        <p><strong>Precio:</strong> $${infoTicket.precio}</p>
        <p><strong>Tipo:</strong> ${infoTicket.tipo}</p>
        <p><strong>Chofer:</strong> ${infoTicket.chofer}</p>
    `;

    // Espera un instante para asegurar que el contenido se ha renderizado
    setTimeout(() => {
        contenidoTicket.focus(); // Mueve el foco al contenido del ticket
    }, 100);
}

function cerrarModalTicket() {
    const modal = document.getElementById('modal-ticket');
    const contenidoPrincipal = document.getElementById('contenido-principal');

    // Oculta el modal
    modal.hidden = true;

    // Restaura la visibilidad del contenido principal para lectores
    contenidoPrincipal.removeAttribute('aria-hidden');

    // Devuelve el foco a un elemento lógico (por ejemplo, el campo de destino)
    const destinoInput = document.getElementById('destino');
    if (destinoInput) destinoInput.focus();
}
// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar todos los botones "Comprar"
    const botonesComprar = document.querySelectorAll('.btn-comprar');
    const modalPago = document.getElementById('modal-pago');
    const cerrarModal = document.querySelector('#modal-pago .cerrar-modal');

    // Abrir modal al hacer clic en "Comprar"
    botonesComprar.forEach(boton => {
        boton.addEventListener('click', function() {
            // Mostrar el modal
            modalPago.style.display = 'block';

            // Mover el foco al botón de cerrar (accesibilidad)
            cerrarModal.focus();

            // Opcional: Rellenar datos del boleto en el modal (ej: destino, precio)
            const destino = boton.getAttribute('data-destino');
            const precio = boton.getAttribute('data-precio');
            // ... (puedes actualizar campos del formulario aquí)
        });
    });

    // Cerrar modal al hacer clic en la "X"
    cerrarModal.addEventListener('click', function() {
        modalPago.style.display = 'none';
    });

    // Cerrar modal al hacer clic fuera del contenido
    modalPago.addEventListener('click', function(e) {
        if (e.target === modalPago) {
            modalPago.style.display = 'none';
        }
    });

    // Atrapar el foco dentro del modal (accesibilidad)
    modalPago.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modalPago.style.display = 'none';
        }

    });
});
