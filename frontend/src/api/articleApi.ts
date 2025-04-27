import configAxios from "../services/axiosConfig";
import { 
    IArticleFormData 
} from "../types/types";


export const createArticle = (articleData: IArticleFormData) => {
    return configAxios.post('/api/create-article', {articleData});
};

export const draftArticle = (articleData: IArticleFormData) => {
    return configAxios.post('/api/create-article', {articleData});
};

export const fetchArticleById = (id: string) => {
  return configAxios.get(`/api/articles/${id}`);
};

export const updateArticle = (id: string, formData: any, imageUrl: string) => {
  return configAxios.patch(`/api/articles/${id}`, { ...formData, imageUrl });
};

export const fetchUserArticles = (userId: string) => {
  return configAxios.get(`/api/my-articles/${userId}`);
};

export const deleteArticle = (articleId: string) => {
  return configAxios.delete(`/api/articles/${articleId}`);
};

export const publishArticle = (articleId: string) => {
  return configAxios.patch(`/api/articles/publish/${articleId}`);
};