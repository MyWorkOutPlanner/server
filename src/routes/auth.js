import { Router } from "express";
import UserModel from "../models/UserModel.js";
import { handleRefreshToken } from "../middleware/authToken.js";
const router = Router()

router.get("/refresh-token", handleRefreshToken);

export default router;