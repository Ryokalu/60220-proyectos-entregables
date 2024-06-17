
const url = window.location.pathname
const split = url.split('/')
const uuid = split.pop();

const btnNewpass = document.getElementById("btnNewpass")
const txtPassword = document.getElementById("txtPassword")

btnNewpass.addEventListener('click', async e => {

    if (verifyEmptyInputs()) {
        alert("Campos Vacios")
    }
    else {
        let pass = txtPassword.value.trim()
        let data = {
            "password": pass,
            "uuid": uuid
        }

        fetch('/recover/passwordCheck', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(r => {
            if (r.status === 200) {
                alert("Constraseña modificada correctamente")
                window.location.replace('/login')
            }
            else alert("no se puede validar la informacion")
        })
    }


})



function verifyEmptyInputs() {
    let inputs = document.querySelectorAll('input[type="password"]')
    let isEmpty = false
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[0].value.trim() === '') {
            isEmpty = true
        }
    }
    return isEmpty
}