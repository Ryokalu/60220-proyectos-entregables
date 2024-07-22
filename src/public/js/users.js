function loadData() {

    const userId = localStorage.getItem('userID')
    const jwt = `Bearer ${localStorage.getItem('userToken')}`


    fetch(`/user/current/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt,
        }
    }).then(status => {
        if (status.status === 200) {
            status.json()
                .then(user => {
                    const div = document.getElementById('midiv')
                    const html = ` <h2> Tu Perfil: ${user.name}  </h2> <p>Tu email es: ${user.email}  </p>  <p>Tu Edad es: ${user.age} </p> <p>perfil: ${user.role} </p> `
                    div.innerHTML = html
                    let enlace = document.getElementById("enlace")
                    enlace.href = `/cart/${user.cart}`

                })
        } else if (status.status === 401) {
            alert("tus credenciales vencieron vuelve a logear")
            window.location.replace('/login')
        }
        else if (status.status === 403) {

            alert("no estas autorizado para estar aqui")
            window.location.replace('/login')
        }
    })
}

window.onload = function () {
    loadData()
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

