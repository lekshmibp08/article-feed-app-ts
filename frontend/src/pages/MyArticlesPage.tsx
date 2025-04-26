import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"
import { Dialog } from "../components/ui/Dialog"
import DashboardLayout from "../components/DashboardLayout"
import { useSelector } from "react-redux"
import configAxios from "../services/axiosConfig"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { RootState } from "../redux/store";
import { Article } from "../types/types"


function MyArticlesPage() {
  const user = useSelector((state: RootState) => state.auth.user)
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null)

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const openArticleDialog = (article: Article) => {
    setSelectedArticle(article)
    setShowDialog(true)
  }

  const fetchArticles = async () => {
    if(user?._id) {
      try {
          const response = await configAxios.get(`/api/my-articles/${user._id}`);
          setArticles(response.data);
      } catch (error) {
          setError("Failed to load articles.")
          console.error("Error fetching articles:", error)
      } finally {
          setLoading(false)
      }
    }
  }

  useEffect(() => {
    if (user?._id) {
        fetchArticles()
    }
  }, [user?._id])

  const handleDelete = async () => {
    if (!articleToDelete) return
    try {
        await configAxios.delete(`/api/articles/${articleToDelete}`);
        setArticles((prevArticles) =>
            prevArticles.filter((article: Article) => article._id !== articleToDelete)
        );
        setShowDeleteDialog(false)
        setArticleToDelete(null)  
        toast.success("Article deleted successfully!", { position: "top-center" });              
    } catch (error) {
        toast.error("Failed to delete article.", { position: "top-center" });
    }      
  }

  const handlePublish = async (articleId: string) => {
    try {
      const response = await configAxios.patch(`/api/articles/publish/${articleId}`);
      
      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article._id === articleId ? { ...article, status: "Published" } : article
        )
      );
  
      toast.success("Article published successfully!", { position: "top-center" });
    } catch (error) {
      toast.error("Failed to publish article.", { position: "top-center" });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Articles</h1>
        <Link to="/dashboard/create-article">
          <Button>
            <span className="mr-1">+</span> Create Article
          </Button>
        </Link>
      </div>
      {loading ? (
        <p className="mt-6">Loading articles...</p>
      ) : error ? (
        <p className="mt-6 text-red-500">{error}</p>
      ) : articles.length === 0 ? ( 
        <p className="text-gray-500 mt-6">No articles found.</p>
      ) : (
      <div className="grid gap-6 mt-6">
        {articles.map((article) => (
          <Card key={article._id}>
            <div className="p-6">
              <div className="grid md:grid-cols-[1fr_200px] gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {article.category}
                    </span>
                    <span className="text-sm font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
                      {article.status}
                    </span>
                    <span className="text-sm text-gray-500">
                    {new Date(article.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold">{article.title}</h2>
                  <p className="text-gray-500">{article.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm">Likes: {article.likesCount}</span>
                      <span className="text-sm">Dislikes: {article.dislikesCount}</span>
                      <span className="text-sm">Blocks: {article.blocksCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openArticleDialog(article)}
                       className="p-1 rounded-md hover:bg-gray-100"
                       >
                        <FaEye className="text-gray-600 hover:text-gray-800" />
                       </button>
                      <Link to={`/dashboard/edit-article/${article._id}`}>
                        <button className="p-1 rounded-md hover:bg-gray-100">
                          <FaEdit className="text-blue-600 hover:text-blue-800" />
                        </button>
                      </Link>
                      <div className="relative">
                        <button
                          className="p-1 rounded-md hover:bg-gray-100"
                          onClick={() => {
                            setArticleToDelete(article._id)
                            setShowDeleteDialog(true)
                          }}
                          >
                          <FaTrash className="text-red-500 hover:text-red-700" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <img
                  src={article.imageUrl || "/images/place-holder.svg"}
                  alt={article.title}
                  className="w-full h-[100px] object-cover rounded-md"
                />
                {article.status === "Draft" && (
                  <Button variant="outline" onClick={() => handlePublish(article._id)}>
                    Publish
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
        
      )}


      {/* Delete Dialog */}
      <Dialog isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} title="Delete Article">
        <div className="space-y-4">
          <p>Are you sure you want to delete this article? This action cannot be undone.</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog isOpen={showDialog} onClose={() => setShowDialog(false)} title={selectedArticle?.title}>
        {selectedArticle && (
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
                    <span key={index} className="bg-blue-100 px-2 py-1 rounded-md">
                      #{tag.trim()}
                    </span>
                  ))
                : "No Tags"}
            </p>

            {/* Like & Dislike Buttons */}
            <div className="flex items-center gap-4">
              <span className="text-sm">Likes: {selectedArticle.likesCount}</span>
              <span className="text-sm">Dislikes: {selectedArticle.dislikesCount}</span>
              <span className="text-sm">Blocks: {selectedArticle.blocksCount}</span>
            </div>

          </div>
        )}
      </Dialog>

    </DashboardLayout>
  )
}

export default MyArticlesPage

