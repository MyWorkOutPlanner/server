import UserModel from "../models/UserModel.js"
import { createHash } from "../utils/hash.js"


export const createUser = async (payload) => {
try{
    const user = await UserModel.create({ ...payload,
         password: createHash(payload.password)})
         return user
}catch (err) {
    throw Error(err)
}
}
export const loginUser = async (payload) => {
    try {
        const user = await UserModel.findOne({ email: payload.email });
        if (!user) return false;
    
        //compare the password
        const passwordMatch = compareHash(payload.password, user.password);
        if (!passwordMatch) return false;
    
        return user;
      } catch (error) {
        throw Error(error);
      }
}