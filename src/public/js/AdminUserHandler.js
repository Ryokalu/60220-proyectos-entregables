
const btnUserSearch = document.getElementById("btnUserSearch")
const btnUserUpdate = document.getElementById("btnUserUpdate")
const btnUserDel = document.getElementById("btnUserDelete")

const txtUserID = document.getElementById("txtUserID")
const userRol = document.getElementById("userRol")
const innerTxt = document.getElementById("innerTxt")

const jwt = `Bearer ${localStorage.getItem('userToken')}`

btnUserSearch.addEventListener('click', async () => {

    if (verifyEmptyInputs()) {
        Toastify({
            text: "Campos vacios",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "red",
        }).showToast();
    }
    else {

        const id = txtUserID.value


        const response = await fetch(`/api/user/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt,
            },

        })

        if (response.status === 200) {

            const data = await response.json()

            if (lowCase(data.payload.role) === "user") userRol.value = "USER"
            if (lowCase(data.payload.role) === "premium") userRol.value = "PREMIUM"

            innerTxt.textContent = id

            Toastify({
                text: "Usuario encontrado",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "green",
            }).showToast();


        }

        if (response.status === 401 || response.status === 500) {


            const json = await response.json()

            Toastify({
                text: json.message,
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "Red",
            }).showToast();

        }
    }
})


btnUserUpdate.addEventListener('click', async () => {

    const rolValue = userRol.value
    const _id = innerTxt.textContent

    const data = { newRole: rolValue }

    const response = await fetch(`/user/admin/role/${_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt,
        },
        body: JSON.stringify(data)
    })

    const message = ""

    if (response.status === 200) {
        const json = await response.json()
        message = json.message

        Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "green",
        }).showToast();
    }

    if (response.status === 401) {
        const json = await response.json()
        message = json.message

        Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "red",
        }).showToast();
    }

    if (response.status === 500) {
        const json = await response.json()
        message = json.message

        Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "red",
        }).showToast();
    }
})


btnUserDel.addEventListener('click', async () => {

    const _id = innerTxt.textContent

    const response = await fetch(`/api/user/${_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt,
        },
    })

    const json = await response.json()
    message = json.message

    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "green",
    }).showToast();

})


window.onload = function () {

    fetch(`/admin/validator`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt,
        }
    }).then(status => {
        if (status.status === 200) {

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


function verifyEmptyInputs() {
    let inputs = document.querySelectorAll('input[type="text"]')
    let isEmpty = false
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[0].value.trim() === '') {
            isEmpty = true
        }
    }
    return isEmpty
}

function lowCase(text) {
    return text.toLowerCase()
}