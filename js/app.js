// Funciones
function mostrarNumeroConComas(numero) {
    const numeroConDecimales = Number(numero).toFixed(2);
    return numeroFormateado = numeroConDecimales.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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

function renderizarListaDeCriptos() {
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
const listaDeCriptos = [];

// Inicio del Programa
obtenerPreciosDeApi().then(() => {
    renderizarListaDeCriptos();
});
