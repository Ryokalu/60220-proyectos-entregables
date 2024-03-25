
const btnRegiserUser = document.getElementById("btnRegister")

const txtName = document.getElementById("txtName")
const txtLastName = document.getElementById("txtLastName")
const txtEmail = document.getElementById("txtEmail")
const txtAge = document.getElementById("txtAge")
const txtPassword = document.getElementById("txtPassword")
const divError = document.getElementById("error_handler")

btnRegiserUser.addEventListener('click', async e => { // revisar campos vacios
    let data = {
        first_name: txtName.value.trim(),
        last_name: txtLastName.value.trim(),
        email: txtEmail.value.trim(),
        age: txtAge.value.trim(),
        password: txtPassword.value.trim()
    }

    fetch('/user/register', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(r => {
        if (r.status === 200) {
            window.location.replace('/login')
        }

        if (r.status === 402) {
            const p = document.createElement("p")
            divError.append("EMAIL Repetido, favor de utilizar otro", p)
        }
    })
})