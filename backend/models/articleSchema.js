import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true, 
    },
    content: {
      type: String,
    },
    category: { 
      type: String, 
      required: true, 
      enum: ["Sports", "Politics", "Technology", "Space", "Health", "Entertainment", "Science", "Business"] 
    },
    tags: [
      {
        type: String,
      },
    ],
    imageUrl: {
      type: String,
      default: "/placeholder.svg",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    blocks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    publishedAt: { 
      type: Date, 
      default: Date.now 
    },
    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },  
    toObject: { virtuals: true },
  },
)

articleSchema.virtual("likesCount").get(function () {
  return this.likes.length;
});

articleSchema.virtual("dislikesCount").get(function () {
  return this.dislikes.length;
});

articleSchema.virtual("blocksCount").get(function () {
  return this.blocks.length;
});


const Article = mongoose.model("Article", articleSchema)

export default Article;




