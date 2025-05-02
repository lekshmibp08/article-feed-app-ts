import express from "express"
import { auth } from '../middleware/authMiddleware'
import { 
    updatePersonalInfo 
} from "../controllers/userController";

const router = express.Router();

router.patch("/users/update-profile", auth, updatePersonalInfo);
// router.patch("/users/change-password", auth, resetPassword);
// router.patch("/users/update-preferences", auth, updatePreferences);

export default router;