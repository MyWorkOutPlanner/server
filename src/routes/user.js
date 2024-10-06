import { Router } from "express";
import {
	query,
	validationResult,
	checkSchema,
	matchedData,
} from "express-validator";
import { mockUsers } from "../constant/constant.js";
import UserModel from "../models/UserModel.js";
import { createUser, getUserById, loginUser, updateUser } from "../controllers/authController.js";
import { getAuthToken, verifyAccessToken } from "../middleware/authToken.js";
const router = Router()
router.post('/', async(req, res, next) => {
	const payload = req.body;
	if (!payload.email || !payload.fullName || !payload.password) {
		res.status(400).json("Missing required paramaters");
	  }
	  else {
		try{
			const existing_user =  await UserModel.findOne({ email: payload.email }); 
			if(existing_user){
				res.status(401).json("Email is already Registered")
			}
			else {
				const user = await createUser(payload)
				res.status(200).json(user)
			}
		}catch(err){
			return next(new Error("Internal server error")) 
		}
	  }
	
})

router.post('/login', async(req, res, next) => {
	const payload = req.body;
	if (!payload.email || !payload.password) {
		res.status(400).json("Missing required paramaters");
	  }else{
		const userData = await loginUser(payload);
		if (typeof userData === "object" && userData.email) {
			req["user"] = userData;
			getAuthToken(req, res);
		  } else {
			res.status(403).json("Invalid email/password");
		  }
	  }
})
router.get(
	"user/:userId",
	verifyAccessToken,
	async (req, res) => {
	  const userId = req.params.userId;
  
	  if (!userId) {
		res.status(400).send("Bad request");
	  }
	  const user = await getUserById(userId);
	  res.status(200).json(user);
	}
  );
  
  router.put(
	"user/:userId",
	verifyAccessToken,
	async (req, res) => {
	  const userId = req.params.userId;
		console.log(req,'req')
	  if (!userId) {
		res.status(400).send("Bad request");
	  }
	  if (userId !== req["user"].id) {
		res.status(403).send("Unauthorized");
	  }
	  try {
		const updatedData = await updateUser(userId, req.body);
		res.status(200).json(updatedData);
	  } catch (error) {
		res.status(500).json("Internal server error");
	  }
	}
  );

export default router