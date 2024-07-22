const btnLogin = document.getElementById("btnLogin")

const txtEmail = document.getElementById("txtEmail")
const txtPassword = document.getElementById("txtPassword")

const divError = document.getElementById("error_handler")


btnLogin.addEventListener('click', async e => {
    let empty = false


    if (txtEmail.value.trim() === '' || txtPassword.value.trim() === '') {


        Toastify({
            text: "Campos vacios",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "green",
        }).showToast();

        empty = true
    }

    if (!empty) {
        let user = {
            email: txtEmail.value.trim(),
            password: txtPassword.value.trim()
        }



        const response = await fetch('/user/login', {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json',
            }
        })


        if (response.status === 200) {


            const json = await response.json()


            id = json.id

            localStorage.setItem('userToken', json.token)
            localStorage.setItem('userID', json.id)

            Toastify({
                text: json.message,
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "green",
            }).showToast();

            if (json.role === "user") window.location.replace(`/user/current/`)
            if (json.role === "admin") window.location.replace(`/user/administrator`)
            if (json.role === "premium") window.location.replace(`/user/administrator`)


        }

        if (response.status === 400 || response.status === 401) {

            divError.innerHTML = ""
            const p = document.createElement("p")
            divError.append("Email o Constraseña Incorrectos", p)


            Toastify({
                text: "Email o Constraseña Incorrectos.",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "red",
            }).showToast();

        }

        if (response.status === 500) {

            divError.innerHTML = ""
            const p = document.createElement("p")
            divError.append("error del servidor, favor de intentar mas tarde", p)

            Toastify({
                text: "error del servidor, favor de intentar mas tarde",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "red",
            }).showToast();

        }


    }


})