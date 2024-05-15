export const createUserError = (user) => {
    return `La información proporcionada es inválida o está incompleta. Por favor, verifica tus datos y vuelve a intentarlo.
    
    -- Nombre se esperaba un <String> se recibió => "${user.first_name}"   
    -- apellido se esperaba un <String> se recibió => "${user.last_name} "
    -- email se esperaba un <String> se recibió => "${user.email}"
    -- edad se esperaba un <Number> se recibió => "${user.age}"
    -- contraseña se esperba un <String> se recibió => "${user.password}"
    `
};

export const loginUserError = (email, password) => {
    return `La información proporcionada es inválida o está incompleta. Por favor, verifica tus datos y vuelve a intentarlo.
    
    -- Email se esperaba un <String> se recibió => "${email}"  
    -- contraseña se esperba un <String> se recibió => "${password}"
    `
}


export const deleteUserError = (email) => {
    return `La información proporcionada es inválida o está incompleta. Por favor, verifica tus datos y vuelve a intentarlo.
    -- El Email: ${email} indicado no es valido o no se encuentra en el listado
    `
}