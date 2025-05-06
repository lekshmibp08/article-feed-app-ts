import { IArticleRepository } from '../../../application/interfaces/IArticleRepository';
import { IArticle } from '../../../domain/entities/IArticle'; 
import Article from '../models/articleModel';
import mongoose from 'mongoose';
export class ArticleRepository implements IArticleRepository {
  async create(article: IArticle): Promise<IArticle> {
    const newArticle = new Article(article);
    return await newArticle.save();
  }

  async findById(id: string): Promise<IArticle | null> {
    return await Article.findById(id).lean();
  }

  async findByAuthor(author: string): Promise<IArticle[]> {
    return await Article.find({ author }).sort({ createdAt: -1 });
  }

  async delete(id: string): Promise<boolean> {
    const result = await Article.findByIdAndDelete(id);
    return result !== null;
  }

  async update(id: string, article: Partial<IArticle>): Promise<IArticle | null> {
    return await Article.findByIdAndUpdate(id, article, { new: true }).lean();
  }

  async findByPreferences(preferences: string[]): Promise<IArticle[]> {
    return await Article.find({ category: { $in: preferences }, status: 'Published' })
        .populate("author", "firstName lastName")
        .sort({ createdAt: -1 });
  }

  
  async updateLikesDislikes(id: string, userId: string, action: 'like' | 'dislike'): Promise<IArticle | null> {
    const article = await Article.findById(id);
    if (!article) return null;

    const likesSet = new Set(article.likes.map(String));
    const dislikesSet = new Set(article.dislikes.map(String));

    if (action === 'like') {
      if (likesSet.has(userId)) {
        likesSet.delete(userId);
      } else {
        dislikesSet.delete(userId);
        likesSet.add(userId);
      }
    } else {
      if (dislikesSet.has(userId)) {
        dislikesSet.delete(userId);
      } else {
        likesSet.delete(userId);
        dislikesSet.add(userId);
      }
    }

    article.likes = Array.from(likesSet).map(id => new mongoose.Types.ObjectId(id));
    article.dislikes = Array.from(dislikesSet).map(id => new mongoose.Types.ObjectId(id));    
    return await article.save();
  }
 
}
