import mongoose from "mongoose";

const ticketCollection = 'ticket'

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

const ticketSchema = new mongoose.Schema({
    code: strTypeSchemaUniqueRequired,
    purchase_dateTime: strTypeSchemaRequired,
    amount: nmbrTypeSchemaRequired,
    purchaser: strTypeSchemaRequired

})

export const TicketModel = mongoose.model(ticketCollection, ticketSchema)

