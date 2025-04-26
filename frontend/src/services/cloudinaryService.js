import axios from "axios"

const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_API_URL = import.meta.env.VITE_CLOUDINARY_API_URL


const uploadImageToCloudinary = async (file) => {
  if (!file) {
    throw new Error("No file selected")
  }

  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET) 
  formData.append("cloud_name", CLOUDINARY_CLOUD_NAME)

  try {
    const response = await axios.post(
        CLOUDINARY_API_URL,
      formData
    )
    return response.data.secure_url 
  } catch (error) {
    console.error("Error uploading image:", error)
    throw new Error("Image upload failed")
  }
}

export default uploadImageToCloudinary
