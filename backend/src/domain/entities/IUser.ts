import { Types } from 'mongoose';

export class IUser{
    constructor(
        public _id: Types.ObjectId | string, 
        public firstName: string,
        public lastName: string,
        public email: string,
        public password: string,
        public preferences: string[],
        public phone?: string | null,
    ){}
}