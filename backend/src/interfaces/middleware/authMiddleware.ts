import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express";
import { config } from "../../config/config";
import { HttpStatusCode } from "../../enums/HttpStatusCode";

interface JwtUserPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

// Define a custom interface extending Request
interface AuthenticatedRequest extends Request {
  user?: {
    id?: string;
    email?: string;
  };
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  console.log("Entered");
    
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log(token);
  
  if (!token) {
    console.log("no token");    
    throw {
        statusCode: HttpStatusCode.UNAUTHORIZED, 
        message: "Access denied. Authentication token is missing."
    }
  } 

  try {    
    const decoded = jwt.verify(token, config.jwt.ACCESS_TOKEN_SECRET) as JwtUserPayload;
    (req as AuthenticatedRequest).user = {
      id: decoded.id,
      email: decoded.email
    };
    console.log("User in Req", (req as AuthenticatedRequest).user);
    
    next();
  } catch (error) {
    next(error);
  }
};
