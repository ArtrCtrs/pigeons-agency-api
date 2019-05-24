import { Response, Request } from 'express';
import { ConnectError } from "../classes/connect-error";
import { AbstractController } from './abstract-controler';
import { AttackService } from '../services/attack-service';
import globalhelper from '../helpers/globals-helper';

export class AttackControler extends AbstractController {
    static async attackPlayer(req: Request, res: Response) {
        if (globalhelper.getExpSem()) {
            console.log("delay attack");
            setTimeout(() => AttackControler.attackPlayer(req, res), 50);
        } else {
            globalhelper.setExpTrue();
            const user = await AttackControler.getUserFromRequest(req);
            await AttackControler.updateUserInfo(user);

            if (req.body.userid == null) {
                globalhelper.setExpFalse();
                throw new ConnectError('INVALID_PARAMETERS');
            }
            if (user.nextpossibleattack > Date.now()) {
                globalhelper.setExpFalse();
                throw new ConnectError('ATTACK_REQUIREMENTS');
            }

            await AttackService.attackPlayer(user, req.body.userid);
            globalhelper.setExpFalse();
            res.status(200).send({
                message: 'ok',
                data: null
            });

        }
    }
}