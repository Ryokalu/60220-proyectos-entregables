const url = new URL(window.location.href);

const params = new URLSearchParams(url.search);

const token = params.get("token")
const _id = params.get("id")
const role = params.get("role")

localStorage.setItem('userToken', token)
localStorage.setItem('userID', _id)

if (role === "user") window.location.replace(`/user/current/`)