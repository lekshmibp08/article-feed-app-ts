import { Types } from "mongoose";

export class IArticle {
    constructor(
        public _id: Types.ObjectId | string,
        public title: string,
        public description: string,
        public content: string,
        public category: string,
        public tags: string[],
        public author: Types.ObjectId | string,
        public status: 'Draft' | 'Published',
        public likes: (Types.ObjectId | string)[],
        public dislikes: (Types.ObjectId | string)[],
        public blocks: (Types.ObjectId | string)[],
        public imageUrl?: string,
        public publishedAt?: Date,
        public createdAt?: Date,
        public updatedAt?: Date,
    ) {}
}
  