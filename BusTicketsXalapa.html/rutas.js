/* ======================
    INICIALIZACIÓN PÁGINA DE RUTAS
====================== */
document.addEventListener('DOMContentLoaded', () => {
    cargarRutas('todos');
    configurarFiltroRutas();
});

/* ======================
    FUNCIÓN PARA CARGAR Y MOSTRAR RUTAS DESDE XML
====================== */
function cargarRutas(destino) {
    console.log(`Cargando rutas para destino: ${destino}`);

    fetch('./rutas-data.xml')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            return response.text();
        })
        .then(xmlText => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");

            const parseError = xmlDoc.querySelector('parsererror');
            if (parseError) throw new Error('Error al parsear XML');

            const rutasNodes = xmlDoc.querySelectorAll('ruta');
            const rutas = Array.from(rutasNodes).map(ruta => {
                const destinoRuta = ruta.querySelector('destino')?.textContent || 'N/A';
                const salida = ruta.querySelector('salida')?.textContent || 'N/A';
                const llegada = ruta.querySelector('llegada')?.textContent || 'N/A';
                const precio = ruta.querySelector('precio')?.textContent || 'N/A';
                const tipo = ruta.querySelector('tipo')?.textContent || 'N/A';

                return {
                    destino: destinoRuta,
                    salida,
                    llegada,
                    precio,
                    tipo,
                    duracion: calcularDuracion(salida, llegada)
                };
            });

            const rutasFiltradas = destino.toLowerCase() === 'todos'
                ? rutas
                : rutas.filter(r => r.destino.toLowerCase().includes(destino.toLowerCase()));

            mostrarRutasEnTabla(rutasFiltradas);
        })
        .catch(error => {
            console.error('Error al cargar las rutas:', error);
            mostrarError('No se pudieron cargar las rutas. Intenta más tarde.', '.tabla-rutas-container');
        });
}

/* ======================
    FUNCIÓN PARA MOSTRAR RUTAS EN LA TABLA
====================== */
function mostrarRutasEnTabla(rutas) {
    const cuerpoTabla = document.getElementById('cuerpo-tabla');
    if (!cuerpoTabla) return;

    cuerpoTabla.innerHTML = '';

    if (rutas.length === 0) {
        cuerpoTabla.innerHTML = `
            <tr>
                <td colspan="7" class="no-rutas">No se encontraron rutas disponibles.</td>
            </tr>`;
        return;
    }

    rutas.forEach((ruta, i) => {
        const fila = document.createElement('tr');
        fila.className = i % 2 === 0 ? 'fila-par' : 'fila-impar';

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

        cuerpoTabla.appendChild(fila);
    });

    configurarBotonesCompraTabla();
}

/* ======================
    FUNCIÓN PARA CONFIGURAR FILTRO DE RUTAS
====================== */
function configurarFiltroRutas() {
    const formFiltro = document.getElementById('filtro-rutas');
    if (!formFiltro) return;

    formFiltro.addEventListener('submit', e => {
        e.preventDefault();
        const destino = document.getElementById('destino')?.value || 'todos';
        cargarRutas(destino);
    });
}

/* ======================
    FUNCIÓN PARA CONFIGURAR BOTONES DE COMPRA EN TABLA
====================== */
function configurarBotonesCompraTabla() {
    document.querySelectorAll('.btn-comprar').forEach(btn => {
        btn.addEventListener('click', e => {
            const b = e.currentTarget;
            viajeSeleccionado = {
                destino: b.dataset.destino,
                salida: b.dataset.salida,
                llegada: b.dataset.llegada,
                duracion: b.dataset.duracion,
                precio: b.dataset.precio,
                tipo: b.dataset.tipo,
                chofer: generarNombreChoferAleatorio()
            };
            mostrarModalPago();
        });
    });
}

/* ======================
    FUNCIÓN PARA REINTENTAR CARGA
====================== */
function reintentarAccion() {
    const destinoInput = document.getElementById('destino');
    const destino = destinoInput ? destinoInput.value : 'todos';
    cargarRutas(destino);
}