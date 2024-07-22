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

const roleStrTypeSchema = {
    type: String,
    default: "user"
}

const strDefaultTypeSchema = {
    type: String,
    default: ""
}

const userSchema = new mongoose.Schema({
    first_name: strTypeSchemaRequired,
    last_name: strTypeSchemaRequired,
    email: strTypeSchemaUniqueRequired,
    age: nmbrTypeSchemaRequired,
    password: strTypeSchemaRequired,
    loggedMethod: strTypeSchemaRequired,
    role: roleStrTypeSchema,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"
    },
    documents: {
        type: [{
            doc_name: strDefaultTypeSchema,
            reference: strDefaultTypeSchema,
        }],
        default: []
    },
    last_connection: strDefaultTypeSchema
})

// userSchema.pre('find', function () {
//     this.populate("carts")
// })

const userModel = mongoose.model(userCollection, userSchema)

export default userModel