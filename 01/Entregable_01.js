const { type } = require("os");

class ProductManager {
    constructor() {
        this.prod = []
    }

    addproduct(title, description, price, thumbnail, code, stock) {

        let val1 = false
        let val2 = false
        if (typeof title && typeof description && typeof price && typeof thumbnail && typeof code && typeof stock === 'undefined') {
            val1 = true;
        }

        if (title && description && price && thumbnail && code && stock === "") {
            val2 = true;
        }

        if (!val1 && !val2) {

            let validar = false;

            for (let i = 0; i < this.prod.length; i++) {
                if (this.prod[i].code === code) {
                    validar = true;
                }
            }

            if (!validar) {
                let id = this.prod.length + 1
                const newProd = {
                    id,
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock
                }
                this.prod.push(newProd);
                console.log(`el producto con codigo "${code}" fue agregado`)
            }
            else {
                console.log(`no se puede agregar el producto "${code}" ya existe en el sistema`)
            }
        }
        else {
            console.log("No dejar campos vacios");
        }

    }

    getProduct() {
        return this.prod
    }

    getProductByID(id) {

        const result = this.prod.filter(buscar => buscar.id === id);
        if (result.length == 0) {
            let mensaje = `Identificador "${id}" no encontrado`;
            return mensaje;
        }
        else {
            return result;
        }
    }

}

let prod = new ProductManager();

// Se realiza la primera busqueda
let comprobar = prod.getProduct();
console.log(comprobar)

// se agregan productos
prod.addproduct("producto prueba", "Este es un producto prueba", 200, "No imagen", "codigo", 255)
prod.addproduct("otro producto", "Este es otro producto", 300, "sin imagen", "otro codigo", 2554)
prod.addproduct("300", "sin imagen", "otro codigo", 2554)


// se trae  el unico producto agregado al array
let comprobar2 = prod.getProduct();
console.log(comprobar2)

// se agrega el tercer producto pero no se puede agregar por el que el code se repite
prod.addproduct("producto prueba", "Este es un producto prueba", 200, "No imagen", "codigo", 255)

// se realiza la busqueda por el primer ID
let buscarUno = prod.getProductByID(2);
console.log(buscarUno)

// se realiza la busqueda por un id que no existe
let buscarDos = prod.getProductByID(123);
console.log(buscarDos)


