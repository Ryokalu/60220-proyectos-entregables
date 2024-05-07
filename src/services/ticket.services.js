import { TicketModel } from "../dao/db/models/ticket.js";
import { v4 as uuid } from "uuid"

import emailSender from "./email.services.js";

const emailManager = new emailSender()

class ticketProvider {
    constructor() { }

    createTicket = async (data) => {

        let date = new Date()

        let yr = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()

        let hrs = date.getHours().toString()
        let min = date.getMinutes().toString()

        let actualDate = `${day}/${month}/${yr} ${hrs}:${min}`

        const ticket = {
            code: uuid(),
            purchase_dateTime: actualDate,
            amount: data.amount,
            purchaser: data.purchaser
        }

        const emailStatus = await emailManager.sendEmail(ticket)
        console.log(emailStatus)


        const status = await TicketModel.create(ticket)

        return status

    }
}

export default ticketProvider