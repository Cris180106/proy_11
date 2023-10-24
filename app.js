//Realizado por Cristian Pimiento Y Juan Pablo Bernal

/* Mi programa es una aplicación de línea de codigos que he creado para 
 gestionar productos en una tienda. Con esta herramienta, puedo agregar nuevos
 productos a la lista, visualizar la lista actual de productos y, cuando sea necesario,
  finalizar el programa. Los datos de los productos se almacenan en un archivo JSON 
 llamado "datos.json", lo que me permite mantener un registro actualizado de los 
 productos de la tienda*/



// Importamos la biblioteca 'colors' para dar formato al texto en la consola.
const colors = require('colors');

// Importamos la biblioteca 'fs.promises' para trabajar con archivos de forma asincrónica.
const fs = require('fs').promises;

// Creamos una interfaz de línea de comandos para interactuar con la entrada y salida estándar (consola).
const readline = require('readline').createInterface({
    input: process.stdin,  // Configuramos la entrada para leer desde la consola y permite interactuar con el usuario
    output: process.stdout  // Configuramos la salida para escribir en la consola y permite interactuar con el usuario
});



//Hemos definido una clase llamada Producto que representa un producto con sus propiedades el cual contiene 4 parametros.
class Producto {
    //se crea un metodo constructor de la clase producto para poder instancoia esos mismos 4 parametros
    constructor(codigo = '', nombre = '', inventario = 0, precio = 0) {
        this.codigoproducto = codigo;           // Código único del producto.
        this.nombreproducto = nombre;          // Nombre del producto.
        this.inventarioproducto = inventario;  // Cantidad en inventario del producto.
        this.precioproducto = precio;          // Precio del producto.
    }
}


// creamos una clase llamada "ProductosTienda" que contendrá información sobre los productos de la tienda
class ProductosTienda {
    // se crea una funcion constructor para que cuando creemos un producto, esta  se activa automáticamente con la lista que va a almacenar todos los productos.
    constructor() {
        // Inicializamos una lista vacía para almacenar productos dentro de la clase.
        this.listaproductos = [];
    }

    // Se crea un método que permite mostrar  los objetos (productos) almacenados en la lista.
    mostrarProductos() {
        //se crea una iteracion para recorrer cada uno de los productos en la lista y llamarlos a la consola
        this.listaproductos.forEach((producto) => {//foreach se utiliza para llamar cada uno de los productos del arreglo de forma rapida y no hacerlo uno por uno
            console.log(
                '╟━━━━━━━━━━━━━━╢', 
                `Código: ${producto.codigoproducto}`.cyan, // Muestra el código del producto.
                `Nombre: ${producto.nombreproducto}`.cyan, // Muestra el nombre del producto.
                `Inventario: ${producto.inventarioproducto}`.cyan, // Muestra la cantidad en inventario del producto.
                `Precio: ${producto.precioproducto}`.cyan, // Muestra el precio del producto.
                '╢' // Línea visual
            );
        });
    }
}


