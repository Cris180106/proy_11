//Realizado por Cristian Pimiento Y Juan Pablo Bernal

/* Mi programa es una aplicación de línea de codigos que he creado para 
 gestionar productos en una tienda. Con esta herramienta, puedo agregar nuevos
 productos a la lista, visualizar la lista actual de productos y, cuando sea necesario
 , finalizar el programa. Los datos de los productos se almacenan en un archivo JSON 
 llamado "datos.json", lo que me permite mantener un registro actualizado de los 
 productos de la tienda*/


// Importación de módulos necesarios
const colors = require('colors');
const fs = require('fs').promises;
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Definición de la clase Producto
class Producto {
    constructor(codigo = '', nombre = '', inventario = 0, precio = 0) {
        // Define una clase para representar un producto con sus propiedades.
        this.codigoproducto = codigo;           // Código único del producto.
        this.nombreproducto = nombre;          // Nombre del producto.
        this.inventarioproducto = inventario;  // Cantidad en inventario del producto.
        this.precioproducto = precio;          // Precio del producto.
    }
}

// Definición de la clase ProductosTienda
class ProductosTienda {
    constructor() {
        // Define una clase que representa una lista de productos de la tienda.
        this.listaproductos = [];  // Una lista que almacena los productos en la tienda.
    }

    mostrarProductos() {
        // Define un método para mostrar los productos en la lista.
        this.listaproductos.forEach((producto) => {
            // Muestra los detalles de cada producto en la lista de manera formateada.
            console.log(
                '╟━━━━━━━━━━━━━━╢',
                `Código: ${producto.codigoproducto}`.cyan,
                `Nombre: ${producto.nombreproducto}`.cyan,
                `Inventario: ${producto.inventarioproducto}`.cyan,
                `Precio: ${producto.precioproducto}`.cyan,
                '╢'
            );
        });
    }
}

// Función para cargar productos desde un archivo
const cargarProductosDesdeArchivo = async (productostienda) => {
    const nombrearchivo = './datos.json';  // Nombre del archivo que contiene los datos de productos.

    fs.readFile(nombrearchivo, 'utf-8')
        .then((data) => {
            // Utiliza `.then` para manejar el caso en que la lectura del archivo se realiza con éxito.
            // La variable `data` contiene el contenido del archivo leído.

            // Parsea los datos del archivo y los almacena en la lista de productos.
            productostienda.listaproductos = JSON.parse(data);

            // Muestra un mensaje de éxito si la carga fue exitosa.
            console.log('Productos cargados desde datos.json'.bgBlue);
        })
        .catch((error) => {
            // Utiliza `.catch` para manejar el caso en que ocurre un error durante la lectura del archivo.

            // Muestra un mensaje de error que incluye el mensaje específico de error.
            console.error(`Error al cargar el archivo: ${error.message}`.bgRed);
        });
};

// Función para agregar un producto a la lista y guardar en un archivo
const agregarProducto = async (productostienda, nuevoProducto) => {
    // Define una función asincrónica para agregar un producto a la lista y guardar la lista en un archivo.
    productostienda.listaproductos.push(nuevoProducto);  // Agrega el nuevo producto a la lista de productos.
    console.log('Producto agregado:'.bgGreen);
    console.log(nuevoProducto);  // Muestra los detalles del producto agregado.

    const nombrearchivo = './datos.json';  // Nombre del archivo de datos.
    const cadenaJson = JSON.stringify(productostienda.listaproductos, null, 2);

    fs.writeFile(nombrearchivo, cadenaJson, 'utf-8')
        .then(() => {
            // Utiliza `.then` para manejar el caso en que la escritura del archivo se realiza con éxito.
            console.log(`DATOS GUARDADOS EN ${nombrearchivo}`.bgBlue);
        })
        .catch((error) => {
            // Utiliza `.catch` para manejar el caso en que ocurre un error durante la escritura del archivo.

            // Muestra un mensaje de error que incluye el mensaje específico de error.
            console.error(`Error al guardar el archivo: ${error.message}`.bgRed);
        });
};

// Función para mostrar el menú de opciones
const mostrarMenu = () => {
    return new Promise((resolve) => {
        // Define una función que muestra un menú de opciones y devuelve la opción seleccionada por el usuario.
        console.log('1'.magenta, 'Agregar un nuevo producto');
        console.log('2'.magenta, 'Lista de productos');
        console.log('3'.magenta, 'Finalizar programa\n');

        readline.question('Opción: ', (opt) => {
            resolve(opt);
        });
    });
};

// Función para pausar y esperar la entrada del usuario
const pausa = () => {
    return new Promise((resolve) => {
        // Define una función que pausa la ejecución y espera hasta que el usuario presione "ENTER" para continuar.
        readline.question(`\nPresiona ${'ENTER'.cyan} para continuar\n`, (opt) => {
            resolve();
        });
    });
};


// Función para obtener detalles de un nuevo producto desde el usuario
const obtenerDetallesProducto = async () => {
    return new Promise((resolve) => {
        const nuevoProducto = new Producto();

        readline.question('Código del producto: ', (codigo) => {
            nuevoProducto.codigoproducto = codigo;
            readline.question('Nombre del producto: ', (nombre) => {
                nuevoProducto.nombreproducto = nombre;
                readline.question('Inventario del producto: ', (inventario) => {
                    nuevoProducto.inventarioproducto = parseInt(inventario);
                    readline.question('Precio del producto: ', (precio) => {
                        nuevoProducto.precioproducto = parseFloat(precio);
                        resolve(nuevoProducto);
                    });
                });
            });
        });
    });
};

// Se define una constante llamada main de tipo asyncronica que va a ser la principal del programa
const main = async () => {
    console.clear();

    // Creación de una instancia de la clase ProductosTienda
    let productostienda = new ProductosTienda();

    // Carga de productos desde un archivo al inicio
    await cargarProductosDesdeArchivo(productostienda);

    let opcion;

    do {
        // Mostrar el menú y obtener la opción del usuario
        opcion = await mostrarMenu();

        switch (opcion) {
            case '1':
                // Agregar un nuevo producto
                console.clear();
                console.log('=== AGREGAR NUEVO PRODUCTO ==='.cyan);
                const nuevoProducto = await obtenerDetallesProducto();
                await agregarProducto(productostienda, nuevoProducto);
                await pausa();
                break;
            case '2':
                // Mostrar la lista de productos
                console.clear();
                console.log('=== LISTA DE PRODUCTOS ==='.cyan);
                productostienda.mostrarProductos();
                await pausa();
                break;
            case '3':
                // Finalizar el programa
                console.log('=== PROGRAMA FINALIZADO ==='.bgMagenta);
                break;
            default:
                console.log('Opción no válida. Por favor, elige una opción válida.'.bgRed);
                await pausa();
                break;
        }
    } while (opcion !== '3');
    
    // Cierra la interfaz de línea de comandos.
    readline.close();
};

// Llama a la función principal para comenzar el programa.
main();
