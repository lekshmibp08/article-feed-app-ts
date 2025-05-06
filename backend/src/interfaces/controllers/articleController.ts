import { Request, Response, NextFunction } from "express";
import { ArticleUseCases } from "../../application/useCases/articleUseCases";
import { ArticleRepository } from "../../infrastructure/database/repository/ArticleRepository";
import { HttpStatusCode } from "../../enums/HttpStatusCode";

interface AuthenticatedRequest extends Request {
    user?: {
      id?: string;
      email?: string;
    };
}

const articleRepository = new ArticleRepository();
const articleUseCases = new ArticleUseCases(articleRepository);

export const createAndPublishArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const articleData = req.body.articleData;
        
        //articleData.status = "Published";
        
        const article = await articleUseCases.createArticle(articleData);
        res.status(HttpStatusCode.CREATED).json(article)
    } catch (error) {
        next(error);
    }
}

export const getMyArticles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;    
        const articles = await articleUseCases.getMyArticles(userId);
        console.log(articles);
        
        res.status(HttpStatusCode.OK).json(articles);        
    } catch (error) {
        next(error);
    }
}

export const deleteArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { articleId } = req.params;
        
        if(!articleId)         {
            throw {
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: "Article ID is required"
            }
        }
        const result = await articleUseCases.deleteArticle(articleId);
        if(result) {
            res.status(HttpStatusCode.OK).json({message: "Article deleted successfully"})
        }
    } catch (error) {
        next(error)
    }
}

export const getArticleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { articleId } = req.params;        
        const article = await articleUseCases.getArticleById(articleId);
        res.status(HttpStatusCode.OK).json(article);

    } catch (error) {
        next(error)
    }
}

export const updateArticle = async (req: Request, res: Response, next: NextFunction) => {
    const { articleId } = req.params;
    const articleData = req.body;

    try {
        const updatedArticle = await articleUseCases.updateArticle(articleId, articleData);
        res.status(HttpStatusCode.OK).json(updatedArticle);
    } catch (error) {
        next(error);
    }
};

export const getPreferredArticles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const preferences = req.query.preferences
            ? (req.query.preferences as string).split(",")
            : [];

        const articles = await articleUseCases.getPreferredArticles(preferences);

        res.status(HttpStatusCode.OK).json(articles);
    } catch (error) {
        next(error);
    }
};

export const updateLikesDislikes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: articleId } = req.params;
      const { userId, action } = req.body;
  
      const updatedArticle = await articleUseCases.updateLikesDislikes(articleId, userId, action);
      res.status(HttpStatusCode.OK).json(updatedArticle);
    } catch (error) {
      next(error);
    }
};

export const blockArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { articleId } = req.body;
      const userId = (req as AuthenticatedRequest).user?.id;

      if(!userId) {
        throw {
            statusCode: HttpStatusCode.UNAUTHORIZED,
            message: "User not authenticated" 
        }
      }
  
      const article = await articleUseCases.blockArticle(articleId, userId);
      if (!article){
        throw {
            statusCode: HttpStatusCode.NOT_FOUND,
            message: "Article not found"
        }
      }
  
      res.status(HttpStatusCode.OK).json({ message: "Article blocked successfully", article });
    } catch (error) {
      next(error);
    }
};

export const unblockArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { articleId } = req.body;
      const userId = (req as AuthenticatedRequest).user?.id;

      if(!userId) {
        throw {
            statusCode: HttpStatusCode.UNAUTHORIZED,
            message: "User not authenticated" 
        }
      }
  
      const article = await articleUseCases.unblockArticle(articleId, userId);
  
      res.status(200).json({ message: "Article unblocked successfully", article });
    } catch (error) {
      next(error);
    }
};

export const draftArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const articleData = req.body.articleData;

        //articleData.status = "Draft";
        
        const article = await articleUseCases.draftArticle(articleData);
        res.status(HttpStatusCode.CREATED).json(article)
    } catch (error) {
        next(error);
    }
}

export const publishArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { articleId } = req.params;
        
        const article = await articleUseCases.publishArticle(articleId);
        res.status(HttpStatusCode.CREATED).json({
            message: "Article published successfully",
            article
        })
    } catch (error) {
        next(error);
    }
}

