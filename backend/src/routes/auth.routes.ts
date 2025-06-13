import { Router } from "express";
import { register, login, updateUser, deleteUser, updatePassword } from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.put("/update", verifyToken, updateUser);
router.put("/update-password", verifyToken, updatePassword);
router.delete("/delete", verifyToken, deleteUser);

export default router;
