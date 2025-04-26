import User from '../models/userSchema.js'
import Article from '../models/articleSchema.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export const createAndPublishArticle = async (req, res, next) => {
    const { title, description, content, category, tags, author, imageUrl } = req.body.articleData
    console.log(author);
    

    try {
        const newArticle = new Article({
            title,
            description,
            content,
            category,
            tags: tags,
            imageUrl,
            author,
            status: "Published",
        })
        await newArticle.save()

        res.status(201).json({ message: "Article published successfully!", article: newArticle });

    } catch (error) {
        next(error);
    }
};

export const getMyArticles = async (req, res, next) => {    
    try {
        const { userId } = req.params;    
        if (!userId) {
            return next({message: "User ID is required", statusCode: 400})
        }
        const articles = await Article.find({ author: userId}).sort({createdAt: -1})           
        res.status(200).json(articles);        
    } catch (error) {        
        next(error)
    }
            
};
export const deleteArticle = async (req, res, next) => {
    try {
        const { articleId } = req.params;
        console.log(articleId);
        
        if (!articleId) {
            return next({message: "Article ID is required", statusCode: 400})
        }
        const deletedArticle = await Article.findByIdAndDelete(articleId);
        if (!deletedArticle) {
            return next({ message: "Article not found", statusCode: 404 });
        }
        res.status(200).json({ message: "Article deleted successfully" });
    } catch (error) {
        next(error)
    }
};
export const getArticleById = async (req, res, next) => {
    const { articleId } = req.params;
    try {
      if (!articleId) {
          return next({message: "Article ID is required", statusCode: 400})
      }
      const article = await Article.findById(articleId);
      if (!article) {
          return next({ message: "Article not found", statusCode: 404 });
      }
      res.status(200).json(article);        
    } catch (error) {
        next(error)
    }
};
export const updateArticle = async (req, res, next) => {
    const { articleId } = req.params;
    const updation = req.body;
    
    try {
      if (!articleId) {
          return next({message: "Article ID is required", statusCode: 400})
      }
      const updatedArticle  = await Article.findByIdAndUpdate(
        articleId,
        { $set: updation },
        { new: true }
      );
      if (!updatedArticle) {
          return next({ message: "Article not found", statusCode: 404 });
      }
      res.status(200).json(updatedArticle);        
    } catch (error) {
        next(error)
    }
};
export const getPreferredArticles = async (req, res, next) => {
    const preferences = req.query.preferences ? req.query.preferences.split(",") : [];    
    console.log("REACHED");
    
    try {
        let query = { status: "Published" };
        if(preferences.length > 0) {
            query.category = { $in: preferences };
        }
        const articles = await Article.find(query)
        .populate("author", "firstName lastName")
            .sort({ createdAt: -1 });
        
        res.status(200).json(articles);        
    } catch (error) {
        console.error("Error fetching articles:", error);
        next(error);
    }
};
export const updateLikesDislikes = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { userId, action } = req.body; 
  
      const article = await Article.findById(id);
      if (!article) {
        return next({ message: "Article not found", statusCode: 404 });
      }
  
      let updatedLikes = new Set(article.likes.map(String));
      let updatedDislikes = new Set(article.dislikes.map(String));
  
      if (action === "like") {
        if (updatedLikes.has(userId)) {
          updatedLikes.delete(userId);
        } else {
          updatedDislikes.delete(userId); 
          updatedLikes.add(userId);
        }
      } else {
        if (updatedDislikes.has(userId)) {
          updatedDislikes.delete(userId);
        } else {
          updatedLikes.delete(userId); 
          updatedDislikes.add(userId);
        }
      }
  
      const updatedArticle = await Article.findByIdAndUpdate(
        id,
        {
          likes: Array.from(updatedLikes),
          dislikes: Array.from(updatedDislikes),
        },
        { new: true }
      );
  
      res.status(200).json(updatedArticle);
    } catch (error) {
      console.error("Error updating likes/dislikes:", error);
      next(error);
    }
};
export const updatePersonalInfo = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    const userId = req.user.id;
    const user = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email, phone },
      { new: true }
    ).select("-password");    
    res.json({ message: "Profile updated successfully", user });    
  } catch (error) {
    next(error);
  }
};
export const resetPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return next({ message: "Current password is incorrect", statusCode: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    next(error)
  }
};
export const updatePreferences = async (req, res, next) => {
  try {
    const { preferences } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, 
      { preferences }, { new: true }
    ).select("-password");
    console.log(user);
    
    res.json({ message: "Preferences updated successfully", user });
  } catch (error) {
    next(error)
  }
};
export const blockArticle = async (req, res, next) => {
  try {
    const { articleId } = req.body;
    const userId = req.user.id;

    if (!articleId) {
      return res.status(400).json({ message: "Invalid article ID format" });
    }

    const article = await Article.findById(articleId);
    if (!article) return next({ message: "Article not found", statusCode: 404 });

    if (!article.blocks.includes(userId)) {
      article.blocks.push(userId);
      await article.save();
    }

    res.status(200).json({ message: "Article blocked successfully", article });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const unblockArticle = async (req, res, next) => {
  try {
    const { articleId } = req.body;
    const userId = req.user.id; 

    const article = await Article.findById(articleId);
    if (!article) return next({ message: "Article not found", statusCode: 404 });

    article.blocks = article.blocks.filter((id) => id.toString() !== userId);
    await article.save();

    res.status(200).json({ message: "Article unblocked successfully", article });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const draftArticle = async (req, res, next) => {
  const { title, description, content, category, tags, author, imageUrl } = req.body.articleData
  console.log(author);
  

  try {
      const newArticle = new Article({
          title,
          description,
          content,
          category,
          tags: tags,
          imageUrl,
          author,
          status: "Draft",
      })
      await newArticle.save()

      res.status(201).json({ message: "Article published successfully!", article: newArticle });

  } catch (error) {
      next(error);
  }
};
export const publishArticle = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    
    const article = await Article.findById(articleId);
    if (!article) {
        return next({ message: "Article not found", statusCode: 404 });
    }
    if (article.status === "Published") {
        return next({ message: "Article is already published", statusCode: 400 });
    }
    article.status = "Published";
    article.publishedAt = new Date();
    await article.save();
    res.status(200).json({
        message: "Article published successfully",
        article,
    });
  } catch (error) {
      console.error("Error publishing article:", error);
      next(error)
  }
};


  