// se crea una constante de tipo asincrónica en forma de función flecha para cargar productos desde un archivo y los almacena en la lista de productos de la tienda.
const cargarProductosDesdeArchivo = async (productostienda) => {
     // Creamos una constante llamada "nombrearchivo" para llamar el archivo que contiene los datos de productos.
     const nombrearchivo = './datos.json';

     // Utilizamos la función "fs.readFile" para leer de forma asincrónica el contenido del archivo "nombrearchivo" en este caso los datos de los productos
    fs.readFile(nombrearchivo, 'utf-8')
        .then((data) => {/* then se utiliza para manejar el caso en que una operación asincrónica se completa con éxito, en 4ste caso
            se utiliza para manejar el éxito de la lectura o pocesar la informacion del archivo.*/
            
            //convertimos los datos del archivo que están en formato JSON en una lista de productos y la asignamos a "productostienda.listaproductos" para poder verlos en la consola
            productostienda.listaproductos = JSON.parse(data);
            //si la lectura de los archivos de manera asincronica se realiza con exito, vota este mensaje
            console.log('Productos cargados desde datos.json'.bgBlue);
        })
        .catch((error) => {
            //se utiliza catch para manejar cualquier error que pueda ocurrir durante la lectura del archivo.

            // si hay un error en los datos leidos de manera asincronica vota este mensaje
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

// Se define una constante asincrónica que muestra un menú de opciones y devuelve la opción seleccionada por el usuario.
const mostrarMenu = () => {
    return new Promise((resolve) => {
        // Esta función devuelve una promesa que resuelve la opción seleccionada por el usuario.

        // Imprimimos en la consola las opciones disponibles para que el usuario elija.
        console.log('1'.magenta, 'Agregar un nuevo producto');
        console.log('2'.magenta, 'Lista de productos');
        console.log('3'.magenta, 'Finalizar programa\n');

        // Usamos la función flecha readline para obtener la opción seleccionada por el usuario.
        readline.question('Opción: ', (opt) => {
            // Resolvemos la promesa con la opción ingresada por el usuario.
            resolve(opt);
        });
    });
};

// Se define una constante asincrónica que pausa la ejecución y espera hasta que el usuario presione enter para continuar.
const pausa = () => {
    return new Promise((resolve) => {
        // Esta función devuelve una promesa que se resuelve cuando el usuario presiona enter.

        // mostramos un mensaje en la consola para indicar al usuario como debe continuar, en este caso debe oprimir enter.
        readline.question(`\nPresiona ${'ENTER'.cyan} para continuar\n`, (opt) => {
            // Resolvemos la promesa cuando el usuario presiona la tecla asignada.
            resolve();
        });
    });
};


// Se define una constante asincrónica en forma de función flecha que obtiene detalles de un nuevo producto desde el usuario.
const obtenerDetallesProducto = async () => {
    return new Promise((resolve) => {
        // Esta función devuelve una promesa que se resuelve cuando se obtienen los detalles del nuevo producto del usuario.

        // Creamos un objeto que se llama (nuevoProducto() de la clase Producto.
        const nuevoProducto = new Producto();

        // Usamos vartios (readline.question) en forma de funcon flecha para obtener información que el  usuario proporciono sobre producto ingresado.
        readline.question('Código del producto: ', (codigo) => {
            nuevoProducto.codigoproducto = codigo;
            readline.question('Nombre del producto: ', (nombre) => {
                nuevoProducto.nombreproducto = nombre;
                readline.question('Inventario del producto: ', (inventario) => {
                    nuevoProducto.inventarioproducto = parseInt(inventario);
                    readline.question('Precio del producto: ', (precio) => {
                        nuevoProducto.precioproducto = parseFloat(precio);
                        
                        // Resolvemos la promesa con los detalles completos del nuevo producto.
                        resolve(nuevoProducto);
                    });
                });
            });
        });
    });
};



// Se define una constante asincrónica en forma de función flecha que es la función principal del programa donde va a iniciar el menu de la aplicacion.
const main = async () => {
    // se usa para limpia la consola al inicio del programa.
    console.clear();

    // Creamos una variable para  instanciar la clase ProductosTienda y gestionar los productos.
    let productostienda = new ProductosTienda();

    /* se usa await para esperar que los datos en la funcion (c¿cargarProductosDesdeArchivo)se lean y carguen 
    correctamente antes de continuar el programa y que no hayan errores*/
    await cargarProductosDesdeArchivo(productostienda);

    let opcion;

    // Se utiliza esta estructura de control do while para mantener la interacción con el usuario hasta que elija finalizar el programa.
    do {
        // se utiliza await  para mostrar un menu de opciones y esperar que el usuario elija alguna opcion
        opcion = await mostrarMenu();

       // Se utiliza la estructura de control switch para ejecutar metodos y mostrar mensajes en la consola dependiendo de la opcion que tome el usuario.
        switch (opcion) {
            case '1':
                // Agregar un nuevo producto
                console.clear();
                console.log('=== AGREGAR NUEVO PRODUCTO ==='.cyan);

                // Se define una constante llamada (nuevoProducto) que va a obtener los detalles del producto proporcionado por el usuario.
                const nuevoProducto = await obtenerDetallesProducto();

                /* Se utiliza esta línea para agregar el nuevo producto a la lista de productos gestionada por la instancia de 
                (ProductosTienda) y guardar la lista actualizada en datos.json.*/
                await agregarProducto(productostienda, nuevoProducto);


                // se pausa la ejecución hasta que el usuario presione enter.
                await pausa();
                break;

            case '2':
                // Mostrar la lista de productos
                console.clear();
                console.log('=== LISTA DE PRODUCTOS ==='.cyan);

                // muestra los detalles de los productos almacenados en la lista guardada en satos.json.
                productostienda.mostrarProductos();

                // se pausa ausa la ejecución hasta que el usuario presione enter.
                await pausa();
                break;

            case '3':
                // finaliza la ejecucion de la aplicaion
                console.log('=== PROGRAMA FINALIZADO ==='.bgMagenta);
                break;

            default:
                // se muestra este mensaje en el caso que el usuario proporcione una respuesta diferente a la del menu
                console.log('Opción no válida. Por favor, elige una opción válida.'.bgRed);

                // se pausa la ejecución hasta que el usuario presione enter.
                await pausa();
                break;
        }
    } while (opcion !== '3'); // el bucle continúa hasta que el usuario selecciona la opción 3 para finalizar.

    // Cierra la interfaz de lectura de las respuestas del usuario
    readline.close();
};

main();

