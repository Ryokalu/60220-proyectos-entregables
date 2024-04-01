const btnLogin = document.getElementById("btnLogin")

const txtEmail = document.getElementById("txtEmail")
const txtPassword = document.getElementById("txtPassword")

const divError = document.getElementById("error_handler")


btnLogin.addEventListener('click', async e => {
    let empty = false

    if (txtEmail.value.trim() === '' && txtPassword.value.trim() === '') {
        alert('campos vacios')
        empty = true
    }

    if (!empty) {
        let user = {
            email: txtEmail.value.trim(),
            password: txtPassword.value.trim()
        }

        fetch('user/login', {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(r => {
            if (r.status === 200) {
                window.location.replace('/products')
            }

            if (r.status === 401) {
                const p = document.createElement("p")
                divError.append("Email o Constraseña Incorrectos", p)
            }
        })
    }


})