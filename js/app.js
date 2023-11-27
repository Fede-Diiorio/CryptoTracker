// Funciones
function obtenerPreciosDeApi() {
    fetch("http://api.binance.com/api/v3/ticker/price").then((response) => {
        return response.json();
    }).then((responseJson) => {
        console.log(...responseJson);
    });
}

obtenerPreciosDeApi();