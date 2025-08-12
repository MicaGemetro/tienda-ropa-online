// Función para mostrar/ocultar el menú desplegable (redes)
function toggleDropdown() {
  const menu = document.getElementById('menu-redes');
  menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

document.addEventListener("click", function (event) {
  const logoRedes = document.querySelector('.logo-redes');
  const menu = document.querySelector('.dropdown-menu-custom');

  // Verifica si el clic ocurrió fuera del logo o del menú
  if (!menu.contains(event.target) && !logoRedes.contains(event.target)) {
    menu.style.display = 'none';
  }
});




// para el desplegable de buscar (de la barra de navegacion)
// Selección de elementos
const buscarDesplegable = document.getElementById('buscar-desplegable');
const contenidoBusqueda = document.getElementById('contenido-busqueda');

// Abrir o cerrar el box
buscarDesplegable.addEventListener('click', (e) => {
    e.stopPropagation(); // Previene que el clic se propague
    contenidoBusqueda.classList.toggle('active');
});

// Cerrar al hacer clic fuera
document.addEventListener('click', (e) => {
    if (!contenidoBusqueda.contains(e.target) && !buscarDesplegable.contains(e.target)) {
        contenidoBusqueda.classList.remove('active');
    }
});



//estilo de los selectores en busqueda
document.querySelectorAll('select').forEach((select) => {
    select.addEventListener('change', () => {
        if (select.value === "") {
            select.style.color = "#aaa";
        } else {
            select.style.color = "#000";
        }
    });
});


// Función para agregar productos al carrito
function agregarAlCarrito() {
    // Obtener datos del producto seleccionado
    const nombre = document.querySelector(".nom-pantalon").textContent;
    const precioUnitario = parseFloat(document.querySelector(".precio").textContent.replace("$", "").replace(",", ""));
    const cantidad = parseInt(document.getElementById("cantidad").textContent, 10);
    
    // Verificar si se ha seleccionado un talle
    const talleSeleccionado = document.querySelector(".talles .talle.seleccionado")?.dataset.talle;

    // Si no se seleccionó talle, mostrar un mensaje de alerta
    if (!talleSeleccionado) {
        Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'Debes seleccionar un talle para poder agregar al carrito.',
            confirmButtonText: 'Aceptar'
        });
        return; // Salir de la función sin agregar el producto
    }

    const colorSeleccionado = document.querySelector(".colores .color.seleccionado")?.dataset.color || "Sin color";
    const imagen = document.getElementById("imagen-grande").src;

    // Crear objeto del producto
    const producto = {
        nombre,
        precioUnitario,
        cantidad,
        talle: talleSeleccionado,
        color: colorSeleccionado,
        imagen
    };

    // Recuperar carrito actual de LocalStorage
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Buscar si ya existe el producto con mismas características
    const productoExistente = carrito.find(p =>
        p.nombre === producto.nombre &&
        p.talle === producto.talle &&
        p.color === producto.color
    );

    if (productoExistente) {
        // Si ya existe, incrementar cantidad y actualizar precio total
        productoExistente.cantidad += producto.cantidad;
        productoExistente.precioTotal = productoExistente.cantidad * productoExistente.precioUnitario;
    } else {
        // Si no existe, agregar nuevo producto con precio total inicial
        producto.precioTotal = producto.cantidad * producto.precioUnitario;
        carrito.push(producto);
    }

    // Guardar carrito actualizado en LocalStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Mostrar una alerta de éxito con SweetAlert
    Swal.fire({
        icon: 'success',
        title: '¡Producto agregado!',
        text: `${producto.nombre} ha sido agregado al carrito.`,
        confirmButtonText: 'Aceptar'
    });

    // Actualizar visualización del carrito en la página
    mostrarCarrito();
}



