import { UsersService } from '../services/users-service';
import { Response, Request } from 'express';
import { AbstractController } from './abstract-controler';
export class UsersControler extends AbstractController {


    static async getUsers(req: Request, res: Response) {

        let data = await UsersService.getUsers();
        res.status(200).send({
            message: 'ok',
            data: data
        });

    }

    static async getUpdatedUserInfo(req: Request, res: Response){
        
        const user = await UsersControler.getUserFromRequest(req);
        res.status(200).send({
            message: 'ok',
            data: user
        });
    }

}