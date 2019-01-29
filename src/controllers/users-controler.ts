import { UsersService } from '../services/users-service';
import express, { Response, Request } from 'express';
export class UsersControler {


    static async addDummyUser(req: Request, res: Response) {
        //check stuff here
        console.log(req.body);
        UsersService.addDummyUser(Number.parseInt(req.body.id));

        res.status(200).send({
            message: 'ok',
            data: null
        });

    }

    static async getUsers(req: Request, res: Response) {
        let data = UsersService.getUsers();

        res.status(200).send({
            message: 'ok',
            data: data
        });

    }

}