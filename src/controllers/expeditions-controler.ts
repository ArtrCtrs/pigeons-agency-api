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

        if (globalhelper.getExpSem()) {
            console.log("expedition delayed")
            setTimeout(() => ExpeditionsControler.launchExpedition(req, res), 50);
        } else {
            globalhelper.setExpTrue();
        

            const user = await ExpeditionsControler.getUserFromRequest(req);
            await ExpeditionsControler.updateUserInfo(user);

            const expeditiontype: number = req.body.expeditiontype;

            if (expeditiontype < 0 || expeditiontype >= expeditionsList.length) {
                globalhelper.setExpFalse();
                throw new ConnectError('REQUIREMENTS_ERROR');
            }
            if (user.seeds < expeditionsList[expeditiontype].seeds) {
                globalhelper.setExpFalse();
                throw new ConnectError('REQUIREMENTS_ERROR');
            }
            if(user.lvl < expeditionsList[expeditiontype].exprank){
                globalhelper.setExpFalse();
                throw new ConnectError('LEVEL_REQUIREMENT_ERROR');
            }
            await ExpeditionsService.launchExpedition(user.id, expeditiontype, expeditionsList[expeditiontype].duration);

            user.seeds -= expeditionsList[expeditiontype].seeds;
            user.totalspentseeds += expeditionsList[expeditiontype].seeds;
            await ExpeditionsService.updatePlayer(user.id, user.seeds, user.totalspentseeds);

            
            globalhelper.setExpFalse();
            res.status(200).send({
                message: 'ok',
                data: null
            });
        }
    }
}