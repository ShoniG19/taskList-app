import { Router } from "express";
import { register, login, updateUser, deleteUser, updatePassword, uploadAvatar, forgotPassword, resetPassword } from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { upload } from '../middlewares/cloudinaryUploader';

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.put("/update", verifyToken, updateUser);
router.put("/update-password", verifyToken, updatePassword);
router.put("/update-avatar", verifyToken, upload.single("avatar"), uploadAvatar);
router.delete("/delete", verifyToken, deleteUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
