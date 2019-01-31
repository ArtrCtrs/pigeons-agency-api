import { AuthentificationService } from '../services/authentification-service';
import{ Response, Request } from 'express';
export class AuthentificationControler {
    static async register(req: Request, res: Response) {
        await AuthentificationService.registerUser(req.body.username, req.body.password);
        res.status(200).send({
            message: 'ok',
            data: null
        });
    }

    static async login(req: Request, res: Response) {
        const token = await AuthentificationService.loginUser(req.body.username, req.body.password);
        res.status(200).send({
            message: 'ok',
            data: {
                token:token
            }
        });
    }
}