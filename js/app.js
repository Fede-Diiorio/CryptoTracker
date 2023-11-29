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

        const cantidad = parseFloat(prompt("Ingrese la nueva cantidad de monedas que posee:"));

        if (cantidad > 0) {
            portafolio[buscarIndiceDeCripto].cantidad = parseFloat(cantidad);
        } else {
            alert("Debe ingresar un número mayor a 0");
        }

    }
    localStorage.setItem("portafolio", JSON.stringify(portafolio));
}

// Renderizado
function renderizarBarraDeBuscarCripto() {

    const contenedor = document.getElementById("barraDeBusqueda");
    contenedor.innerHTML = "";

    const divPadre = document.createElement("form");
    divPadre.classList.add("barra-de-busqueda");

    const input = document.createElement("input");
    input.placeholder = "Buscar...";

    const boton = document.createElement("button");
    boton.innerText = "Buscar";
    boton.classList.add("btn", "btn-primary");
    boton.addEventListener("click", (event) => {
        event.preventDefault();

        const ticker = input.value.toUpperCase();
        const tickerFiltrado = listaDeCriptos.filter((el) => {
            return el.symbol.includes(ticker.toUpperCase());
        });
        renderizarBarraDeBuscarCripto();
        renderizarBusquedaDeCripto(tickerFiltrado);
    });

    divPadre.append(input, boton);
    contenedor.append(divPadre);
}

function renderizarBusquedaDeCripto(listaDeCriptos) {
    const contenedor = document.getElementById("listaCripto");
    contenedor.innerText = "Elija el ticker que desea agregar a su portafolio:";

    const divPadre = document.createElement("div");
    divPadre.classList.add("d-flex");
    for (const cripto of listaDeCriptos) {

        const ticker = document.createElement("p");
        ticker.innerText = cripto.symbol;
        ticker.classList.add("ticker-busqueda");
        ticker.addEventListener("click", () => {
            const cantidad = parseFloat(prompt("Ingrese la cantidad de monedas que posee actualmente: "));
            if (cantidad > 0) {
                guardarCriptoEnLocalStorage(cripto, cantidad);
                contenedor.innerHTML = "";
                renderizarTablaConCriptos();
            } else {
                alert("Debe ingresar un número mayor a 0.");
            }
        })

        divPadre.append(ticker);
        contenedor.append(divPadre);
    }
}

function renderizarTablaConCriptos() {
    const contenedor = document.querySelector("#tabla table tbody");
    contenedor.innerHTML = "";

    for (const criptoTabla of portafolio) {
        const tr = document.createElement("tr");

        const tdTicker = document.createElement("td");
        tdTicker.innerText = criptoTabla.ticker;

        const tdPrecio = document.createElement("td");
        tdPrecio.innerText = `$${mostrarNumeroConComas(criptoTabla.precio)}`;

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

// *** VARIABLES ***
let portafolio = [];
const listaDeCriptos = [];

// *** INICIO DE PROGRAMA ***

obtenerCriptosDeLocalStorage();
obtenerPreciosDeApi().then(() => {
    renderizarBarraDeBuscarCripto();
});
renderizarTablaConCriptos();