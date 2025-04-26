import { useState, useEffect } from "react"
import { useParams, useNavigate  } from "react-router-dom"
import configAxios from "../services/axiosConfig";
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";

import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Label"
import { Textarea } from "../components/ui/Textarea"
import { Select } from "../components/ui/Select"

import DashboardLayout from "../components/DashboardLayout"
import uploadImageToCloudinary from "../services/cloudinaryService"
import validateArticleForm from "../utils/validateArticleForm"


function EditArticlePage() {
  const { id } = useParams()
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    content: "",
    tags: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({})


  const fetchArticle = async () => {
    try {
      const response = await configAxios.get(`/api/articles/${id}`);
      const { 
        title, category, description, content, tags, imageUrl 
      } = response.data;
      setFormData({ title, category, description, content, tags });
      setImageUrl(imageUrl);
    } catch (error) {
      setError("Failed to load article.")
      console.error("Error fetching articles:", error)
    }
  }

  useEffect(() => {
    console.log(`Fetching article with ID: ${id}`)
    fetchArticle();    
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleUpload = async () => {
    if (!imageFile) {
      toast.success("Please select an image!", { position: "top-center" });
      return;
    }
    setLoading(true);
    try {
      const url = await uploadImageToCloudinary(imageFile);
      setImageUrl(url);
      toast.success("Image uploaded successfully!", { position: "top-center" });
    } catch (error) {
      toast.success("Error in image Uploading!", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Edit form submitted:", formData, imageUrl)
    const validationErrors = validateArticleForm(formData, imageUrl);
    if(Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSaveLoading(true) 
    try {
      await configAxios.patch(`/api/articles/${id}`, {...formData, imageUrl});
      toast.success("Article updated successfully!", { position: "top-center" });
      navigate("/dashboard/my-articles");
    } catch (error) {
      console.error("Error publishing article:", error)
      toast.success("Failed to update article.", { position: "top-center" });
    } finally {
      setSaveLoading(false);
    }
  }


  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Edit Article</h1>

        <Card>
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <h2 className="text-xl font-bold">Edit Article</h2>
              <p className="text-sm text-gray-500">Make changes to your article</p>
            </div>

            <div className="p-6 pt-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Article Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  id="category"
                  value={formData.category.toLocaleLowerCase()}
                  onValueChange={handleSelectChange}
                  options={[
                    { value: "sports", label: "Sports" },
                    { value: "politics", label: "Politics" },
                    { value: "technology", label: "Technology" },
                    { value: "space", label: "Space" },
                    { value: "health", label: "Health" },
                    { value: "entertainment", label: "Entertainment" },
                    { value: "science", label: "Science" },
                    { value: "business", label: "Business" },
                  ]}
                />
                {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="min-h-[300px]"
                />
                {<errors className="cont"></errors> && <p className="text-red-500 text-sm">{errors.content}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="current-image">Current Image</Label>
                <img
                  src={imageUrl ? imageUrl : "/images/place-holder.svg"}
                  alt="Article featured image"
                  className="w-full max-w-md h-[200px] object-cover rounded-md"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Change Featured Image</Label>
                <Input id="image" type="file" 
                  onChange={handleImageChange}
                />
                <Button type="button" disabled={loading} onClick={handleUpload} >
                  {loading ? "Uploading..." : "Upload Image"}
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input id="tags" name="tags" 
                  value={Array.isArray(formData.tags) ? formData.tags.join(", ") : formData.tags} 
                  onChange={handleChange} 
                />
                {errors.tags && <p className="text-red-500 text-sm">{errors.tags}</p>}
              </div>
            </div>

            <div className="flex justify-between p-6 pt-0">
              <Button type="button" variant="outline"
                onClick={() => navigate("/dashboard/my-articles")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saveLoading}>
                {saveLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default EditArticlePage

