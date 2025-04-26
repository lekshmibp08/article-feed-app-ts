import configAxios from "../services/axiosConfig";

export const toggleLikeDislike = async (article, user, setSelectedArticle, setArticles, isLike) => {
  if (!article || !user) return;

  try {
    const response = await configAxios.patch(`/api/articles/${article._id}/update-likes-dislikes`, {
      userId: user._id,
      action: isLike ? "like" : "dislike",
    });
    if(response.status === 200) {
      const updatedArticle = response.data;
      setSelectedArticle(updatedArticle);
      setArticles((prevArticles) =>
        prevArticles.map((a) => (a.id === updatedArticle.id ? updatedArticle : a))
      );
    }

  } catch (error) {
    console.error("Error updating likes/dislikes:", error);
  }
};