// Función para mostrar los productos en el carrito
function mostrarCarrito() {
    const cartItemsContainer = document.getElementById("cartItems");
    cartItemsContainer.innerHTML = ""; // Limpiar contenido previo

    // Recuperar carrito de LocalStorage
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    carrito.forEach((producto, index) => {
        const itemHTML = `
            <div class="cart-item" data-index="${index}">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="cart-item-img">
                <div class="cart-item-info">
                    <h5>${producto.nombre}</h5>
                    <p>Color: ${producto.color}</p>
                    <p>Talle: ${producto.talle}</p>
                    <p>Cantidad: ${producto.cantidad}</p>
                    <p><strong>Precio total: $${producto.precioTotal.toFixed(2)}</strong></p>
                </div>
                <button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        cartItemsContainer.innerHTML += itemHTML;
    });
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Obtener el producto a eliminar
    const productoEliminado = carrito[index];

    // Mostrar alerta de confirmación
    Swal.fire({
        icon: "warning",
        title: "¿Estás seguro?",
        text: `Vas a eliminar ${productoEliminado.nombre} del carrito.`,
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            // Eliminar el producto
            carrito.splice(index, 1);

            // Guardar los cambios en el carrito
            localStorage.setItem("carrito", JSON.stringify(carrito));

            // Mostrar alerta de producto eliminado
            Swal.fire({
                icon: "success",
                title: "Producto eliminado",
                text: `${productoEliminado.nombre} ha sido eliminado del carrito.`,
                confirmButtonText: "Aceptar",
            });

            // Refrescar la visualización del carrito
            mostrarCarrito();
        }
    });
}

// Inicializar el carrito al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    mostrarCarrito();
});






// funcion para pagar lo del contenido del carrito
document.getElementById("pagar").addEventListener("click", function () {
    // Obtener el carrito desde el localStorage
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Calcular el monto total
    let montoTotal = carrito.reduce((total, producto) => total + (producto.precioUnitario * producto.cantidad), 0);

    if (carrito.length > 0) {
        // Mostrar alerta de confirmación antes de proceder al pago
        Swal.fire({
            title: "¿Desea pagar el contenido del carrito?",
            text: `El monto total es de $${montoTotal.toFixed(2)}`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Pagar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                // Mostrar alerta de pago exitoso
                Swal.fire({
                    icon: "success",
                    title: "¡Pago realizado con éxito!",
                    text: `El monto total fue de $${montoTotal.toFixed(2)}`,
                    confirmButtonText: "Aceptar",
                }).then(() => {
                    // Vaciar el carrito
                    localStorage.removeItem("carrito");

                    // Actualizar la vista del carrito
                    mostrarCarrito(); // Asegúrate de tener esta función definida para actualizar la lista del carrito
                });
            }
        });
    } else {
        // Mostrar alerta si el carrito está vacío
        Swal.fire({
            icon: "info",
            title: "Carrito vacío",
            text: "No hay productos en el carrito para pagar.",
            confirmButtonText: "Aceptar",
        });
    }
});




// Función principal: agregar producto al carrito desde la tarjeta
function agregarAlCarritoDesdeTarjeta(btn) {
    const tarjeta = btn.closest(".product-card");
    const nombre = tarjeta.querySelector(".product-brand").textContent;
    
    const precioTexto = tarjeta.querySelector(".price").textContent;
    const precioLimpio = precioTexto.replace("$", "").replace(/\./g, "").replace(",", ".");
    const precioUnitario = parseFloat(precioLimpio);

    const imagen = tarjeta.querySelector(".product-thumb").src;

    console.log("Precio procesado:", precioUnitario);


    // Mostrar modal para seleccionar talle
    const modal = document.getElementById("modal-talle");
    modal.style.display = "flex";

    const overlayTalle = document.getElementById("overlay-talle");
    overlayTalle.style.display = "flex";

    // Asignar función al botón de confirmar talle
    document.getElementById("confirmar-talle").onclick = function () {
        const talleSeleccionado = document.getElementById("select-talle").value;

        // Validar si se seleccionó un talle
        if (!talleSeleccionado) {
            // Mostrar advertencia con SweetAlert
            Swal.fire({
                icon: "warning",
                title: "Talle no seleccionado",
                text: "Por favor, selecciona un talle antes de confirmar.",
                confirmButtonText: "Aceptar",
            });
            return;
        }

        // Crear objeto del producto
        const producto = {
            nombre,
            precioUnitario,
            cantidad: 1,
            imagen,
            color: "negro", // Cambiar si tienes colores
            talle: talleSeleccionado,
        };

        // Recuperar el carrito del LocalStorage
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

        // Buscar si ya existe el producto en el carrito
        const productoExistente = carrito.find(
            (p) =>
                p.nombre === producto.nombre &&
                p.color === producto.color &&
                p.talle === producto.talle
        );

        if (productoExistente) {
            // Incrementar la cantidad si el producto ya está en el carrito
            productoExistente.cantidad += 1;
            productoExistente.precioTotal = productoExistente.cantidad * productoExistente.precioUnitario;
        } else {
            // Agregar nuevo producto
            producto.precioTotal = producto.precioUnitario;
            carrito.push(producto);
        }

        // Guardar carrito actualizado en LocalStorage
        localStorage.setItem("carrito", JSON.stringify(carrito));

        // Cerrar el modal
        modal.style.display = "none";
        overlayTalle.style.display = "none";

        // Mostrar confirmación
        Swal.fire({
            icon: "success",
            title: "¡Producto agregado!",
            text: `${producto.nombre} ha sido agregado al carrito.`,
            confirmButtonText: "Aceptar",
        });

        // Actualizar la vista del carrito
        mostrarCarrito();
    };

    // Botón para cerrar el modal
    document.getElementById("cerrar-modal").onclick = function () {
        modal.style.display = "none";
        overlayTalle.style.display = "none";
    };
}

// Función para cerrar el modal
function cerrarModalTalle() {
    document.getElementById("modal-talle").style.display = "none";
    document.getElementById("overlay-talle").style.display = "none";
}

// Función para confirmar el talle seleccionado y agregarlo al carrito
function confirmarTalle() {
    const selectTalle = document.getElementById("select-talle");
    const talleSeleccionado = selectTalle.value;

    if (talleSeleccionado) {
        const producto = {
            nombre: productoSeleccionado.nombre,
            precio: productoSeleccionado.precio,
            talle: talleSeleccionado,
            color: productoSeleccionado.color, // Agregar color si aplica
            cantidad: 1,
        };

        // Verificar si ya existe el producto en el carrito
        const productoExistente = carrito.find(
            (item) =>
                item.nombre === producto.nombre &&
                item.talle === producto.talle &&
                item.color === producto.color &&
                item.precio === producto.precio
        );

        if (productoExistente) {
            // Si existe, incrementar cantidad y actualizar precio total
            productoExistente.cantidad++;
        } else {
            // Si no existe, agregarlo al carrito
            carrito.push(producto);
        }

        // Actualizar la lista del carrito
        actualizarCarrito();

        // Cerrar el modal
        cerrarModalTalle();

        // Resetear el selector de talle
        selectTalle.value = "";
    } else {
        // Mostrar advertencia con SweetAlert si no se selecciona un talle
        Swal.fire({
            icon: "warning",
            title: "Talle no seleccionado",
            text: "Por favor, selecciona un talle antes de continuar.",
            confirmButtonText: "Aceptar",
        });
    }
}

// Función para actualizar el contenido del carrito
function actualizarCarrito() {
    const carritoLista = document.getElementById("carrito-lista");
    carritoLista.innerHTML = ""; // Limpiar la lista actual del carrito

    carrito.forEach((producto) => {
        const li = document.createElement("li");
        li.textContent = `${producto.nombre} - Talle: ${producto.talle} - Color: ${producto.color} - Cantidad: ${producto.cantidad} - Precio: $${producto.precio * producto.cantidad}`;
        carritoLista.appendChild(li);
    });
}

// Asignar eventos a los botones de los productos
document.querySelectorAll(".agregar-carrito").forEach((boton) => {
    boton.addEventListener("click", () => agregarAlCarritoDesdeTarjeta(boton));
});





// funcion para el selector de la eleccion del talle
document.querySelectorAll('select').forEach((select) => {
    // Establecer color inicial para el placeholder
    if (select.value === "") {
        select.style.color = "#aaa";
    } else {
        select.style.color = "#000";
    }

    // Cambiar el color dinámicamente cuando se seleccione algo
    select.addEventListener('change', () => {
        if (select.value === "") {
            select.style.color = "#aaa"; // Placeholder (gris claro)
        } else {
            select.style.color = "#000"; // Opciones seleccionadas (negro)
        }
    });
});







// Variables para almacenar el estado actual
let currentFontSize = localStorage.getItem("fontSize") || "normal";
let currentContrast = localStorage.getItem("contrast") || "low";

document.addEventListener("DOMContentLoaded", () => {
    const savedFontSize = localStorage.getItem("fontSize") || "normal";
    const savedContrast = localStorage.getItem("contrast") || "low";

    // Aplicar configuraciones iniciales
    applyFontSize(savedFontSize);
    applyContrast(savedContrast);

    // Marcar opciones seleccionadas en el modal
    markSelectedOptions(savedFontSize, savedContrast);
});


// Función para aplicar el tamaño de letra
function applyFontSize(size) {
    document.body.classList.remove("font-normal", "font-large");
    document.body.classList.add(`font-${size}`);
}

// Función para aplicar el contraste
function applyContrast(level) {
    document.body.classList.remove("low-contrast", "high-contrast");
    document.body.classList.add(`${level}-contrast`);

    // Cambiar la imagen de fondo si corresponde
    if (level === "high") {
        document.body.style.backgroundImage = "url('fondo-contraste.jpg')";
    } else {
        document.body.style.backgroundImage = "url('fondo-con-opacidad.jpg')";
    }

    // Cambiar estilo específico de cada modal
    styleCartModal(level);
    styleConfigModal(level);
    styleTalleModal(level);

}

// Función para aplicar estilos al modal de carrito
function styleCartModal(level) {
    const cartModal = document.getElementById("contenido-carrito");
    if (cartModal) {
        if (level === "high") {
            cartModal.style.backgroundColor = "#000";
            cartModal.style.color = "#000";
            cartModal.style.border = "3px solid #959595";
        } else {
            cartModal.style.backgroundColor = "#003366";
            cartModal.style.color = "#000";
            cartModal.style.border = "2px solid #fff";
        }
    }
}

// Función para aplicar estilos al modal de configuración
function styleConfigModal(level) {
    const configModal = document.getElementById("contenido-config");
    if (configModal) {
        if (level === "high") {
            configModal.style.backgroundColor = "#000";
            configModal.style.color = "#000";
            configModal.style.border = "3px solid #959595";
        } else {
            configModal.style.backgroundColor = "#003366";
            configModal.style.color = "#000";
            configModal.style.border = "2px solid #fff";
        }
    }
}

// Función para aplicar estilos al modal de talles
function styleTalleModal(level) {
    const talleModal = document.getElementById("modal-talle");
    if (talleModal) {
        if (level === "high") {
            talleModal.style.backgroundColor = "#000";
            talleModal.style.color = "#fff";
            talleModal.style.border = "3px solid #959595";
        } else {
            talleModal.style.backgroundColor = "#003366";
            talleModal.style.color = "#fff";
            talleModal.style.border = "2px solid #fff";
        }
    }
}



// Función para marcar opciones seleccionadas en el modal
function markSelectedOptions(fontSize, contrast) {
    // Tamaño de letra
    document.querySelectorAll(".font-size-btn").forEach(btn => {
        btn.classList.remove("active");
        if (btn.dataset.size === fontSize) {
            btn.classList.add("active");
        }
    });

    // Contraste
    document.querySelectorAll(".contrast-btn").forEach(btn => {
        btn.classList.remove("active");
        if (btn.dataset.contrast === contrast) {
            btn.classList.add("active");
        }
    });
}





// Al abrir el modal, sincroniza las opciones seleccionadas con el estado actual
document.getElementById("configModal").addEventListener("show.bs.modal", () => {
    // Actualiza las variables actuales con los valores de localStorage
    currentFontSize = localStorage.getItem("fontSize") || "medium";
    currentContrast = localStorage.getItem("contrast") || "low";

    // Sincroniza las opciones en el modal
    markSelectedOptions(currentFontSize, currentContrast);
});

// Función para guardar cambios
document.getElementById("guardar").addEventListener("click", () => {
    const fontSizeChanged = currentFontSize !== localStorage.getItem("fontSize");
    const contrastChanged = currentContrast !== localStorage.getItem("contrast");

    if (fontSizeChanged || contrastChanged) {
        // Guardar los valores nuevos
        localStorage.setItem("fontSize", currentFontSize);
        localStorage.setItem("contrast", currentContrast);

        // Aplicar los cambios visuales
        applyFontSize(currentFontSize);
        applyContrast(currentContrast);

        // Mostrar alerta de éxito
        Swal.fire({
            title: "Cambios aplicados correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
        }).then(() => {
            const modal = bootstrap.Modal.getInstance(document.getElementById("configModal"));
            modal.hide();
        });
    } else {
        // Mostrar alerta de advertencia
        Swal.fire({
            title: "No se realizaron cambios",
            // text: "No realizaste ningún cambio.",
            icon: "warning",
            confirmButtonText: "Entendido",
        });
    }
});

// Asignar eventos a los botones
document.querySelectorAll(".font-size-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        setFontSize(btn.dataset.size);
    });
});

document.querySelectorAll(".contrast-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        setContrast(btn.dataset.contrast);
    });
});

// Funciones para cambiar opciones dinámicamente
function setFontSize(size) {
    currentFontSize = size;
    markSelectedOptions(size, currentContrast);
}

function setContrast(level) {
    currentContrast = level;
    markSelectedOptions(currentFontSize, level);
}

// Aplica las configuraciones guardadas al cargar la página
applyFontSize(currentFontSize);
applyContrast(currentContrast);




// Cerrar el modal de búsqueda al agrandar la pantalla
window.addEventListener('resize', () => {
    const modal = document.getElementById('buscarModal');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    
    if (window.innerWidth > 768) { // Punto de quiebre del menú de hamburguesa
        if (modal && modal.style.display === 'block') {
            // Cierra el modal
            modal.style.display = 'none'; 
            // Elimina el fondo oscuro del modal
            if (modalBackdrop) modalBackdrop.remove(); 
            // Restaurar el scroll de la página
            document.body.classList.remove('modal-open');
            document.body.style.overflow = 'auto'; // Permite el scroll nuevamente
        }
    }
});

// Cerrar el menú de hamburguesa y abrir el modal de búsqueda
document.getElementById('buscar-menu').addEventListener('click', () => {
    const navbarContent = document.getElementById('navbarContent');
    const modal = new bootstrap.Modal(document.getElementById('buscarModal'));

    // Cierra el menú de hamburguesa si está abierto
    if (navbarContent.classList.contains('show')) {
        const toggleButton = document.querySelector('.navbar-toggler');
        toggleButton.click(); // Esto simula un clic en el botón para cerrar el menú
    }

    // Muestra el modal de búsqueda
    modal.show();
});

// Asegurarse de que el fondo oscuro desaparezca cuando se cierre el modal
const buscarModal = document.getElementById('buscarModal');
buscarModal.addEventListener('hidden.bs.modal', () => {
    const backdrop = document.querySelector('.modal-backdrop');
    
    // Eliminar el fondo oscuro manualmente
    if (backdrop) {
        backdrop.remove();
    }

    // Restaurar el comportamiento del body para permitir scroll
    document.body.classList.remove('modal-open');
    document.body.style.overflow = 'auto'; // Permite el scroll nuevamente
});







document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const talles = urlParams.get('talles') ? urlParams.get('talles').split(',') : [];
    const color = urlParams.get('colores');
    const modelo = urlParams.get('modelos');
    
    // Definir los productos (puedes añadir más según tu necesidad)
    const productos = [
        { 
            id: 1, 
            nombre: 'Short Ruby', 
            talles: ['xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'], 
            colores: 'Negro', 
            modelos: 'Pantalones', 
            imagen: 'vestimenta/pantalones/negro.jpg', 
            detalles: 'pantalon-corto.html' 
        },
        { 
            id: 2, 
            nombre: 'Short Ruby', 
            talles: ['xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'], 
            colores: 'Beige', 
            modelos: 'Pantalones', 
            imagen: 'vestimenta/pantalones/beige.jpg', 
            detalles: 'pantalon-corto.html' 
        },
        { 
            id: 3, 
            nombre: 'Short Ruby', 
            talles: ['xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'], 
            colores: 'Verde', 
            modelos: 'Pantalones', 
            imagen: 'vestimenta/pantalones/verde.jpg', 
            detalles: 'pantalon-corto.html' 
        },
        // Añadir más productos según necesites
    ];

    function filtrarProductos() {
        return productos.filter(producto => {
            return (
                (talles.length === 0 || talles.some(talle => producto.talles.includes(talle))) &&
                (!color || producto.colores.toLowerCase() === color.toLowerCase()) &&
                (!modelo || producto.modelos.toLowerCase() === modelo.toLowerCase())
            );
        });
    }

    function mostrarResultados(productosFiltrados) {
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = '';

    if (productosFiltrados.length > 0) {
        productosFiltrados.forEach(producto => {
            const productoDiv = document.createElement('div');
            productoDiv.className = 'producto';
            productoDiv.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}" class="imagen-producto">
                <h3>${producto.nombre}</h3>
                <p class="descripcion-producto"><strong>Talles:</strong> ${producto.talles.join(', ')}</p>
                <p class="descripcion-producto"><strong>Color:</strong> ${producto.colores}</p>
                <p class="descripcion-producto"><strong>Modelo:</strong> ${producto.modelos}</p>
                <a href="${producto.detalles}?color=${producto.colores.toLowerCase()}" class="btn-detalles">Ver más detalles</a>
            `;
            resultadosDiv.appendChild(productoDiv);
        });
    } else { 
        resultadosDiv.innerHTML = '<p class="sin-resultados"><b>No se encontraron resultados que coincidan con los filtros seleccionados.</b></p>'; 
    }
}



    const productosFiltrados = filtrarProductos();
    mostrarResultados(productosFiltrados);
});
