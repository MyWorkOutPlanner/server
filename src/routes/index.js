import { Router } from "express";
import usersRouter from "./post.js";
// import productsRouter from "./products.mjs";
import authRouter from "./auth.js";

const router = Router();

router.use(usersRouter);
// router.use(productsRouter);
router.use("/auth",authRouter);

export default router;