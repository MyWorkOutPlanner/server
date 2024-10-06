import UserModel from "../models/UserModel.js"
import { createHash, compareHash } from "../utils/hash.js"


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

export const getUserById = async (id) => {
  const user = await UserModel.findById(id);
  if (!user) throw new Error("User does not exist");
  return {
    id: user.id,
    fullName: user.fullName,
    avatar: user.avatar,
    email: user.email,
  };
};

export const updateUser = async (userId, payload) => {
  try {
    let data = await UserModel.findById(userId);

    //editable column restriction
    const editableColumn = [
      "fullName",
      "avatar",
    ];

    Object.keys(payload).forEach((key) => {
      if (editableColumn.includes(key)) {
        data[key] = payload[key];
      }
    });

    const user = await UserModel.findOneAndUpdate({ email: data.email }, data);

    return "updated";
  } catch (error) {
    console.log(error);
    Error(error);
  }
};