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
            globalhelper.setExpFalse();
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

            // if (req.body.droppingsM == null) {
            //     globalhelper.setExpFalse();
            //     throw new ConnectError('EVENT_REQUIREMENTS_NULL');
            // }
            if (typeof req.body.feathers === 'undefined' || !req.body.feathers) {

                globalhelper.setExpFalse();
                throw new ConnectError('EVENT_REQUIREMENTS_NULL_2');
            }
            // if (req.body.droppingsM !=user.totaldroppingsminute) {
            //     globalhelper.setExpFalse();
            //     throw new ConnectError('EVENT_REQUIREMENTS_WRONG');
            // }
            if (req.body.feathers != "" + user.feathers) {
                globalhelper.setExpFalse();
                throw new ConnectError('EVENT_REQUIREMENTS_WRONG_2');
            }

            const data = await EventService.doEventAction(user);
            globalhelper.setExpFalse();
            res.status(200).send({
                message: 'ok',
                data: data
            });
        }
    }
}