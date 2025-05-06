import { IArticle } from "../../domain/entities/IArticle";

export interface IArticleRepository {
  create(article: IArticle): Promise<IArticle>;
  findById(id: string): Promise<IArticle | null>;
  findByAuthor(author: string): Promise<IArticle[]>;
  delete(id: string): Promise<boolean>;
  update(id: string, article: Partial<IArticle>): Promise<IArticle | null>;
  findByPreferences(preferences: string[]): Promise<IArticle[]>;
  updateLikesDislikes(id: string, userId: string, action: 'like' | 'dislike'): Promise<IArticle | null>;
}
