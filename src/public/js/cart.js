
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

    fetch(`/api/user/${userId}`, {
        method: "GET",
        'Content-Type': 'application/json',
    })
        .then((response) => response.json())
        .then((json) => loadData(json))

}


function loadData(json) {
    data = json.payload

    cid = data.cart
    let enlace = document.getElementById("enlace")
    enlace.href = `/cart/${cid}`

    const hUser = document.getElementById("hUser")

    hUser.innerHTML = ""
    hUser.innerHTML = `Bienvenido Sr/a ${data.first_name} ${data.last_name} -- Edad: ${data.age}`

}

const closeSesion = document.getElementById("close")

closeSesion.addEventListener('click', e => {

    const userId = localStorage.getItem('userID')



    const data = { '_id': userId }



    fetch('/user/logout', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response => {
        if (response.status === 200) {
            response.json()
                .then(json => {

                    Toastify({
                        text: json.Response,
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        backgroundColor: "red",
                    }).showToast();


                    localStorage.clear()
                    window.location.replace('/login')
                })
        }
        else {
            response.json()
                .then(json => {
                    alert(json.Response)
                })
        }
    })


})












