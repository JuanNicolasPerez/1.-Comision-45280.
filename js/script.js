const contentProdc = document.getElementById("contenedor-produc");
const vercarrito = document.getElementById("vercarrito");
const modalcontainer = document.getElementById("modal-content");
const botonesCategorias = document.querySelectorAll(".boton-categoria");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

JSON.parse(localStorage.getItem("carrito"));

const savelocal = () => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

fetch("./js/product.json")
    .then(response => response.json())
    .then(productos => {

        function cargarProductos(productosElegidos) {
            contentProdc.innerHTML = "";
            productosElegidos.forEach(producto => {
                let content = document.createElement("div");
                content.className = "producto";
                content.innerHTML = `
                <img class="producto-imagen" src="${producto.img}" alt="${producto.nombre}">
                <div class="producto-detalles">
                    <h3 class="producto-titulo">${producto.nombre}</h3>
                    <p class="producto-precio">$${producto.precio}</p>
                </div>
                `;

                contentProdc.append(content);

                let comprar = document.createElement("button");
                comprar.className = "producto-agregar";

                comprar.innerText = "Comprar";

                content.append(comprar);

                comprar.addEventListener("click", () => {

                    const repeat = carrito.some((repeatProduct) => repeatProduct.id === producto.id);
                    if (repeat) {
                        carrito.map((prod) => {
                            if (prod.id === prod.id) {
                                prod.cantidad++
                            }
                        });
                    }
                    else {
                        carrito.push({
                            id: producto.id,
                            img: producto.img,
                            nombre: producto.nombre,
                            precio: producto.precio,
                            cantidad: producto.cantidad,
                        });
                        savelocal();
                    }
                });
            });
        }

        cargarProductos(productos);

        botonesCategorias.forEach(boton => {
            boton.addEventListener("click", (e) => {

                botonesCategorias.forEach(boton => boton.classList.remove("active"));
                e.currentTarget.classList.add("active");

                if (e.currentTarget.id != "todos") {
                    const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
                    cargarProductos(productosBoton);
                } else {
                    cargarProductos(productos);
                }
            })
        });

        function pintarCarrito() {
            modalcontainer.innerHTML = "";
            modalcontainer.style.display = "flex";
            const modalheader = document.createElement("div");
            modalheader.className = "modal-header";
            modalheader.innerHTML = `
                <h1 class="modal-header-title">Carrito.</h1>
                `;
            modalcontainer.append(modalheader);

            const modalbutton = document.createElement("h1");
            modalbutton.innerText = "Salir";
            modalbutton.className = "modal-header-title";

            modalbutton.addEventListener("click", () => {
                modalcontainer.style.display = "none";

            });

            modalheader.append(modalbutton);

            carrito.forEach((producto) => {
                let carritocontent = document.createElement("div");
                carritocontent.className = "modal-content";
                carritocontent.innerHTML = `
                    <div>
                        <div class = "modal-img">
                            <img src = "${producto.img}">
                            <h3>${producto.nombre}</h3>
                        </div>
                        <div class = "content-cant">
                            <span class="restar"> - </span>
                            <p>Cantidad: ${producto.cantidad}</p>
                            <span class="sumar"> + </span>
                        </div>                   
                    </div>
                    <p class="text-precio"> Precio: $ ${producto.precio}</p>
                    <p class="text-total">Total: $ ${producto.cantidad * producto.precio}</p>
                    <span class= "delete-product"> 🗑 </span>
                    `;

                modalcontainer.append(carritocontent);

                let restar = carritocontent.querySelector(".restar");

                restar.addEventListener("click", () => {
                    if (producto.cantidad !== 1) {
                        producto.cantidad--;
                    }
                    pintarCarrito();
                });

                let sumar = carritocontent.querySelector(".sumar");

                sumar.addEventListener("click", () => {
                    producto.cantidad++;
                    pintarCarrito();
                });

                let eliminar = carritocontent.querySelector(".delete-product");

                eliminar.addEventListener("click", () => {
                    eliminarproducto(producto.id);
                });
            });

            const total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);

            const totalBuying = document.createElement("div");
            totalBuying.innerHTML = `
            <p class = "total-content">Total a pagar: $ ${total}</p>
            <div class = "botones">
                <button class = "boton-acciones" id= "carrito-acciones-comprar">Finalizar Comprar</button>
                <button class = "boton-acciones" id = "carrito-acciones-vaciar">Vaciar Carrito</button>
            </div>
            `;
            modalcontainer.append(totalBuying);

            let vaciarCarritos = totalBuying.querySelector("#carrito-acciones-vaciar");
            vaciarCarritos.addEventListener("click", vaciarCarrito);

            let finalizarCompras = totalBuying.querySelector("#carrito-acciones-comprar");
            finalizarCompras.addEventListener("click", finalizarcompra);
        };

        vercarrito.addEventListener("click", pintarCarrito);

        function eliminarproducto(id) {
            const foundId = carrito.find((element) => element.id === id)
            carrito = carrito.filter((carritoId) => {
                return carritoId !== foundId;
            });
            savelocal();
            pintarCarrito();
        }

        function vaciarCarrito() {
            if (carrito.length == 0) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Tu Carrito ya esta Vacio',
                    icon: 'error',
                    confirmButtonText: ' =( '
                })
            }
            else {
                carrito.length = 0;
                localStorage.setItem("productos-en-carrito", JSON.stringify(carrito));
                Swal.fire({
                    title: 'Borrado!',
                    icon: 'success',
                    text: 'Tus Productos del Carrito han sido borrados'
                })
            }
            savelocal();
            pintarCarrito();
        }

        function finalizarcompra() {
            if (carrito.length == 0) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Tu Carrito esta Vacio',
                    icon: 'error',
                    confirmButtonText: ' =( '
                })
            } else {
                Swal.fire({
                    title: 'Felicicidades!',
                    text: 'Tu compra se realizo con exito!',
                    icon: 'success',
                    confirmButtonText: 'Gracias'
                })
                carrito.length = 0;
                localStorage.setItem("productos-en-carrito", JSON.stringify(carrito));
            }
            pintarCarrito();
            savelocal();
        }
})

