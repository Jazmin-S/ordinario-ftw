 # 🚌 BusTickets Xalapa

## 📌 Descripción del Proyecto

**BusTickets Xalapa** es una plataforma web diseñada para facilitar la venta de boletos de autobús en la ciudad de Xalapa, Veracruz. El sistema permite a los usuarios:

* Consultar rutas y horarios disponibles
* Filtrar viajes por destino
* Comprar boletos de forma segura
* Generar e imprimir tickets de compra
* Contactar al servicio al cliente

## 🗂️ Estructura del Proyecto

El proyecto está organizado en los siguientes archivos:

### 🔹 HTML

* `index.html`: Página principal con información de la empresa, destinos populares y características de los autobuses.
* `rutas.html`: Página con tabla de horarios y rutas disponibles, incluye sistema de filtrado.
* `contacto.html`: Formulario de contacto y mapa con ubicación física.

### 🎨 CSS

* `styles.css`: Estilos base comunes a todas las páginas.
* `index.css`: Estilos específicos para la página principal.
* `rutas.css`: Estilos dedicados a la página de rutas y horarios.
* `contacto.css`: Estilos para la página de contacto.

### 🧠 JavaScript

* `comun.js`: Funciones reutilizables (cálculo de duración, manejo de pagos, generación de tickets).
* `index.js`: Funciones para la página principal (carrusel, botones interactivos).
* `rutas.js`: Carga dinámica de rutas desde XML, filtrado de viajes y lógica de compra.
* `contacto.js`: Validación de formulario y envío de datos.

## ✨ Características Principales

1. **Sistema de Rutas y Horarios**

   * Carga dinámica desde archivo XML
   * Filtro por destino
   * Cálculo automático de duración del viaje

2. **Proceso de Compra de Boletos**

   * Selección de asientos
   * Validación de datos de pago
   * Generación de tickets personalizados
   * Opción para descarga en PDF

3. **Formulario de Contacto**

   * Validación en tiempo real
   * Notificaciones de éxito/error
   * Preferencia de contacto (correo o teléfono)

4. **Diseño Responsivo**

   * Adaptado a móviles, tablets y pantallas grandes
   * Uso de CSS Grid y Flexbox
   * Animaciones y transiciones suaves

5. **Accesibilidad Web**

   * Etiquetas ARIA para lectores de pantalla
   * Alto contraste para mejor legibilidad
   * Navegación accesible por teclado

## 🛠️ Tecnologías Utilizadas

* **HTML5** semántico
* **CSS3** (Grid, Flexbox, Variables, Animaciones)
* **JavaScript Vanilla (ES6+)**
* **Fetch API** para cargar datos desde XML
* **Font Awesome** para iconos
* **Google Fonts** (Poppins)

## 🚀 Instalación y Uso

1. Clona el repositorio:

   ```bash
   git clone https://github.com/Jazmin-S/ordinario-ftw.git
   ```

2. Abre cualquiera de los archivos HTML en tu navegador favorito:

   * `index.html` → Página principal
   * `rutas.html` → Consulta de horarios y compra de boletos
   * `contacto.html` → Envío de mensajes al servicio al cliente

## 💻 Requisitos del Sistema

* Navegador web moderno (Chrome, Firefox, Edge, Safari)
* Conexión a Internet (para cargar fuentes e iconos)

## 📄 Notas Adicionales

* El archivo `rutas-data.xml` debe estar presente en el mismo directorio para mostrar las rutas disponibles.
* Las funciones de pago son simuladas (no se realizan transacciones reales).
* Los tickets generados se pueden descargar como archivo PDF.

## 🔧 Mejoras Planeadas

* Autenticación de usuarios
* Sistema de reservas
* Integración con una API de pagos real
* Búsqueda avanzada de rutas
* Sección de promociones y descuentos


## 📘 Conclusión

Este proyecto fue desarrollado como parte del curso **Fundamentos de Tecnologías Web**, con el objetivo de crear páginas web accesibles para personas con discapacidad visual. A través de su construcción, aprendimos la importancia de implementar buenas prácticas de accesibilidad —como el uso de etiquetas semánticas, roles ARIA, navegación por teclado y alto contraste— para hacer que los sitios sean más inclusivos.

Además de adquirir habilidades técnicas, este proyecto nos permitió reflexionar sobre la necesidad de diseñar pensando en todos los usuarios, promoviendo una web más justa y empática. Crear accesibilidad no es solo una obligación técnica, sino un compromiso con la equidad digital.
