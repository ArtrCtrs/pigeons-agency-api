import { Response, Request } from 'express';
import { ConnectError } from "../classes/connect-error";
import { AbstractController } from './abstract-controler';
import { MerchantService } from '../services/merchant-service';
import globalhelper from '../helpers/globals-helper';
import tradeList from '../lists/tradeList';

export class MerchantControler extends AbstractController {
    static async honorpointsToFeathers(req: Request, res: Response) {
        if (globalhelper.getExpSem()) {
            console.log("delay");
            setTimeout(() => MerchantControler.honorpointsToFeathers(req, res), 50);
        } else {
            let user = await MerchantControler.getUserFromRequest(req);

            if (tradeList[user.lvl].fromHonor > user.honorpoints) {
                globalhelper.setExpFalse();
                throw new ConnectError('REQUIREMENTS_ERROR');
            }

            user.feathers += tradeList[user.lvl].toFeathers;
            user.honorpoints -= tradeList[user.lvl].fromHonor;

            await MerchantService.honorpointsToFeathers(user);

            globalhelper.setExpFalse();
            res.status(200).send({
                message: 'ok',
                data: user
            });
        }
    }
    static async feathersToDroppings(req: Request, res: Response) {
        if (globalhelper.getExpSem()) {
            console.log("delay");
            setTimeout(() => MerchantControler.feathersToDroppings(req, res), 50);
        } else {
            let user = await MerchantControler.getUserFromRequest(req);

            if (tradeList[user.lvl].fromFeathers > user.feathers) {
                globalhelper.setExpFalse();
                throw new ConnectError('REQUIREMENTS_ERROR');
            }

            user.feathers -= tradeList[user.lvl].fromFeathers;
            user.droppings += tradeList[user.lvl].toDroppings;
            user.totalspentfeathers+=tradeList[user.lvl].fromFeathers;

            await MerchantService.feathersToDroppings(user);

            globalhelper.setExpFalse();
            res.status(200).send({
                message: 'ok',
                data: user
            });
        }
    }
}