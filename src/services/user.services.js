import userModel from "../dao/db/models/user.js";

class userProvider {
    constructor() { }

    findOne = async (data) => {
        const user = await userModel.find(data)
        return user
    }

    createrUser = async (data) => {
        const status = await userModel.create(data)
        return status
    }

    deleteUser = async (id) => {
        const status = await userModel.deleteOne(id)
        return status
    }

    update = async (newData, id) => {
        const status = await userModel.updateOne(id, newData)
        return status
    }

    findAll = async () => {
        const status = await userModel.find()
        return status
    }

    deletedUserAfterTwoDays = async (date) => {
        const status = await userModel.deleteMany({
            last_connection: { $lt: date }, // selecciona las cuentas menor de a la fecha indicada
            role: { $ne: "admin" } // ignorar las cuentas con rol admin 
        })
        return status
    }

    selectedUserAfterTwoDays = async (date) => {
        const status = await userModel.find({
            last_connection: { $lt: date }, // selecciona las cuentas menor de a la fecha indicada
            role: { $ne: "admin" } // ignorar las cuentas con rol admin 
        })
        return status
    }

}

export default userProvider
