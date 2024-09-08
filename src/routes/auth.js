import { Router } from "express";
import {
	query,
	validationResult,
	checkSchema,
	matchedData,
} from "express-validator";
import { mockUsers } from "../constant/constant.js";
import UserModel from "../models/UserModel.js";
import { createUser, loginUser } from "../controllers/authController.js";

const router = Router()
// router.get('/auth/all', async (req,res,next) => {
// console.log(req.sessionStore)
// 	await req.sessionStore.get(req.sessionID,(err, session) => {
// 		console.log(session)
// 	})
// 	return res.status(200).json(mockUsers)
// })
// router.post('/auth',(req, res, next) => {
// 	const {body : {username, password}} = req
// 	console.log(username)
// 	const user = mockUsers.find((user) => user.username === username)
// 	if(!user || user.password !== password){
// 		const error = new Error(' Incorrect user or Password');
// 		return next(error)
// 	}
// 	req.session.user = user
// 	return res.status(200).json({message : user})

// })
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

export default router