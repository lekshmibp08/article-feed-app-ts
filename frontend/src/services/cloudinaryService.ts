import axios from "axios"
import { config } from "../config/config"


const uploadImageToCloudinary = async (file: File): Promise<string> => {
  if (!file) {
    throw new Error("No file selected")
  }

  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", config.CLOUDINARY_UPLOAD_PRESET) 
  formData.append("cloud_name", config.CLOUDINARY_CLOUD_NAME)

  try {
    const response = await axios.post(
      config.CLOUDINARY_API_URL,
      formData
    )
    return response.data.secure_url 
  } catch (error) {
    console.error("Error uploading image:", error)
    throw new Error("Image upload failed")
  }
}

export default uploadImageToCloudinary
