import { Request, Response, NextFunction } from 'express';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { UserRepository } from '../../infrastructure/database/repository/UserRepository';
import { UserUseCases } from '../../application/useCases/userUseCases';


interface AuthenticatedRequest extends Request {
    user?: {
      id?: string;
      email?: string;
    };
}

const userRepository = new UserRepository();
const userUseCases = new UserUseCases(userRepository);

export const updatePersonalInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, email, phone } = req.body;
        
        const userId = (req as AuthenticatedRequest).user?.id; 
        
        if(!userId) {
            throw {
                statusCode: HttpStatusCode.UNAUTHORIZED,
                message: "User not authenticated" 
            }
        }

        const updatedUser = await userUseCases.updatePersonalInfo(
            userId, {firstName, lastName, email, phone}
        )

        res.json({ message: "Profile updated successfully", user: updatedUser });

    } catch (error) {
        next(error)
    }
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = (req as AuthenticatedRequest) .user?.id;
        if(!userId) {
            throw {
                statusCode: HttpStatusCode.UNAUTHORIZED,
                message: "User not authenticated" 
            }
        }
        await userUseCases.resetPassword(userId, currentPassword, newPassword);

        res.status(HttpStatusCode.OK).json({ message: "Password updated successfully" });
        
    } catch (error) {
        next(error)
    }
}

export const updatePreferences = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const preferences = req.body;
        console.log(preferences);
        
        const userId = (req as AuthenticatedRequest).user?.id; 
        if(!userId) {
            throw {
                statusCode: HttpStatusCode.UNAUTHORIZED,
                message: "User not authenticated" 
            }
        }
        const updatedUser = await userUseCases.updatePreferences(userId, preferences);
        res.status(HttpStatusCode.OK).json({ message: "Preferences updated successfully", user: updatedUser });
    } catch (error) {
        next(error)
    }
}

