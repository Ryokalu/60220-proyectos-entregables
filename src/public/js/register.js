
const btnRegiserUser = document.getElementById("btnRegister")

const txtName = document.getElementById("txtName")
const txtLastName = document.getElementById("txtLastName")
const txtEmail = document.getElementById("txtEmail")
const txtAge = document.getElementById("txtAge")
const txtPassword = document.getElementById("txtPassword")
const txtValidate = document.getElementById("txtPasswordValidate")

const divError = document.getElementById("error_handler")


btnRegiserUser.addEventListener('click', async e => {
    if (!verifyEmptyInputs() && !verifyEmptyPass()) {

        if (txtPassword.value === txtValidate.value) {
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

                if (r.status === 401) {

                    Toastify({
                        text: "EMAIL Repetido, favor de utilizar otro",
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        backgroundColor: "red",
                    }).showToast();
                }
            })
        }
        else {

            Toastify({
                text: "las contraseñas no coinciden",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "red",
            }).showToast();

        }
    }
    else {

        Toastify({
            text: "Campos vacios",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "red",
        }).showToast();


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

function verifyEmptyPass() {
    let pass = document.querySelectorAll('input[type="password"]')

    let isEmpty = false
    for (let i = 0; i < pass.length; i++) {
        if (pass[0].value.trim() === '') {
            isEmpty = true
        }
    }
    return isEmpty
}