import { Response, Request } from 'express';
import { ConnectError } from "../classes/connect-error";
import { AbstractController } from './abstract-controler';
import { AttackService } from '../services/attack-service';
export class AttackControler extends AbstractController {
    static async attackPlayer(req: Request, res: Response) {
        const user = await AttackControler.getUserFromRequest(req);
        await AttackControler.updateUserInfo(user);

        if (req.body.userid == null) {
            throw new ConnectError('INVALID_PARAMETERS');
        }
        if (user.nextpossibleattack > Date.now()) {
            throw new ConnectError('ATTACK_REQUIREMENTS');
        }

        await AttackService.attackPlayer(user, req.body.userid);
        res.status(200).send({
            message: 'ok',
            data: null
        });

    }
}