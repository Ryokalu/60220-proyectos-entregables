window.onload = function () {

    const jwt = `Bearer ${localStorage.getItem('userToken')}`

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