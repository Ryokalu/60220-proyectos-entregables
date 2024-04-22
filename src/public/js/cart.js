
// const btnAddCart = document.getElementsByClassName("btnCart")
const btnAddCart = document.querySelectorAll(".common")
let cid
let pid

btnAddCart.forEach(async btn => {
    btn.addEventListener('click', () => {
        let pid = btn.name
        fetch(`http://localhost:8080/api/carts/${cid}/products/${pid}`, {
            method: "POST",
            body: {}
        })
            .then((response) => response.json())
            .then((json) => Toastify({
                text: json.response,
                duration: 3500,
                position: "top-center"
            }).showToast())

    })
});

window.onload = async function () {
    fetch("http://localhost:8080/api/carts", {
        method: "POST",
        body: JSON.stringify({})
    })
        .then((response) => response.json())
        .then((json) => createCart(json))


}

function createCart(data) {
    if (data.result === "success") {
        cid = data.payload._id
        Toastify({
            text: "Carrito Creado",
            duration: 3500,
            position: "top-center"
        }).showToast()
    }
    else {
        Toastify({
            text: "ERROR",
            duration: 3500,
            position: "top-center"
        }).showToast()
    }



}

const logout = document.getElementById("btnLogout")

logout.addEventListener('click', e => {
    window.location.replace('/user/logout')
})












