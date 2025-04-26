import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    
    preferences: [{ type: String, 
      enum: ["Sports", "Politics", "Technology", "Space", "Health", "Entertainment", "Science", "Business"] 
    }]

  },
  {
    timestamps: true,
  },
)

const User = mongoose.model("User", userSchema)

export default User;
