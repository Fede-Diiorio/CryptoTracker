<-- SOBRE EL PROYECTO -->

Para este trabajo, se utilizó la API de Binance. Mediante funciones, se filtran ciertos pares para contrastar, en lo posible, todos los tickers contra el USDT. Una vez filtrados todos los pares, estos se renderizan según la búsqueda realizada. Al renderizar todos los pares filtrados en la búsqueda, deberás hacer clic en el par que necesites, y te pedirá que definas la cantidad de monedas deseadas. Con estos datos obtenidos mediante el DOM, se irán mostrando todas las monedas en pantalla.

<-- COMO INSTALAR SASS PARA EL CORRECTO FUNCIONAMIENTO DE ESTE PROYECTO -->

1. Abrir la consola en esta carpeta con ctrl+ñ
    a. npm install nodemon node-sass
    b. npm init // Metralleta de enter

2. Abrir el archivo package.json y editarlo
    a. A continuación de && exit 1" colocar una , presionar enter
    y pegar el siguiente texto:

"build-css": "node-sass --include-path scss scss/main.scss css/style.css",
"watch-css": "nodemon -e scss -x \"npm run build-css\""

3. Crear las carpetas con sus respectivos archivos (EN CASO NO SE REQUIERE)
    a. scss/main.scss
    b. css/style.css

4. En la consola correr el comando
    a. npm run build-css //Por única vez
    b. npm run watch-css

--------------------------------------------

5. Cada vez que se quiera seguir compilando en SASS
    a. abrir la consola con ctrl+ñ
    b. npm run watch-css

//FIN