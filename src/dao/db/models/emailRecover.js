import mongoose from "mongoose";

const emailRecoverCollection = "EmailRecover"

const strTypeSchemaRequired = {
    type: String,
    require: true
}

const strTypeSchemaUniqueRequired = {
    type: String,
    require: true,
    unique: true
}


const emailRecoverSchema = new mongoose.Schema({
    recoverID: strTypeSchemaUniqueRequired,
    email: strTypeSchemaRequired,
    expiration_date: strTypeSchemaRequired,

})


const emailRecover = mongoose.model(emailRecoverCollection, emailRecoverSchema)

export default emailRecover