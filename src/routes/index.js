import { Router } from "express";
import authRouter from "./auth.js";
// import productsRouter from "./products.mjs";
import usersRouter from "./user.js";

const router = Router();

router.use(authRouter);
// router.use(productsRouter);
router.use("/auth",usersRouter);

export default router;