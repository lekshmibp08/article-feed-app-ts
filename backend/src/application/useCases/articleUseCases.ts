import { IArticle } from "../../domain/entities/IArticle";
import { IArticleRepository } from "../interfaces/IArticleRepository";
import { HttpStatusCode } from "../../enums/HttpStatusCode";

export class ArticleUseCases {
    constructor(private articleRepository: IArticleRepository) {}
    
    async createArticle(articleData: IArticle): Promise<IArticle> {
        articleData.status = 'Published';
        return await this.articleRepository.create(articleData);
    }

    async getMyArticles(userId: string): Promise<IArticle[]> {
        console.log(userId);
        
        if(!userId) {
            throw {statusCode: HttpStatusCode.BAD_REQUEST, message:"invalid User ID"};
        }
        return await this.articleRepository.findByAuthor(userId);
    }

    async deleteArticle(articleId: string): Promise<boolean> {
        const isDeleted = await this.articleRepository.delete(articleId);

        if(!isDeleted) {
            throw {
                statusCode: HttpStatusCode.NOT_FOUND,
                message: "Article not found or already deleted", 
            }
        }
        return true;
    }

    async getArticleById(articleId: string): Promise<IArticle> {
        if (!articleId) {
            throw {
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: "Article ID is required",
            };
        }
    
        const article = await this.articleRepository.findById(articleId);
    
        if (!article) {
            throw {
                statusCode: HttpStatusCode.NOT_FOUND,
                message: "Article not found",
            };
        }
    
        return article;
    }

    async updateArticle(articleId: string, articleData: Partial<IArticle>): Promise<IArticle> {
        if (!articleId) {
            throw {
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: "Article ID is required",
            };
        }
    
        const updatedArticle = await this.articleRepository.update(articleId, articleData);
    
        if (!updatedArticle) {
            throw {
                statusCode: HttpStatusCode.NOT_FOUND,
                message: "Article not found",
            };
        }
    
        return updatedArticle;
    }

    async getPreferredArticles(preferences: string[]): Promise<IArticle[]> {
        return await this.articleRepository.findByPreferences(preferences);
    }

    async updateLikesDislikes(articleId: string, userId: string, action: 'like' | 'dislike'): Promise<IArticle> {
    
        if (!userId || (action !== 'like' && action !== 'dislike')) {
          throw {
            statusCode: HttpStatusCode.BAD_REQUEST,
            message: "Invalid user ID or action",
          };
        }
    
        const updatedArticle = await this.articleRepository.updateLikesDislikes(articleId, userId, action);
    
        if (!updatedArticle) {
          throw {
            statusCode: HttpStatusCode.NOT_FOUND,
            message: "Article not found",
          };
        }
    
        return updatedArticle;
    }

    async blockArticle(articleId: string, userId: string): Promise<IArticle | null> {
        const article = await this.articleRepository.findById(articleId);
        if (!article) {
            throw {
                statusCode: HttpStatusCode.NOT_FOUND,
                message: 'Article not found'
            }
        }

      
        if (!article.blocks.includes(userId)) {
          article.blocks.push(userId);
          return await this.articleRepository.update(articleId, article);
        }
        return article;
    }

    async unblockArticle(articleId: string, userId: string): Promise<IArticle> {
        const article = await this.articleRepository.findById(articleId);
    
        if (!article) {
            throw {
                statusCode: HttpStatusCode.NOT_FOUND,
                message: "Article not found",
            };
        }
    
        const updatedBlocks = article.blocks.filter(id => id.toString() !== userId);
    
        const updatedArticle = await this.articleRepository.update(articleId, {
            blocks: updatedBlocks
        });
    
        if (!updatedArticle) {
            throw {
                statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
                message: "Failed to update article during unblock operation",
            };
        }
    
        return updatedArticle;
    }

    async draftArticle(articleData: IArticle): Promise<IArticle> {
        articleData.status = 'Draft';
        return await this.articleRepository.create(articleData);
    }

    async publishArticle(articleId: string): Promise<IArticle> {
        if (!articleId) {
          throw {
            statusCode: HttpStatusCode.BAD_REQUEST,
            message: "Article ID is required",
          };
        }
      
        const article = await this.articleRepository.findById(articleId);
        if (!article) {
          throw {
            statusCode: HttpStatusCode.NOT_FOUND,
            message: "Article not found",
          };
        }
      
        if (article.status === "Published") {
          throw {
            statusCode: HttpStatusCode.BAD_REQUEST,
            message: "Article is already published",
          };
        }
      
        const updatedArticle = await this.articleRepository.update(articleId, {
          status: "Published",
          publishedAt: new Date(),
        });
      
        if (!updatedArticle) {
          throw {
            statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
            message: "Failed to publish article",
          };
        }
      
        return updatedArticle;
    }
      


}