const socket = io()

const txt = document.getElementById("inputText")
const log = document.getElementById("log")
const btnSend = document.getElementById("btnSend")

let userEmail = ""


window.onload = async function () {

    const userId = localStorage.getItem('userID')

    fetch(`/api/user/validator/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(status => {
        if (status.status === 200) {
            return status.json()
        } else if (status.status === 401) {
            alert("tus credenciales vencieron vuelve a logear")
            window.location.replace('/login')
        }
        else if (status.status === 403) {

            alert("no estas autorizado para estar aqui")
            window.location.replace('/login')
        }
    }).then(json => {

        user = json.payload

        if (user.role === "user") {
            userEmail = user.email
        }

        if (user.role === "admin") {
            alert("no tienes permisos para estar aqui")
            window.location.replace('/user/administrator')
        }

    })

}


txt.addEventListener('keyup', evt => {
    if (evt.key === "Enter") {
        sendMessage()
    }
});

btnSend.addEventListener('click', evt => {
    sendMessage()
})


socket.on('log', data => {
    let logs = '';
    data.forEach(d => {
        logs += `(${d.fecha})   ${d.user} Dice: ${d.message} </br>`
    });
    log.innerHTML = logs;
});


function sendMessage() {
    let date = new Date()

    let yr = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()

    let hrs = date.getHours().toString()
    let min = date.getMinutes().toString()

    let actualDate = `${day}/${month}/${yr} ${hrs}:${min}`

    let inputChat = txt.value.trim()

    let send = { user: userEmail, message: inputChat, fecha: actualDate }
    socket.emit('message', send);



    Toastify({
        text: "mensaje enviado",
        duration: 3000
    }).showToast();


    txt.value = ""
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

