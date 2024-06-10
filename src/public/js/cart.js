
// const btnAddCart = document.getElementsByClassName("btnCart")
const btnAddCart = document.querySelectorAll(".common")

let cid
let pid


const userId = localStorage.getItem('userID')
const jwt = `Bearer ${localStorage.getItem('userToken')}`

btnAddCart.forEach(async btn => {

    btn.addEventListener('click', () => {

        let pid = btn.name
        fetch(`/api/carts/${cid}/products/${pid}`, {
            method: "POST",
            headers: {
                'Authorization': jwt,
            }
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

    fetch(`http://localhost:8080/api/user/${userId}`, {
        method: "GET",
        'Content-Type': 'application/json',
    })
        .then((response) => response.json())
        .then((json) => loadData(json))

}


function loadData(json) {
    cid = json.payload
    let enlace = document.getElementById("enlace")
    enlace.href = `/cart/${cid}`

}


const logout = document.getElementById("btnLogout")

logout.addEventListener('click', e => {
    window.location.replace('/user/logout')
})












