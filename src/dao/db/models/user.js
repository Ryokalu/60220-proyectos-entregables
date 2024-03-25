import mongoose from 'mongoose'

const userCollection = 'users'

const strTypeSchemaRequired = {
    type: String,
    require: true
}

const strTypeSchemaUniqueRequired = {
    type: String,
    require: true,
    unique: true
}

const nmbrTypeSchemaRequired = {
    type: Number,
    require: true
}


const userSchema = new mongoose.Schema({
    first_name: strTypeSchemaRequired,
    last_name: strTypeSchemaRequired,
    email: strTypeSchemaUniqueRequired,
    age: nmbrTypeSchemaRequired,
    password: strTypeSchemaRequired
})


const userModel = mongoose.model(userCollection, userSchema)

export default userModel