import emailRecover from "../dao/db/models/emailRecover.js";


class emailRecoverProvider {
    constructor() { }

    createRecover = async (data) => {
        const status = await emailRecover.create(data)
        return status
    }

    deleteRecover = async (id) => {
        const status = await emailRecover.deleteOne(id)
        return status
    }

    findOne = async (uuid) => {
        const status = await emailRecover.findOne(uuid)
        return status
    }


}

export default emailRecoverProvider