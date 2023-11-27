// Funciones
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
    const contenedor = document.getElementById("listaCriptos");
}

// Variables
const listaDeCriptos = [];

// Inicio del Programa
obtenerPreciosDeApi().then(() => {
    renderizarListaDeCriptos();
});
console.log(listaDeCriptos);
