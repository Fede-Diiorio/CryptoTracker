// Funciones
function obtenerPreciosDeApi() {
    fetch("https://pokeapi.co/api/v2/pokemon/").then((response) => {
        console.log(response);
        return response.json();
    }).then((responseJson) => {
        console.log(responseJson);
    });
}

obtenerPreciosDeApi();