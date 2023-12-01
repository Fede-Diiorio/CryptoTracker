// *** FUNCIONES ***
// Utilidades
function obtenerPreciosDeApi() {
    return new Promise((resolve, reject) => {
        fetch("https://api.binance.com/api/v3/ticker/price")
            .then((response) => response.json())
            .then((responseJson) => {
                for (const cripto of responseJson) {
                    const filtro = cripto.symbol.includes("USDT");
                    if (filtro) {
                        listaDeCriptos.push(cripto);
                    }
                }
                resolve(listaDeCriptos);
            })
            .catch((error) => reject(error));
    });
}

function mostrarNumeroConComas(numero) {
    const numeroConDecimales = Number(numero).toFixed(2);
    return numeroFormateado = numeroConDecimales.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function eliminarCriptoDeTabla(cripto) {
    const indeceCriptoAEliminar = portafolio.findIndex((el) => {
        return cripto.ticker === el.ticker;
    });

    if (indeceCriptoAEliminar !== -1) {
        portafolio.splice(indeceCriptoAEliminar, 1);
        Toastify({
            text: "Eliminada Correctamente",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, #b1140e, #d47370)",
            },
            onClick: function () { } // Callback after click
        }).showToast();
    }
    localStorage.setItem("portafolio", JSON.stringify(portafolio));
    renderizarTablaConCriptos();
}

// Local Storage
function obtenerCriptosDeLocalStorage() {
    const portafolioEnLocalStorage = JSON.parse(localStorage.getItem("portafolio"));
    portafolio = portafolioEnLocalStorage ? portafolioEnLocalStorage : [];
}

function guardarCriptoEnLocalStorage(cripto, cantidad) {
    const agregarCripto = {
        ticker: cripto.symbol,
        precio: cripto.price,
        cantidad: parseFloat(cantidad),
        total: cripto.price * cantidad
    }

    if (portafolio === null) {
        portafolio = [agregarCripto]
    } else {
        const buscarIndiceDeCripto = portafolio.findIndex((el) => {
            return el.ticker === agregarCripto.ticker;
        });
        if (buscarIndiceDeCripto === -1) {
            portafolio.push(agregarCripto);
            Toastify({
                text: "¡Agregada correctamente!",
                duration: 3000,
                destination: "https://github.com/apvarun/toastify-js",
                newWindow: true,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
                onClick: function () { } // Callback after click
            }).showToast();
        } else {
            portafolio[buscarIndiceDeCripto].cantidad = parseFloat(cantidad);
        }
    }
    localStorage.setItem("portafolio", JSON.stringify(portafolio));
}

function actualizarCriptoEnLocalStorage(cripto) {
    const buscarIndiceDeCripto = portafolio.findIndex((el) => {
        return el.ticker === cripto.ticker;
    });
    if (buscarIndiceDeCripto !== -1) {

        Swal.fire({
            title: "Nueva Cantidad",
            input: "number",
            inputValue: portafolio[buscarIndiceDeCripto].cantidad,
            inputLabel: "Ingrese la nueva cantidad de monedas que posee:",
            inputAttributes: {
                autocomplete: "off",
                step: "any", // Permite números decimales
            },
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                const cantidad = parseFloat(result.value);
                if (!isNaN(cantidad) && cantidad > 0) {
                    portafolio[buscarIndiceDeCripto].cantidad = cantidad;
                    portafolio[buscarIndiceDeCripto].total = portafolio[buscarIndiceDeCripto].precio * cantidad;
                    localStorage.setItem("portafolio", JSON.stringify(portafolio));
                    renderizarTotalDeCartera();
                    renderizarTablaConCriptos();
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "Debe ingresar un número válido mayor a 0.",
                        icon: "error"
                    });
                }
            }
        });
    }
}

// Renderizado
function renderizarBarraDeBuscarCripto() {

    const contenedor = document.getElementById("barraDeBusqueda");
    contenedor.innerHTML = "";

    const divPadre = document.createElement("form");
    divPadre.classList.add("barra-de-busqueda");

    const input = document.createElement("input");
    input.placeholder = "Buscar ticker...";

    const boton = document.createElement("button");
    boton.innerText = "Buscar";
    boton.classList.add("btn", "btn-primary");
    boton.addEventListener("click", (event) => {
        event.preventDefault();

        const ticker = input.value.toUpperCase();
        const tickerFiltrado = listaDeCriptos.filter((el) => {
            return el.symbol.includes(ticker.toUpperCase());
        });

        if (tickerFiltrado.length === 0) {
            Swal.fire({
                title: "Hubo un Problema",
                text: "No contamos con ese ticker en nuestra base de datos.",
                icon: "question"
            });
            renderizarBarraDeBuscarCripto();
        } else {
            if (input.value === "") {
                Toastify({
                    text: "Debe ingresar un ticker válido",
                    duration: 3000,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "linear-gradient(to right, #b1140e, #d47370)",
                    },
                    onClick: function () { } // Callback after click
                }).showToast();
            } else {
                renderizarBarraDeBuscarCripto();
                renderizarBusquedaDeCripto(tickerFiltrado);
            }
        }

    });

    divPadre.append(input, boton);
    contenedor.append(divPadre);
}

