export type Category = 
  | "Sports"
  | "Politics"
  | "Technology"
  | "Space"
  | "Health"
  | "Entertainment"
  | "Science"
  | "Business";
export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  otp: string;
  preferences: Category[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginFormData {
  email?: string;
  phone?: string;
  password: string;
}

export interface IPersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface IPasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface Article {
    _id: string;
    title: string;
    description: string;
    content?: string;
    category: string;
    tags?: string[];
    imageUrl: string;
    author: IUser;
    likes: string[];      
    dislikes: string[];   
    blocks: string[];     
    publishedAt: string;  
    status: "Draft" | "Published" | string;
    createdAt: string;
    updatedAt: string;
  
    likesCount: number;
    dislikesCount: number;
    blocksCount: number;
  }

export interface IArticleFormData {
  title: string
  category: string
  description: string
  content: string
  tags: string
}  

export interface IArticleErrors {
  title?: string
  category?: string
  description?: string
  content?: string
  imageUrl?: string
  tags?: string
}
  
export interface IAuthor {
  firstName: string;
  lastName: string;
}