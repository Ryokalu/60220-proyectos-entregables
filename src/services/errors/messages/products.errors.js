export const createProdError = (prod) => {
    return `la informacion que estas tratando de ingresar no es valida, por favor revise esta informacion
    
    -- Titulo: se esperaba un <String> se recibió => "${prod.title}" 
    -- Descripcion: se esperaba un <String> se recibió => "${prod.description}" 
    -- precio: se esperaba un <Number> se recibió => "${prod.price}" 
    -- stock: se esperaba un <Number> se recibió => "${prod.stock}"
    -- category: se esperaba un <String> se recibió => "${prod.category}"
    -- thumbnail: se esperaba un <String> se recibió => "${prod.thumbnail}"

    
    
    `
}


export const deleteProdError = (pid) => {
    return `la informacion que estas tratando de ingresar no es valida,
    -- el Id del producto ${pid} no es valido, por favor de revisar    
    `
}