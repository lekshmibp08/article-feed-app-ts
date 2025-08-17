import { IArticle } from "../../../domain/entities/IArticle";

export interface IArticleUseCases {
    
  createArticle(articleData: IArticle): Promise<IArticle>;

  getMyArticles(userId: string): Promise<IArticle[]>;

  deleteArticle(articleId: string): Promise<boolean>;

  getArticleById(articleId: string): Promise<IArticle>;

  updateArticle(
    articleId: string,
    articleData: Partial<IArticle>
  ): Promise<IArticle>;

  getPreferredArticles(preferences: string[]): Promise<IArticle[]>;

  updateLikesDislikes(
    articleId: string,
    userId: string,
    action: "like" | "dislike"
  ): Promise<IArticle>;

  blockArticle(articleId: string, userId: string): Promise<IArticle | null>;

  unblockArticle(articleId: string, userId: string): Promise<IArticle>;

  draftArticle(articleData: IArticle): Promise<IArticle>;

  publishArticle(articleId: string): Promise<IArticle>;
}
