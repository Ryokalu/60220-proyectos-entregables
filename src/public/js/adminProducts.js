
const txtTitleADD = document.getElementById("txtTitleCreate")
const txtDescriptionADD = document.getElementById("txtDescriptionCreate")
const txtpriceADD = document.getElementById("txtPriceCreate")
const txtstockADD = document.getElementById("txtStockCreate")
const txtcategoryADD = document.getElementById("txtCategoryCreate")
const txthumbnailADD = document.getElementById("txtThumbnailCreate")

const btnADD = document.getElementById("btnAgregar")


btnADD.addEventListener('click', async e => {
    let empty = false

    let title = txtTitleADD.value.trim()
    let description = txtDescriptionADD.value.trim()
    let price = txtpriceADD.value.trim()
    let stock = txtstockADD.value.trim()
    let category = txtcategoryADD.value.trim()
    let thumbnail = txthumbnailADD.value.trim()




    if (
        title === "" ||
        description === "" ||
        price === "" ||
        stock === "" ||
        category === "" ||
        thumbnail === ""
    ) {
        empty = true
    }

    if (!empty) {
        let product = {
            title,
            description,
            price,
            stock,
            thumbnail,
            category
        }

        fetch('/api/products', {
            method: "POST",
            body: JSON.stringify(product),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(data => {
            if (data.status = 200) {
                alert("Producto Creado")
            }
            else {
                console.log(data)
            }
        })


    }
})


const btnSearch = document.getElementById("btnSearch")

const txtIDPUT = document.getElementById("txtIDUpdate")

const txtTitlePUT = document.getElementById("txtTitleUpdate")
const txtDescriptionPUT = document.getElementById("txtDescriptionUpdate")
const txtpricePUT = document.getElementById("txtpriceUpdate")
const txtstockPUT = document.getElementById("txtstockUpdate")
const txtcategoryPUT = document.getElementById("txtcategoryUpdate")
const txthumbnailPUT = document.getElementById("txtthumbnailUpdate")

btnSearch.addEventListener('click', e => {
    let empty = false

    let id = txtIDPUT.value.trim()
    if (id === "") empty = true

    if (!empty) {
        fetch(`/api/products/${id}`, {
            method: "GET"
        }).then(data => {
            if (data.status = 200) {
                return data.json()
            }
            else {
                console.log(data)

            }
        }).then(json => {
            console.log(json.payload[0])
            txtTitlePUT.value = json.payload[0].title
            txtDescriptionPUT.value = json.payload[0].description
            txtpricePUT.value = json.payload[0].price
            txtstockPUT.value = json.payload[0].stock
            txtcategoryPUT.value = json.payload[0].category
            txthumbnailPUT.value = json.payload[0].thumbnail
        })
    }
})

const btnUpdate = document.getElementById("btnUpdate")

btnUpdate.addEventListener('click', async e => {

    let empty = false

    let id = txtIDPUT.value.trim()
    let title = txtTitlePUT.value.trim()
    let description = txtDescriptionPUT.value.trim()
    let price = txtpricePUT.value.trim()
    let stock = txtstockPUT.value.trim()
    let category = txtcategoryPUT.value.trim()
    let thumbnail = txthumbnailPUT.value.trim()

    if (
        id === "" ||
        title === "" ||
        description === "" ||
        price === "" ||
        stock === "" ||
        category === "" ||
        thumbnail === ""
    ) {
        empty = true
    }

    if (!empty) {
        let product = {
            title,
            description,
            price,
            stock,
            thumbnail,
            category
        }

        fetch(`/api/products/${id}`, {
            method: "PUT",
            body: JSON.stringify(product),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(data => {
            if (data.status = 200) {
                alert("Producto Actualizado")
            }
            else {
                console.log(data)
            }
        })
    }
})

const idDel = document.getElementById("txtIDDelete")
const btnDelete = document.getElementById("btnDelete")

btnDelete.addEventListener('click', async e => {
    let empty = false

    id = idDel.value.trim()

    if (id === "") empty = true

    if (!empty) {
        fetch(`/api/products/${id}`, {
            method: "DELETE"
        }).then(data => {
            if (data.status = 200) {
                alert("Producto Eliminado")
            }
            else {
                console.log(data)
            }
        })
    }
})

