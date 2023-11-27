// Funciones
function mostrarNumeroConComas(numero) {
    const numeroConDecimales = Number(numero).toFixed(2);
    return numeroFormateado = numeroConDecimales.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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

        renderizarListaDeCriptos(tickerFiltrado);
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

function renderizarListaDeCriptos(listaDeCriptos) {
    const contenedor = document.getElementById("listaCripto");
    contenedor.innerHTML = "";

    for (const cripto of listaDeCriptos) {
        const divPadre = document.createElement("div");

        const ticker = document.createElement("p");
        ticker.innerText = cripto.symbol;

        const precio = document.createElement("p");
        precio.innerText = `$ ${mostrarNumeroConComas(cripto.price)}`;

        divPadre.append(ticker, precio);
        contenedor.append(divPadre);
    }
}

// Variables
const portafolio = [];
const listaDeCriptos = [];

// Inicio del Programa
obtenerPreciosDeApi().then(() => {
    renderizarBarraDeBuscarCripto();
});
