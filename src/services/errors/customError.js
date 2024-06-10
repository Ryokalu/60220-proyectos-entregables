export default class CustomError {
    static createError({ name = "Error", cause, message }) {
        const error = new Error(message)
        error.name = name
        error.cause = cause ? new Error(cause) : null
        throw error
    }
}

