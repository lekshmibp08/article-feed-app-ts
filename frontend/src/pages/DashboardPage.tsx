
import { FaHeart, FaRegHeart, FaThumbsDown, FaRegThumbsDown } from "react-icons/fa"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import configAxios from "../services/axiosConfig"
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"
import { Dialog } from "../components/ui/Dialog"
import DashboardLayout from "../components/DashboardLayout"
import { toggleLikeDislike } from '../utils/articleActions'
import { RootState } from "../redux/store"
import { Article } from "../types/types"
import { fetchPreferredArticles, blockArticle, unblockArticle } from "../api/articleApi"


function DashboardPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [showDialog, setShowDialog] = useState<boolean>(false)

  const openArticleDialog = (article: Article) => {
    setSelectedArticle(article)
    setShowDialog(true)
  }
  
  const preferences = user?.preferences;
    
  const fetchPrefferedArticle = async () => {
    console.log(preferences);
    setLoading(true);
    try {
      const response = await fetchPreferredArticles(preferences || []);
      setArticles(response.data)
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPrefferedArticle();
  }, [user])

  const handleBlockUnblock = async (articleId: string, isBlocked: boolean) => {
    try {
      const response = isBlocked ? await unblockArticle(articleId) : await blockArticle(articleId);
    
      setSelectedArticle(response.data.article);
    } catch (error) {
      console.error("Error updating block status:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Feed</h1>
        <Link to="/dashboard/create-article">
          <Button>
            <span className="mr-1">+</span> Create Article
          </Button>
        </Link>
      </div>

      {/* Articles List */}
      <div className="grid gap-6 mt-6">
        {loading ? (
          <p>Loading articles...</p>
        ) : articles.length === 0 ? (
          <p>No articles found.</p>
        ) : (
          articles.map((article) => (
            <Card key={article._id}>
              <div className="p-6">
                <div className="grid md:grid-cols-[1fr_300px] gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {article.category}
                      </span>
                      <span className="text-sm text-gray-500">
                      {new Date(article.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      </span>
                    </div>

                    <h2
                      className="text-2xl font-bold cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => openArticleDialog(article)}
                    >
                      {article.title}
                    </h2>

                    <p className="text-gray-500">{article.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                      <img 
                        src="/images/avatar.png" 
                        alt={`${article.author.firstName}`} 
                        className="w-8 h-8 rounded-full object-cover" 
                      />
                        <span className="text-sm font-medium">
                          {article.author.firstName} {article.author.lastName}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <FaRegHeart className="text-red-500" /> 
                          <span className="text-sm text-gray-500">{article.likesCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaRegThumbsDown className="text-gray-500" /> 
                          <span className="text-sm text-gray-500">{article.dislikesCount}</span>
                        </div>                        
                      </div>

                    </div>
                  </div>
                  <img
                    src={article.imageUrl || "/images/place-holder.svg"}
                    alt={article.title}
                    className="w-full h-[200px] object-cover rounded-md"
                  />
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Article Dialog */}
      <Dialog isOpen={showDialog} onClose={() => setShowDialog(false)} title={selectedArticle?.title}>
        {selectedArticle && user && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              By {selectedArticle.author.firstName} {selectedArticle.author.lastName} • { }
              {new Date(selectedArticle.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <img
              src={selectedArticle.imageUrl || "/images/place-holder.svg"}
              alt={selectedArticle.title}
              className="w-full h-[200px] object-cover rounded-md"
            />
            <p>{selectedArticle.description}</p>
            <p>{selectedArticle.content}</p>

            <p className="flex flex-wrap gap-2 text-sm text-blue-600 font-medium">
              {Array.isArray(selectedArticle?.tags) && selectedArticle.tags.length > 0
                ? selectedArticle.tags[0].split(",").map((tag, index) => (
                    <span key={index} className="px-1 py-1 rounded-md">
                      #{tag.trim()}
                    </span>
                  ))
                : " "}
            </p>            

            {/* Like & Dislike Buttons */}
            <div className="flex items-center gap-4">
              <button 
                className="flex items-center gap-2 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
                onClick={() => toggleLikeDislike(selectedArticle, user, setSelectedArticle, setArticles, true)}
              >
                {selectedArticle.likes.includes(user._id) ? (
                  <FaHeart className="text-gray-600" />
                ) : (
                  <FaRegHeart className="text-gray-600" />
                )}
                <span className="text-sm">Like ({selectedArticle.likes.length})</span>
              </button>

              <button 
                className="flex items-center gap-2 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
                onClick={() => toggleLikeDislike(selectedArticle, user, setSelectedArticle, setArticles, false)}
              >
                {selectedArticle.dislikes.includes(user._id) ? (
                  <FaThumbsDown className="text-gray-600" />
                ) : (
                  <FaRegThumbsDown className="text-gray-600" />
                )}
                <span className="text-sm">Dislike ({selectedArticle.dislikes.length})</span>
              </button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBlockUnblock(selectedArticle._id, selectedArticle.blocks.includes(user._id))}
              >
                {selectedArticle.blocks.includes(user._id) ? "Unblock" : "Block"}
              </Button>
            </div>

          </div>
        )}
      </Dialog>
    </DashboardLayout>
  )
}

export default DashboardPage

