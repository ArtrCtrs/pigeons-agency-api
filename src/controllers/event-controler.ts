import { Response, Request } from 'express';
import { ConnectError } from "../classes/connect-error";
import { AbstractController } from './abstract-controler';
import { EventService } from '../services/event-service';
import globalhelper from '../helpers/globals-helper';

export class EventControler extends AbstractController {
    static async getEventInfo(req: Request, res: Response) {
        if (globalhelper.getExpSem()) {
            console.log("delay event");
            setTimeout(() => EventControler.getEventInfo(req, res), 50);
        } else {

            let user = await EventControler.getUserFromRequest(req);

            const data = await EventService.getEventInfo(user);
            res.status(200).send({
                message: 'ok',
                data: data
            });
        }
    }

    static async doEventAction(req: Request, res: Response) {
        if (globalhelper.getExpSem()) {
            console.log("delay event");
            setTimeout(() => EventControler.doEventAction(req, res), 50);
        } else {

            let user = await EventControler.getUserFromRequest(req);

            const data = await EventService.doEventAction(user);
            res.status(200).send({
                message: 'ok',
                data: data
            });
        }
    }
}