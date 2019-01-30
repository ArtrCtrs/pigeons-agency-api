import { UsersService } from '../services/users-service';
import { Response, Request } from 'express';
export class UsersControler {


    static async addDummyUser(req: Request, res: Response) {
        //check stuff here
        await UsersService.addDummyUser(Number.parseInt(req.body.lvl));

        res.status(200).send({
            message: 'ok',
            data: null
        });

    }

    static async getUsers(req: Request, res: Response) {
       
        let data = await UsersService.getUsers();
        res.status(200).send({
            message: 'ok',
            data: data
        });

    }

}