import { UsersService } from '../services/users-service';
import { Response, Request } from 'express';
import { AbstractController } from './abstract-controler';
export class UsersControler extends AbstractController {


    static async getAllUsers(req: Request, res: Response) {

        const data = await UsersService.getAllUsers();
        res.status(200).send({
            message: 'ok',
            data: data
        });

    }
    static async getUsersForAttacks(req: Request, res: Response) {

        let user = await UsersControler.getUserFromRequest(req);

        const data = await UsersService.getUsersForAttacks(user);
        res.status(200).send({
            message: 'ok',
            data: data
        });

    }

    static async getUpdatedUserInfo(req: Request, res: Response){
        let user = await UsersControler.getUserFromRequest(req);
        await UsersControler.updateUserInfo(user);

        user = await UsersControler.getUserFromRequest(req);

        res.status(200).send({
            message: 'ok',
            data: user
        });
    }

}