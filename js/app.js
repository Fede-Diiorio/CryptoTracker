// *** FUNCIONES ***
// Utilidades
function obtenerPreciosDeApi() {
    return new Promise((resolve, reject) => {
        fetch(API_URL)
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
            .catch((error) => {
                console.error("Error en la solicitud API:", error);
                reject(error);
            });
    });
}

function mostrarNumeroConComas(numero) {
    return numero.toLocaleString('es-ES');
}

function mensajesToastify(mensaje, color) {
    const estilo = color ? "linear-gradient(to right, #b1140e, #d47370)" : "linear-gradient(to right, #00b09b, #96c93d)";

    Toastify({
        text: mensaje,
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: estilo,
        },
        onClick: function () { } // Callback after click
    }).showToast();
}

function eliminarCriptoDeTabla(cripto) {
    const indiceCriptoAEliminar = portafolio.findIndex((el) => {
        return cripto.ticker === el.ticker;
    });

    if (indiceCriptoAEliminar !== -1) {
        portafolio.splice(indiceCriptoAEliminar, 1);
        mensajesToastify("Eliminada Correctamente", true);
    }
    localStorage.setItem("portafolio", JSON.stringify(portafolio));
    renderizarTablaConCriptos();
}

function altertaSweetAlertBasica(titulo, mensaje, icono) {
    Swal.fire({
        title: titulo,
        text: mensaje,
        icon: icono
    });
}

function buscarIndiceEnLista(lista, propiedad, valor) {
    return lista.findIndex(el => el[propiedad] === valor);
}

// Local Storage
function obtenerCriptosDeLocalStorage() {
    const portafolioEnLocalStorage = JSON.parse(localStorage.getItem("portafolio"));
    portafolio = portafolioEnLocalStorage ? portafolioEnLocalStorage : [];
}

function guardarCriptoEnLocalStorage(cripto, cantidad) {
    const agregarCripto = {
        ticker: cripto.symbol,
        precio: parseFloat(cripto.price),
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
            mensajesToastify("¡Agregada Correctamente!", false);
        } else {
            portafolio[buscarIndiceDeCripto].cantidad = parseFloat(cantidad);
        }
    }
    localStorage.setItem("portafolio", JSON.stringify(portafolio));
}

function actualizarCriptoEnLocalStorage(cripto) {
    const buscarIndiceDeCriptoEnProtafolio = portafolio.findIndex((el) => {
        return el.ticker === cripto.ticker;
    });

    if (buscarIndiceDeCriptoEnProtafolio !== -1) {

        Swal.fire({
            title: "Nueva Cantidad",
            input: "number",
            inputValue: portafolio[buscarIndiceDeCriptoEnProtafolio].cantidad,
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
                    portafolio[buscarIndiceDeCriptoEnProtafolio].cantidad = cantidad;
                    portafolio[buscarIndiceDeCriptoEnProtafolio].total = portafolio[buscarIndiceDeCriptoEnProtafolio].precio * cantidad;
                    localStorage.setItem("portafolio", JSON.stringify(portafolio));

                    renderizarTotalDeCartera();
                    renderizarTablaConCriptos();
                } else {
                    altertaSweetAlertBasica("Error", "Debe ingresar un número mayor a 0", "error");
                }
            }
        });
    }
}

function actualizarInformacionCriptoEnPortafolio(indice, nuevoPrecio) {
    if (indice !== -1) {
        portafolio[indice].precio = nuevoPrecio;
        portafolio[indice].total = portafolio[indice].precio * portafolio[indice].cantidad;
    }
}

function actualizarPrecio(cripto) {
    const buscarIndiceDeCriptoEnProtafolio = buscarIndiceEnLista(portafolio, 'ticker', cripto.ticker);
    const buscarIndiceDeCriptoParaElPrecio = buscarIndiceEnLista(listaDeCriptos, 'symbol', cripto.ticker);

    if (buscarIndiceDeCriptoParaElPrecio !== -1) {
        const nuevoPrecio = parseFloat(listaDeCriptos[buscarIndiceDeCriptoParaElPrecio].price);
        actualizarInformacionCriptoEnPortafolio(buscarIndiceDeCriptoEnProtafolio, nuevoPrecio);
        localStorage.setItem("portafolio", JSON.stringify(portafolio));
    }
}

