window.onload = function () {

    let actualDir = window.location.href
    let split = actualDir.split('/')

    cartID = split[split.length - 1]

}

const btnBuy = document.getElementById("btnComprar")

const userId = localStorage.getItem('userID')

btnBuy.addEventListener('click', async e => {
    const status = await fetch(`/api/carts/${cartID}/purchases`, {
        method: 'POST',
        body: JSON.stringify({ user: userId }),
        headers: {
            'Content-Type': 'application/json',
        }
    })

    Swal.fire({
        title: 'Listo!',
        text: 'Su compra ha sido procesada',
        icon: 'success',
        confirmButtonText: 'OK',
        allowOutsideClick: false
    }).then(result => {
        if (result.isConfirmed) location.reload()
    })




})

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

                    // alert(json.Response)
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