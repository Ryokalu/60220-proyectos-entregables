import userModel from "./models/user.js";

class userProvider {
    constructor() { }

    findOne = async (data) => {
        let user = await userModel.find(data)
        return user
    }

    createrUser = async (data) => {
        let status = await userModel.create(data)
        return status
    }

    deleteUser = async (id) => {
        let status = await userModel.deleteOne(id)
    }
}

export default userProvider
