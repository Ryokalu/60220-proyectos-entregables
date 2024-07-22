const btnAsk = document.getElementById("btnask")
const txtCorreo = document.getElementById("txtCorreo")


btnAsk.addEventListener('click', async e => {

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

                Toastify({
                    text: "correo enviado",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "green",
                }).showToast();


            }
            else if (r.status === 401) {
                Toastify({
                    text: "Correo no encontrado en el sistema",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "red",
                }).showToast();
            }
            else {
                Toastify({
                    text: "Error del sistema, intente mas tarde",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "red",
                }).showToast();
            }
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