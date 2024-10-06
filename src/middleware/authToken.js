import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";
import { JWT_SECRET } from "../utils/secret.js";

const generateAccessToken = (user) => {
  console.log(JWT_SECRET,"ch")
    return jwt.sign(
      {
        email: user.email,
        isLoggedIn: true,
        id: user.id,
      },
      JWT_SECRET,
      {
        expiresIn: "2h",
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
        // id: user.id,
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    user.refreshToken = token;
    await UserModel.findOneAndUpdate({ email: user.email }, user);
  
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

export const verifyAccessToken = async (req, res, next) => {
  // Get the token from the request header
  var token = req.headers["authorization"]?.replace("Bearer ", "") || "";
 console.log(req.params,"tk")
  // If no token, send an error response
  if (!token) {
    return res.status(401).send({ message: "No token provided" });
  }
  // Verify the token using a secret key
  jwt.verify(token, JWT_SECRET, async function (err, decoded) {
    // If verification fails, send an error response
    // console.log(decoded,"d")
    if (err) {
      return res.status(401).send({ message: "Invalid token" });
    }
    // If verification succeeds, pass the decoded data to the next middleware
    try {
      const user = await UserModel.findOne({ email: decoded.email });
      // console.log(req["user"],"user")
      req["user"] = user;
      next();
    } catch (error) {
      return res.status(401).send({ message: "Invalid user" });
    }
  });
};

export const handleRefreshToken = async (req, res, next) => {
  const refresh_token = (req.headers["refresh_token"] ) || "";
  if (!refresh_token) {
    return res.status(401).send({ message: "Invalid refresh token" });
  }

  //verify the refresh token
  try {
    const decodedRefreshToken = jwt.verify(
      refresh_token,
      JWT_SECRET
    ) 

    if (!decodedRefreshToken) {
      return res.status(401).send({ message: "Invalid refresh token" });
    }

    //check the refreshToken exist in user
    const user = await UserModel.findOne({ email: decodedRefreshToken.email });
    if (user.refreshToken !== refresh_token) {
      return res.status(401).send({ message: "Invalid refresh token" });
    }

    // generate access token
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    return res.status(200).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(401).send({ message: error });
  }
};