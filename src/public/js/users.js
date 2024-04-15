function loadData() {

    const userId = localStorage.getItem('userID')
    const jwt = `Bearer ${localStorage.getItem('userToken')}`
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
                    // const loadhtml = document.getElementById('template').innerHTML
                    // console.log(loadhtml)
                    // const newTemplate = Handlebars.compile(loadhtml);
                    // console.log(newTemplate)
                    // console.log("Datos del usuario:", user);
                    // const loadTemplate = newTemplate(user);
                    // console.log(loadTemplate);
                    // document.getElementById('userTemplate').innerHTML = loadTemplate;

                    // ---- NOTA ----
                    // se ha intentado llenar la informacion utilazando las herramientas de handlebars,
                    // pero al momento de imprimir por consola los pasos para llenar la info las etiquetas de handelbars
                    // estas parece no existir por ende la informacion que se trata de llenar no logra se agregada al sitio y simplemente queda
                    // vacio busque por internet algun problema similar y ademas de ChatGPT pero no encontre solucion al problema
                    //--------



                    //este metodo me entrego mejores resultados
                    const div = document.getElementById('midiv')
                    const html = ` <h1> Perfil de: ${user.name}  </h1> <p>Tu email es: ${user.email}  </p>  <p>Tu Edad es: ${user.age} </p> <p>perfil: ${user.role} </p> `
                    div.innerHTML = html

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


