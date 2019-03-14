import { Response, Request } from 'express';
import { AbstractController } from './abstract-controler';
import { MessageService } from '../services/message-service';
export class MessagesControler extends AbstractController {

    static async getMessages(req: Request, res: Response) {
        const user = await MessagesControler.getUserFromRequest(req);
        await MessagesControler.updateUserInfo(user);

        let data = await MessageService.getMessages(user.id);
        await MessageService.readMessages(user.id);
        res.status(200).send({
            message: 'ok',
            data: data
        });
    }
}