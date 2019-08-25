import { AchievementsService } from './../services/achievements-service';
import { Response, Request } from 'express';
import { AbstractController } from './abstract-controler';
import { ConnectError } from '../classes/connect-error';
import globalhelper from '../helpers/globals-helper';
export class AchievementsControler extends AbstractController {

    static async getAchievements(req: Request, res: Response) {
        const user = await AchievementsControler.getUserFromRequest(req);
        await AchievementsControler.updateUserInfo(user);

        let userAchievements = await AchievementsService.getAchievements(user);

        res.status(200).send({
            message: 'ok',
            data: {user:user,userAchievements:userAchievements}
        });
    }

}