import express from "express"
import { auth } from '../middleware/authMiddleware'
import { 
    createAndPublishArticle,
    getMyArticles,
    deleteArticle,
    getArticleById,
    updateArticle,
    getPreferredArticles,
    updateLikesDislikes,
    blockArticle,
    unblockArticle,
    draftArticle,
    publishArticle

} from "../controllers/articleController";

const router = express.Router();

router.post("/create-article", createAndPublishArticle);
router.get("/my-articles/:userId", getMyArticles);
router.delete("/articles/:articleId", deleteArticle);
router.get("/articles/:articleId", getArticleById);
router.patch("/articles/:articleId", updateArticle);
router.get("/articles", getPreferredArticles);
router.patch("/articles/:id/update-likes-dislikes", updateLikesDislikes);
router.post("/articles/block", auth, blockArticle);   
router.post("/articles/unblock", auth, unblockArticle);  
router.post("/draft-article", auth, draftArticle);  
router.patch("/articles/publish/:articleId", auth, publishArticle);


export default router;