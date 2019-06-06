import { Response, Request } from 'express';
import { ConnectError } from "../classes/connect-error";
import { AbstractController } from './abstract-controler';
import { EventService } from '../services/event-service';
import globalhelper from '../helpers/globals-helper';

export class EventControler extends AbstractController {
    static async getEventInfo(req: Request, res: Response) {

        let user = await EventControler.getUserFromRequest(req);

        const data = await EventService.getEventInfo(user);
        res.status(200).send({
            message: 'ok',
            data: data
        });
    }
}