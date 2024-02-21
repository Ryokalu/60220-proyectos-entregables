const socket = io()

let buttonListen = document.getElementById("addProd")
let delListen = document.getElementById("delProd")
let inputTitle = document.getElementById("title")
let inputDes = document.getElementById("description")
let inputCode = document.getElementById("code")
let inputPrice = document.getElementById("price")
let inputStock = document.getElementById("stock")
let inputCat = document.getElementById("category")
let inputThumb = document.getElementById("thumbnail")
let inputID = document.getElementById("ID")

delListen.addEventListener('click', function () {


    let id = inputID.value.trim()
    let check = false

    console.log(isNaN(parseInt(id)))

    if (isNaN(id)) {
        alert("favor de ingresar un numero valido")
        check = true
    }

    if (id === "") {
        alert("Campo ID Vacio")
        check = true
    }

    if (!check) {
        console.log("hola")
        socket.emit("del", parseInt(id))
        inputID.value = ""
    }



})

buttonListen.addEventListener('click', function () {
    let title = inputTitle.value
    let description = inputDes.value
    let code = inputCode.value
    let price = inputPrice.value
    let stock = inputStock.value
    let category = inputCat.value
    let thumbnail = inputThumb.value

    let prodInfo = [{
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnail
    }]
    socket.emit('add', prodInfo)

    inputTitle.value = ""
    inputDes.value = ""
    inputCode.value = ""
    inputPrice.value = ""
    inputStock.value = ""
    inputCat.value = ""
    inputThumb.value = ""
})

socket.on('d', data => {
    console.log(data)
})


socket.on('success', data => {
    let divId = "prodList"
    let d = document.getElementById(divId)
    d.innerHTML = ""

    let div = document.createElement('div')
    div.className = "item"



    for (let i = 0; i < data.length; i++) {
        let div = document.createElement('div')
        div.className = "item"

        let pID = document.createElement('p')
        let pTitulo = document.createElement('p')
        let pDes = document.createElement('p')
        let pCode = document.createElement('p')
        let pEstado = document.createElement('p')
        let pPrice = document.createElement('p')
        let pStock = document.createElement('p')
        let pcat = document.createElement('p')
        let pThum = document.createElement('p')

        pID.innerHTML = "ID: " + data[i].id
        pTitulo.innerHTML = "Titulo: " + data[i].title
        pDes.innerHTML = "Descripcion: " + data[i].description
        pCode.innerHTML = "code: " + data[i].code
        pEstado.innerHTML = "estado: " + data[i].status
        pPrice.innerHTML = "price: " + data[i].price
        pStock.innerHTML = "stock: " + data[i].stock
        pcat.innerHTML = "category: " + data[i].category
        pThum.innerHTML = "thumbnail: " + data[i].thumbnail

        div.appendChild(pID)
        div.appendChild(pTitulo)
        div.appendChild(pDes)
        div.appendChild(pCode)
        div.appendChild(pEstado)
        div.appendChild(pPrice)
        div.appendChild(pStock)
        div.appendChild(pcat)
        div.appendChild(pThum)

        d.appendChild(div)
    }
})

socket.on('error', data => {
    if (data === 1) alert("Codigo Repetido, favor de ingresar otro")
    if (data === 3) alert("No dejar Campos Vacios")
    if (data === 4) alert("Identificador no encontrado")
    if (data === 5) alert("Listado no encontrado")
})



