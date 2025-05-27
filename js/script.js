
const backupFrutas = [
        {
            "id": 1,
            "nombre": "arandano",
            "precio": 5000,
            "img": "img/arandano.jpg"
        },
        {
            "id": 2,
            "nombre": "anana",
            "precio": 3500,
            "img": "img/anana.jpg"
        },
        {
            "id": 3,
            "nombre": "banana",
            "precio": 1200,
            "img": "img/banana.jpg"
        },
        {
            "id": 4,
            "nombre": "frambuesa",
            "precio": 4500,
            "img": "img/frambuesa.jpg"
        },
        {
            "id": 5,
            "nombre": "frutilla",
            "precio": 2800,
            "img": "img/frutilla.jpg"
        },
        {
            "id": 6,
            "nombre": "kiwi",
            "precio": 2200,
            "img": "img/kiwi.jpg"
        },
        {
            "id": 7,
            "nombre": "mandarina",
            "precio": 1800,
            "img": "img/mandarina.jpg"
        },
        {
            "id": 8,
            "nombre": "manzana",
            "precio": 1500,
            "img": "img/manzana.jpg"
        },
        {
            "id": 9,
            "nombre": "naranja",
            "precio": 1600,
            "img": "img/naranja.jpg"
        },
        {
            "id": 10,
            "nombre": "pera",
            "precio": 1700,
            "img": "img/pera.jpg"
        },
        {
            "id": 11,
            "nombre": "pomelo-amarillo",
            "precio": 2000,
            "img": "img/pomelo-amarillo.jpg"
        },
        {
            "id": 12,
            "nombre": "pomelo-rojo",
            "precio": 2100,
            "img": "img/pomelo-rojo.jpg"
        },
        {
            "id": 13,
            "nombre": "sandia",
            "precio": 4000,
            "img": "img/sandia.jpg"
        }   
    ]

// global, para almacenar todos los productos
let todosLosProduct = [];
let carrito = [];
// PUNTO 1 -------------

const datosPersonales = {
    nombre: "Noelia",
    apellido: "Storgato",
    dni: 38990040
};

const misDatos = document.querySelector('.nombreAlumno');
misDatos.textContent = `${datosPersonales.nombre} ${datosPersonales.apellido}`
console.log(`Nombre: ${datosPersonales.nombre}\nApellido: ${datosPersonales.apellido}`);

// PUNTO 2 -------------

function cargaSimulada() {
    return fetch ('db.json')
        .then(response => {
            if (!response.ok){
                throw new Error ('Error en la respuesta: ' + response.status);
            }
            return response.json();
        })
        .then (data => data.frutas || backupFrutas)
        .catch(error => {
            console.error('Error cargando los datos: ', error);
            return backupFrutas;
        })
} 

//  PUNTO 3 -------------


function renderProductos (productos){
    const productGrid = document.querySelector('.product-grid');

    productGrid.innerHTML = ``;

    productos.forEach(producto => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${producto.img}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>$${producto.precio}</p>
            <button class="add-to-cart" data-id="${producto.id}">Agregar a carrito</button>
        `;

        productGrid.appendChild(productCard);
    });
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', agregaAlCarrito);
    });
}

function init() {
    cargaSimulada()
    .then (productos => {
        todosLosProduct = productos;
        renderProductos(productos);
        console.log(productos);

        carrito = cargarCarritoLS();
        actualizarCarrito();
        actualizarContadorCarrito();
        actualizarTotal();
    })
    .catch(error => console.error('Error al inicializar', error));
}

document.addEventListener('DOMContentLoaded', function(){
init()
    const searchInput  = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', filtro);
    }

    const cartItems = document.getElementById('cart-items')
    console.log(`carrito ${cartItems}`);
    if (cartItems){
        cartItems.addEventListener('click', eliminarDelCarrito)
        console.log("clickie eliminar");
    }   
});

// PUNTO 4 -------------

function filtro() {
    const textoSearch = document.getElementById('search-input').value.toLowerCase(); // tranformo el texto ingresadpo en minuscula
    const productoFiltrado = todosLosProduct.filter(producto => {
        return(producto.nombre.toLowerCase().includes(textoSearch))
    });
    renderProductos(productoFiltrado);
}

// PUNTO 5 -------------

function agregaAlCarrito (event){
    const productId = parseInt(event.target.dataset.id);
    const producto = todosLosProduct.find(p => p.id === productId);

    if (producto) {
        // primero ver si el prodcuto esta en el carrito
        const productoEnCarrito = carrito.find(item => item.id === productId);

        if (productoEnCarrito) {
            // si es true (existe) incremento cantidad
            productoEnCarrito.cantidad +=1;
        } else {
            // si no existe se agrega al carrito
            carrito.push({
                ...producto,
                cantidad: 1
            });
        }
        
        actualizarCarrito();
        actualizarContadorCarrito();
        actualizarTotal();
        guardarCarritoLS();
        
    }
}

function eliminarDelCarrito(event) {
    if (event.target.classList.contains('delete-button')) {
        const productId = parseInt(event.target.dataset.id);
        carrito = carrito.filter((item) => item.id !== productId);

        actualizarCarrito();
        actualizarContadorCarrito();
        actualizarTotal();
        guardarCarritoLS();
    } 
}

function actualizarCarrito() {
    const cartItems = document.getElementById('cart-items');
    
    if (carrito.length === 0) {
        cartItems.innerHTML = '<p>No hay elementos en el carrito</p>';
        return;
    }

    cartItems.innerHTML = '';
    
    carrito.forEach(item => {
        const li = document.createElement('li');
        li.className = 'item-block';

        li.innerHTML = `
        <p class="item-name">${item.nombre} - $${item.precio} (${item.cantidad})</p>
        <button class="delete-button" data-id="${item.id}">Eliminar</button>
        `;
        cartItems.appendChild(li);
    });
}

function actualizarContadorCarrito() {
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    const cartContador = document.getElementById('cart-count');

    cartContador.textContent = totalItems;
}

function actualizarTotal() {
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    document.getElementById('total-price').textContent = `$${total}`;
}

//  PUNTO 6 -------------

const carritoStorage = 'fruteria_carrito';

function guardarCarritoLS () {
    localStorage.setItem(carritoStorage, JSON.stringify(carrito));
}

function cargarCarritoLS() {
    const carritoGuardado = localStorage.getItem(carritoStorage);
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
}