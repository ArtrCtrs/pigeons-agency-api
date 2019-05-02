import { Response, Request } from 'express';
import { AbstractController } from './abstract-controler';
import { ExpeditionsService } from '../services/expeditions-service';
import { ConnectError } from "../classes/connect-error";

import expeditionsList from '../lists/expeditionsList';
import globalhelper from '../helpers/globals-helper';

export class ExpeditionsControler extends AbstractController {

    static async getExpeditions(req: Request, res: Response) {
        const user = await ExpeditionsControler.getUserFromRequest(req);
        //await ExpeditionsControler.updateUserInfo(user);

        let data = await ExpeditionsService.getExpeditions(user.id);
        res.status(200).send({
            message: 'ok',
            data: data
        });
    }

    static async launchExpedition(req: Request, res: Response) {
        console.log(globalhelper)

        console.log(globalhelper.getSem());

        if (!globalhelper.getSem()) {
            setTimeout(() => this.launchExpedition(req, res), 1000);
        } else {
            globalhelper.setTrue();

            console.log(globalhelper.getSem());

            const user = await ExpeditionsControler.getUserFromRequest(req);
            await ExpeditionsControler.updateUserInfo(user);

            const expeditiontype: number = req.body.expeditiontype;

            if (expeditiontype < 0 || expeditiontype >= expeditionsList.length) {
                throw new ConnectError('REQUIREMENTS_ERROR');
            }
            if (user.seeds < expeditionsList[expeditiontype].seeds) {
                throw new ConnectError('REQUIREMENTS_ERROR');
            }
            await ExpeditionsService.launchExpedition(user.id, expeditiontype, expeditionsList[expeditiontype].duration);

            user.seeds -= expeditionsList[expeditiontype].seeds;
            user.totalspentseeds += expeditionsList[expeditiontype].seeds;
            await ExpeditionsService.updatePlayer(user.id, user.seeds, user.totalspentseeds);

            globalhelper.setFalse();
            console.log(globalhelper.getSem());
            res.status(200).send({
                message: 'ok',
                data: null
            });
        }
    }
}