function renderizarBusquedaDeCripto(listaDeCriptos) {
    const contenedor = document.getElementById("listaCripto");
    contenedor.innerText = "";

    const pregunta = document.createElement("p");
    pregunta.innerText = "Elija el ticker que desea agregar a su portafolio:";

    const divPadre = document.createElement("div");
    divPadre.classList.add("d-flex", "column-gap-3", "flex-wrap");
    for (const cripto of listaDeCriptos) {

        const ticker = document.createElement("p");
        ticker.innerText = cripto.symbol;
        ticker.classList.add("ticker-busqueda");
        ticker.addEventListener("click", async () => {
            const { value: cantidad } = await Swal.fire({
                title: "Cantidad Actual",
                input: "number",
                icon: "question",
                inputLabel: "Ingrese la cantidad de monedas que posee actualmente:",
                inputAttributes: {
                    autocomplete: "off",
                    step: "any", // Permite números decimales
                },
                showCancelButton: true,
            });

            if (cantidad !== undefined && cantidad !== null) {
                const cantidadFloat = parseFloat(cantidad);
                if (!isNaN(cantidadFloat) && cantidadFloat > 0) {
                    guardarCriptoEnLocalStorage(cripto, cantidadFloat);
                    contenedor.innerHTML = "";
                    renderizarTablaConCriptos();
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "Debe ingresar un número válido mayor a 0.",
                        icon: "error"
                    });
                }
            }
        });

        divPadre.append(ticker);
        contenedor.append(pregunta, divPadre);
    }
}

function renderizarTablaConCriptos() {
    const contenedor = document.querySelector("#tabla table tbody");
    contenedor.innerHTML = "";

    renderizarTotalDeCartera();

    for (const criptoTabla of portafolio) {
        const tr = document.createElement("tr");

        const tdTicker = document.createElement("td");
        tdTicker.innerText = criptoTabla.ticker;

        const tdPrecio = document.createElement("td");
        tdPrecio.innerText = `$ ${mostrarNumeroConComas(criptoTabla.precio)}`;

        const tdCantidad = document.createElement("td");
        tdCantidad.innerText = criptoTabla.cantidad;

        const tdValor = document.createElement("td");
        const resultadoCartera = criptoTabla.precio * criptoTabla.cantidad;
        tdValor.innerText = `$ ${mostrarNumeroConComas(resultadoCartera)}`;

        const tdActualizar = document.createElement("td");
        const botonActualizar = document.createElement("p");
        botonActualizar.classList.add("boton-td");
        botonActualizar.innerHTML = '<i class="fa-solid fa-rotate-right"></i>';
        botonActualizar.addEventListener("click", () => {
            actualizarCriptoEnLocalStorage(criptoTabla);
            renderizarTablaConCriptos();
        });

        const tdBorrar = document.createElement("td");
        const botonBorrar = document.createElement("p");
        botonBorrar.classList.add("boton-td");
        botonBorrar.innerHTML = '<i class="fa-solid fa-trash"></i>';
        botonBorrar.addEventListener("click", () => {
            Swal.fire({
                title: "¿Desea eliminar esta cripto de su portafolio?",
                showDenyButton: true,
                confirmButtonText: "Si",
                denyButtonText: `No`
            }).then((result) => {
                if (result.isConfirmed) {
                    eliminarCriptoDeTabla(criptoTabla);
                    renderizarTotalDeCartera();
                } else if (result.isDenied) {
                    renderizarTablaConCriptos();
                }
            });
        });

        tdActualizar.append(botonActualizar);
        tdBorrar.append(botonBorrar);
        tr.append(tdTicker, tdPrecio, tdCantidad, tdValor, tdActualizar, tdBorrar);
        contenedor.append(tr);
    }
}

function renderizarTotalDeCartera() {
    const contenedor = document.getElementById("totalCartera");
    contenedor.innerHTML = "";

    let mostrarTotal = 0;
    for (let i = 0; portafolio.length > i; i++) {
        mostrarTotal += parseFloat(portafolio[i].total);
    }

    const divPadre = document.createElement("div");
    divPadre.classList.add("total-cartera");

    const total = document.createElement("p");
    total.classList.add("total-cartera__texto");
    total.innerHTML = `<strong>Total: </strong>$ ${mostrarNumeroConComas(mostrarTotal)}`;

    divPadre.append(total);
    contenedor.append(divPadre)
}

function renderizadoDeBotonDeFiltroOrden(id, propiedad) {
    const contenedor = document.getElementById(id);
    contenedor.innerHTML = "";

    const divPadre = document.createElement("div");
    divPadre.classList.add("caja-filtro", "d-flex", "flex-column");

    const flechaArriba = document.createElement("i");
    flechaArriba.classList.add("fa-solid", "fa-caret-up");
    flechaArriba.addEventListener("click", () => {
        portafolio.sort((a, b) => {
            if (a[propiedad] < b[propiedad]) {
                return 1;
            }
            if (a[propiedad] > b[propiedad]) {
                return -1;
            }
            return 0
        })
        renderizarTablaConCriptos();
    });

    const flechaAbajo = document.createElement("i");
    flechaAbajo.classList.add("fa-solid", "fa-caret-down");
    flechaAbajo.addEventListener("click", () => {
        portafolio.sort((a, b) => {
            if (a[propiedad] < b[propiedad]) {
                return -1;
            }
            if (a[propiedad] > b[propiedad]) {
                return 1;
            }
            return 0
        })
        renderizarTablaConCriptos();
    });


    divPadre.append(flechaArriba, flechaAbajo);
    contenedor.append(divPadre);
}

// *** VARIABLES ***
let portafolio = [];
const listaDeCriptos = [];

// *** INICIO DE PROGRAMA ***

obtenerCriptosDeLocalStorage();
obtenerPreciosDeApi().then(() => {
    renderizarBarraDeBuscarCripto();
    console.log(portafolio[1].ticker)
});
renderizadoDeBotonDeFiltroOrden("filtroTicker", "ticker");
renderizadoDeBotonDeFiltroOrden("filtroPrecio", "precio");
renderizadoDeBotonDeFiltroOrden("filtroCantidad", "cantidad");
renderizadoDeBotonDeFiltroOrden("filtroCartera", "total");
renderizarTablaConCriptos();
renderizarTotalDeCartera();