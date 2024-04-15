import { chatModel } from "./models/chat.js";


export default class chatServices {

    constructor() { }

    saveMessage = async (fullMessage) => {
        let status = chatModel.create(fullMessage)
        return status
    }

    loadMessage = async () => {
        let messages = await chatModel.find()
        return messages.map(a => a.toObject())
    }

}