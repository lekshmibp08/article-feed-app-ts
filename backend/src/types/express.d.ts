// import { JwtPayload } from "jsonwebtoken";
// import { Types } from "mongoose";
// import { Request } from 'express';


declare global {
  namespace Express {
    interface User {
      id: string;
      email: string; 
    }

    interface Request {
      //user?: string | JwtPayload & { id?: string | Types.ObjectId; email?: string };
      user?: User
    }
  }
}

export {}