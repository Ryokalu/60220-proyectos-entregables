function loadData() {
    console.log("hola")
    const userId = localStorage.getItem('userID')
    const jwt = `Bearer ${localStorage.getItem('userToken')}`

    console.log(userId)
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
                    const html = ` <h1> Perfil de: ${user.name}  </h1> <p>Tu email es: ${user.email}  </p>  <p>Tu Edad es: ${user.age} </p> <p>perfil: ${user.role} </p> `
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


