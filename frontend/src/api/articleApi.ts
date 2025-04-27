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