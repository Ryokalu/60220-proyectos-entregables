
const btnAsk = document.getElementById("btnask")
const txtCorreo = document.getElementById("txtCorreo")


btnAsk.addEventListener('click', async e => {

    if (verifyEmptyInputs()) {
        alert("Campos Vacios")
    }
    else {

        let email = txtCorreo.value.trim()

        let data = { "email": email }

        fetch('/recover', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(r => {
            if (r.status === 200) {
                alert("correo enviado")
            }
            else alert("no se puede validar la informacion")
        })
    }

})


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