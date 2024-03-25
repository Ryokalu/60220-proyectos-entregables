import mongoose from "mongoose";

const chatCollection = 'message'

const chatSchema = new mongoose.Schema({
    user: String,
    message: String,
    fecha: String
})

export const chatModel = mongoose.model(chatCollection, chatSchema)