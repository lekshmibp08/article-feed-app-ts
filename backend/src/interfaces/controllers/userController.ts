import { Request, Response, NextFunction } from 'express';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { UserRepository } from '../../infrastructure/database/repository/UserRepository';
import { UserUseCases } from '../../application/useCases/userUseCases';

const userRepository = new UserRepository();
const userUseCases = new UserUseCases(userRepository);

export const updatePersonalInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, email, phone } = req.body;
        /*
        if (!req.user || typeof req.user !== 'object' || !('id' in req.user)) {
            throw {
                statusCode: HttpStatusCode.UNAUTHORIZED,
                message: "Unauthorized"
            }
        }
        const userId = req.user.id as string;  

        const updatedUser = await userUseCases.updatePersonalInfo(
            userId, {firstName, lastName, email, phone}
        )
            */

        //res.json({ message: "Profile updated successfully", user: updatedUser });

    } catch (error) {
        next(error)
    }
}