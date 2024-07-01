window.onload = function () {

    let actualDir = window.location.href
    let split = actualDir.split('/')

    cartID = split[split.length - 1]

    console.log(cartID)




}

const btnBuy = document.getElementById("btnComprar")

const userId = localStorage.getItem('userID')

btnBuy.addEventListener('click', async e => {
    fetch(`/api/carts/${cartID}/purchases`, {
        method: 'POST',
        body: JSON.stringify({ user: userId }),
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(status => {
        console.log(status)
    })
})