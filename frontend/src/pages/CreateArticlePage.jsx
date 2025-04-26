import DashboardLayout from "../components/DashboardLayout"
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Label"
import { Textarea } from "../components/ui/Textarea"
import { Select } from "../components/ui/Select"

import { useState } from "react"
import { useSelector } from "react-redux"
import configAxios from "../services/axiosConfig"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";


import uploadImageToCloudinary from "../services/cloudinaryService"
import validateArticleForm from "../utils/validateArticleForm"
import { useNavigate } from "react-router-dom"


function CreateArticlePage() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    content: "",
    tags: "",
  })

  const [imageFile, setImageFile] = useState(null)
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const user = useSelector((state) => state.auth.user) 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImageFile(file)
  }

  const handleUpload = async () => {
    if (!imageFile) {
      toast.success("Please select an image!", { position: "top-center" });
      return
    }
  
    setLoading(true)
    try {
      const url = await uploadImageToCloudinary(imageFile)
      setImageUrl(url)
      toast.success("Image uploaded successfully!", { position: "top-center" });
    } catch (error) {
      toast.error("Error in image Uploading!", { position: "top-center" });
    } finally {
      setLoading(false)
    }
  }

  const handleSelectChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validateArticleForm(formData, imageFile);
    if(Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true)    

    const articleData = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        imageUrl,
        author: user._id, 
    }    

    try {
      const response = await configAxios.post('/api/create-article', {
        articleData,
      })
      console.log("Article published:", response.data)
      toast.success("Article successfully published!", { position: "top-center" });  
      navigate("/dashboard/my-articles");      
    } catch (error) {
        console.error("Error publishing article:", error)
        toast.error("Failed to publish article.", { position: "top-center" });
    } finally {
        setLoading(false)
    }

  }

  const handleSaveDraft = async (e) => {
    console.log('====================================');
    console.log("DRAFT");
    console.log('====================================');
    e.preventDefault()

    const validationErrors = validateArticleForm(formData, imageFile);
    if(Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true)    

    const articleData = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        imageUrl,
        author: user._id, 
    }    

    try {
      const response = await configAxios.post('/api/draft-article', {
        articleData,
      })
      console.log("Article drafted:", response.data)
      toast.success("Article successfully drafted!", { position: "top-center" });  
      navigate("/dashboard/my-articles");      
    } catch (error) {
        console.error("Error draft article:", error)
        toast.error("Failed to draft article.", { position: "top-center" });
    } finally {
        setLoading(false)
    }  
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Create Article</h1>

        <Card>
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <h2 className="text-xl font-bold">New Article</h2>
              <p className="text-sm text-gray-500">Create a new article to share with the community</p>
            </div>

            <div className="p-6 pt-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Article Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter a descriptive title"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  id="category"
                  value={formData.category}
                  onValueChange={handleSelectChange}
                  placeholder="Select a category"
                  options={[
                    { value: "Sports", label: "Sports" },
                    { value: "Politics", label: "Politics" },
                    { value: "Technology", label: "Technology" },
                    { value: "Space", label: "Space" },
                    { value: "Health", label: "Health" },
                    { value: "Entertainment", label: "Entertainment" },
                    { value: "Science", label: "Science" },
                    { value: "Business", label: "Business" },
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
                  placeholder="Write a brief description of your article"
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
                  placeholder="Write your article content here"
                  className="min-h-[300px]"
                />
                {<errors className="cont"></errors> && <p className="text-red-500 text-sm">{errors.content}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Featured Image</Label>
                {imageUrl && <img src={imageUrl} alt="Uploaded Preview" className="mt-2 w-40 h-40 object-cover" />}
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                {errors.imageUrl && <p className="text-red-500 text-sm">{errors.imageUrl}</p>}
                <Button type="button" onClick={handleUpload} disabled={loading}>
                  {loading ? "Uploading..." : "Upload Image"}
                </Button>
              </div>              

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="Enter tags separated by commas"
                />
                  {errors.tags && <p className="text-red-500 text-sm">{errors.tags}</p>}
              </div>
            </div>

            <div className="flex justify-between p-6 pt-0">
              <Button type="button" variant="outline" onClick={handleSaveDraft}>
                Save as Draft
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Publishing..." : "Publish Article"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default CreateArticlePage

