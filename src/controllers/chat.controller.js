
import chatServices from "../services/chat.services.js";

export const render_Chat = (req, res) => {
    res.render('chat', { subTitle: "chat", style: "chat.css" })
}

let chat = new chatServices()

export const storeMessage = async message => await chat.saveMessage(message)  // revisar
export const getMessage = async message => await chat.loadMessage()  // revisar