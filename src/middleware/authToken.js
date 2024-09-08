import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel";

const generateAccessToken = (user) => {
    return jwt.sign(
      {
        email: user.email,
        isLoggedIn: true,
        id: user.id,
      },
      JWT_SECRET,
      {
        expiresIn: "10s",
      }
    );
  };

export const generateResetToken = (user) => {
    return jwt.sign(
      {
        email: user.email,
        id: user.id,
      },
      JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
};

export const generateRefreshToken = async (user) => {
    const token = jwt.sign(
      {
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    user.refreshToken = token;
    await User.findOneAndUpdate({ email: user.email }, user);
  
    return token;
};
export const getAuthToken = async (req, res) => {
    const user = req["user"] ;
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    res
      .status(200)
      .json({ email: user.email, accessToken, refreshToken, isLoggedIn: true });
  };