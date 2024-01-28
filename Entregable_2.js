const { match } = require("assert")



class Productos {
    constructor(id, title, description, price, thumbnail, code, stock) {
        this.id = id
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.stock = stock
    }
}




class ProductManager {
    path
    #fileSys
    #prod
    #archivo

    constructor(path) {
        this.path = path
        this.#fileSys = require("fs");
        this.#archivo = this.path + "/productosFinal.js"
        this.#prod = new Array()
    }


    async addproduct(title, description, price, thumbnail, code, stock) {
        try {
            let val1 = false
            let val2 = false

            if (typeof title && typeof description && typeof price && typeof thumbnail && typeof code && typeof stock === 'undefined') {
                val1 = true;
            }

            if (title === "" || description === "" || price === "" || thumbnail === "" || code === "" || stock === "") {
                val2 = true;
            }

            if (!val1 && !val2) {

                await this.#fileSys.promises.mkdir(this.path, { recursive: true });

                if (!this.#fileSys.existsSync(this.#archivo)) {
                    await this.#fileSys.promises.writeFile(this.#archivo, "[]")
                }

                let prodFiles = await this.#fileSys.promises.readFile(this.#archivo, 'utf-8')
                this.#prod = JSON.parse(prodFiles)

                let idAleatorio = this.#prod.length + Math.floor(Math.random() * (100 - 1 + 1) + 1)

                let productosNuevos = new Productos(idAleatorio + 1, title, description, price, thumbnail, code, stock);
                this.#prod.push(productosNuevos)

                let validar = false
                let vacio = false


                if (prodFiles === "[]") {
                    vacio = true
                }

                if (vacio) {
                    await this.#fileSys.promises.writeFile(this.#archivo, JSON.stringify(this.#prod, null, 2, '\t'))
                }
                else {
                    for (let i = 0; i < this.#prod.length - 1; i++) {
                        if (this.#prod[i].code === code) {
                            validar = true;
                        }
                    }
                    if (!validar) {
                        await this.#fileSys.promises.writeFile(this.#archivo, JSON.stringify(this.#prod, null, 2, '\t'))
                    }
                    else {
                        console.log("codigo repetido")
                    }
                }
            }
            else {
                console.log("No dejar campos vacios");
            }
        } catch (error) {
            console.log(error)
        }
    }




    async getProduct() {

        if (this.#fileSys.existsSync(this.#archivo)) {
            let ProductosFile = await this.#fileSys.promises.readFile(this.#archivo, "utf-8")
            let lista = JSON.parse(ProductosFile)
            return lista
        }
        else return []
    }

    async getProductById(id) {
        if (this.#fileSys.existsSync(this.#archivo)) {
            let ProductosFile = await this.#fileSys.promises.readFile(this.#archivo, "utf-8")
            let lista = JSON.parse(ProductosFile)
            let buscarID = lista.filter(buscar => buscar.id === id)
            console.log(buscarID)
            if (buscarID.length === 0) {
                let mensaje = `Identificador "${id}" no encontrado`;
                return mensaje;
            }
            else return buscarID
        }
        else return "lista no encontrado :("
    }

    async deleteProductByID(id) {
        if (this.#fileSys.existsSync(this.#archivo)) {
            let ProductosFile = await this.#fileSys.promises.readFile(this.#archivo, "utf-8")
            let lista = JSON.parse(ProductosFile)
            let listaLargo = lista.length
            let prodEliminado = lista.filter(buscar => buscar.id !== id)
            let prodEliminadoLargo = prodEliminado.length
            if (listaLargo === prodEliminadoLargo) { // es para identificar si se encontro el elemento
                return `Identificador "${id}" no encontrado`
            }
            else {
                await this.#fileSys.promises.writeFile(this.#archivo, JSON.stringify(prodEliminado, null, 2, '\t'))
                return `Producto con identetificado "${id}" eliminado correctamente`
            }
        }
        else return "lista no encontrado D:"
    }

    async updateitemById(id, datoCambiar) {
        if (this.#fileSys.existsSync(this.#archivo)) {
            let ProductosFile = await this.#fileSys.promises.readFile(this.#archivo, "utf-8")
            let lista = JSON.parse(ProductosFile)
            let indice = lista.findIndex(buscar => buscar.id === id)
            if (indice !== -1) {
                lista[indice] = { ...lista[indice], ...datoCambiar }
                await this.#fileSys.promises.writeFile(this.#archivo, JSON.stringify(lista, null, 2, '\t'))
                return `Identificador "${id}" modificado correctamente"`
            } else return `Identificador "${id}" no encontrado`

        } else return "lista no encontrado D:"
    }

}

let prod = new ProductManager("productos");



// se agregan productos


let persistirProd = async () => {

    let productosVacios = await prod.getProduct();
    console.log(productosVacios)
    // await prod.addproduct("producto prueba", "producto ejemplo", 200, "No imagen", "codigo", 255)
    // await prod.addproduct("producto prueba", "producto ejemploproducto ejemplo", 200, "No imagen", "codigo2", 255)
    // await prod.addproduct("producto prueba", "producto ejemploproducto ejemplo", 200, "No imagen", "codigo3", 255)
    // await prod.addproduct("producto prueba", "producto ejemploproducto ejemplo", 200, "No imagen", "codigo4", 255)
    // await prod.addproduct("", "producto ejemploproducto ejemplo", 200, "No imagen", "codigo4", 255)
    // let productos = await prod.getProduct();
    // console.log(productos)
    // let buscarPorID = await prod.getProductById(1123);
    // console.log(buscarPorID)
    let eliminarPorID = await prod.deleteProductByID(5);
    console.log(eliminarPorID)
    // let datosCambiar = { title: "titulo Cambiado :O", description: "otra descripcion :D" }
    // let cambioPorID = await prod.updateitemById(1, datosCambiar)
    // console.log(cambioPorID)

}

persistirProd()