// Renderizado
function renderizarBarraDeBuscarCripto() {

    const contenedor = document.getElementById("barraDeBusqueda");
    contenedor.innerText = "";

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
            altertaSweetAlertBasica("Hubo un Problema", "No contamos con ese ticker en nuestra base de datos.", "question");
            renderizarBarraDeBuscarCripto();
        } else {
            if (input.value === "") {
                mensajesToastify("Debe ingresar un ticker válido", true);
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
                    contenedor.innerText = "";
                    renderizarTablaConCriptos();
                } else {
                    altertaSweetAlertBasica("Error", "Debe ingresar un número válido mayor a 0.", "error");
                }
            }
        });

        divPadre.append(ticker);
        contenedor.append(pregunta, divPadre);
    }
}

function renderizarTablaConCriptos() {
    const contenedor = document.querySelector("#tabla table tbody");
    contenedor.innerText = "";

    renderizarTotalDeCartera();

    for (const criptoTabla of portafolio) {

        actualizarPrecio(criptoTabla);

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
        tdActualizar.classList.add("boton-td");
        const botonActualizar = document.createElement("i");
        botonActualizar.classList.add("fa-solid", "fa-rotate-right");
        botonActualizar.addEventListener("click", () => {
            actualizarCriptoEnLocalStorage(criptoTabla);
            renderizarTablaConCriptos();
        });

        const tdBorrar = document.createElement("td");
        tdBorrar.classList.add("boton-td")
        const botonBorrar = document.createElement("i");
        botonBorrar.classList.add("fa-solid", "fa-trash");
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
                };
            });
        });

        tdActualizar.append(botonActualizar);
        tdBorrar.append(botonBorrar);
        tr.append(tdTicker, tdPrecio, tdCantidad, tdValor, tdActualizar, tdBorrar);
        contenedor.append(tr);
    };
}

function renderizarTotalDeCartera() {
    const contenedor = document.getElementById("totalCartera");
    contenedor.innerText = "";

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

function renderizadoDeBotonDeFiltroOrden(id, propiedad, ascendente) {
    const contenedor = document.getElementById(id);
    contenedor.innerHTML = "";

    const divPadre = document.createElement("div");
    divPadre.classList.add("caja-filtro", "d-flex", "flex-column");

    const flechaArriba = document.createElement("i");
    flechaArriba.classList.add("fa-solid", "fa-caret-up");
    flechaArriba.addEventListener("click", () => {
        ordenarTabla(ascendente);
    });

    const flechaAbajo = document.createElement("i");
    flechaAbajo.classList.add("fa-solid", "fa-caret-down");
    flechaAbajo.addEventListener("click", () => {
        ordenarTabla(!ascendente);
    });

    function ordenarTabla(ascendente) {
        const multiplicador = ascendente ? 1 : -1;

        portafolio.sort((a, b) => {
            if (a[propiedad] > b[propiedad]) return multiplicador;
            if (a[propiedad] < b[propiedad]) return -multiplicador;
            return 0;
        });

        renderizarTablaConCriptos();
    }

    divPadre.append(flechaArriba, flechaAbajo);
    contenedor.append(divPadre);
}

// *** VARIABLES ***
const API_URL = "https://api.binance.com/api/v3/ticker/price";
let portafolio = [];
const listaDeCriptos = [];

// *** INICIO DE PROGRAMA ***

obtenerCriptosDeLocalStorage();
obtenerPreciosDeApi().then(() => {
    renderizarBarraDeBuscarCripto();
    renderizadoDeBotonDeFiltroOrden("filtroTicker", "ticker", true);
    renderizadoDeBotonDeFiltroOrden("filtroPrecio", "precio", false);
    renderizadoDeBotonDeFiltroOrden("filtroCantidad", "cantidad", false);
    renderizadoDeBotonDeFiltroOrden("filtroCartera", "total", false);
    renderizarTablaConCriptos();
    renderizarTotalDeCartera();
});