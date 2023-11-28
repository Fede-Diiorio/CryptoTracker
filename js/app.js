// Funciones
function mostrarNumeroConComas(numero) {
    const numeroConDecimales = Number(numero).toFixed(2);
    return numeroFormateado = numeroConDecimales.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function guardarCriptoEnLocalStorage(cripto, cantidad) {
    const agregarCripto = {
        ticker: cripto.symbol,
        precio: cripto.price,
        cantidad: parseFloat(cantidad)
    }

    if (portafolio === null) {
        portafolio = [agregarCripto]
    } else {
        const buscarIndiceDeCripto = portafolio.findIndex((el) => {
            return el.ticker === agregarCripto.ticker;
        });
        if (buscarIndiceDeCripto === -1) {
            portafolio.push(agregarCripto);
        } else {
            portafolio[buscarIndiceDeCripto].cantidad = parseFloat(cantidad);
        }
    }
    localStorage.setItem("portafolio", JSON.stringify(portafolio));
}

function obtenerCriptosDeLocalStorage() {
    const portafolioEnLocalStorage = JSON.parse(localStorage.getItem("portafolio"));
    portafolio = portafolioEnLocalStorage ? portafolioEnLocalStorage : [];
}

function renderizarBarraDeBuscarCripto() {

    const contenedor = document.getElementById("barraDeBusqueda");
    contenedor.innerHTML = "";

    const divPadre = document.createElement("div");

    const input = document.createElement("input");
    input.placeholder = "Buscar...";

    const boton = document.createElement("button");
    boton.innerText = "Buscar";
    boton.addEventListener("click", (event) => {
        event.preventDefault();

        const ticker = input.value.toUpperCase();
        console.log(ticker)
        const tickerFiltrado = listaDeCriptos.filter((el) => {
            return el.symbol.includes(ticker.toUpperCase());
        });

        renderizarBusquedaDeCripto(tickerFiltrado);
    });

    divPadre.append(input, boton);
    contenedor.append(divPadre);
}

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

function renderizarBusquedaDeCripto(listaDeCriptos) {
    const contenedor = document.getElementById("listaCripto");
    contenedor.innerText = "Elija el ticker que desea agregar a su portafolio:";

    for (const cripto of listaDeCriptos) {
        const divPadre = document.createElement("div");

        const ticker = document.createElement("p");
        ticker.innerText = cripto.symbol;
        ticker.classList.add("borde");
        ticker.addEventListener("click", () => {
            const cantidad = parseFloat(prompt("Ingrese la cantidad de monedas que posee actualmente: "));
            guardarCriptoEnLocalStorage(cripto, cantidad);
            contenedor.innerHTML = "";
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
        console.log(tdPrecio);

        const tdCantidad = document.createElement("td");
        tdCantidad.innerText = criptoTabla.cantidad;

        const tdValor = document.createElement("td");
        const resultadoCartera = criptoTabla.precio * criptoTabla.cantidad;
        tdValor.innerText = `$ ${mostrarNumeroConComas(resultadoCartera)}`;

        const tdPorcentaje = document.createElement("td");
        tdPorcentaje.innerText = "Pendiente";

        const tdActualizar = document.createElement("td");

        const botonActualizar = document.createElement("button");
        botonActualizar.innerText = "Actualizar";

        const tdBorrar = document.createElement("td");

        const botonBorrar = document.createElement("button");
        botonBorrar.innerText = "Borrar";

        tdActualizar.append(botonActualizar);
        tdBorrar.append(botonBorrar);
        tr.append(tdTicker, tdPrecio, tdCantidad, tdValor, tdPorcentaje, tdActualizar, tdBorrar);
        contenedor.append(tr);
    }
}

// Variables
let portafolio = [];
const listaDeCriptos = [];

// Inicio del Programa

obtenerCriptosDeLocalStorage();
obtenerPreciosDeApi().then(() => {
    renderizarBarraDeBuscarCripto();
});
renderizarTablaConCriptos();