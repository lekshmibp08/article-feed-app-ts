import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import { 
    createAndPublishArticle,
    getMyArticles,
    deleteArticle,
    getArticleById,
    updateArticle,
    getPreferredArticles, 
    updateLikesDislikes,
    updatePersonalInfo, 
    resetPassword,
    updatePreferences,
    blockArticle,
    unblockArticle,
    draftArticle,
    publishArticle
} from "../controllers/userController.js";

const router = express.Router();

router.post("/create-article", createAndPublishArticle);
router.get("/my-articles/:userId", getMyArticles);
router.delete("/articles/:articleId", deleteArticle);
router.get("/articles/:articleId", getArticleById);
router.patch("/articles/:articleId", updateArticle);
router.get("/articles", getPreferredArticles);
router.patch("/articles/:id/update-likes-dislikes", updateLikesDislikes);
router.patch("/users/update-profile", auth, updatePersonalInfo);
router.patch("/users/change-password", auth, resetPassword);
router.patch("/users/update-preferences", auth, updatePreferences);
router.post("/articles/block", auth, blockArticle);   
router.post("/articles/unblock", auth, unblockArticle);  
router.post("/draft-article", auth, draftArticle);  
router.patch("/articles/publish/:articleId", auth, publishArticle);


export default router;
