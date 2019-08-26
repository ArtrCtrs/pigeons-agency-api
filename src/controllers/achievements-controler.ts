import { AchievementsService } from './../services/achievements-service';
import { Response, Request } from 'express';
import { AbstractController } from './abstract-controler';
import achievementslist from '../lists/achievementsList';
import { ConnectError } from '../classes/connect-error';
import globalhelper from '../helpers/globals-helper';
export class AchievementsControler extends AbstractController {

    static async getAchievements(req: Request, res: Response) {
        const user = await AchievementsControler.getUserFromRequest(req);
        await AchievementsControler.updateUserInfo(user);

        let userAchievements = await AchievementsService.getAchievements(user);

        res.status(200).send({
            message: 'ok',
            data: { user: user, userAchievements: userAchievements }
        });
    }

    static async claimAchievement(req: Request, res: Response) {
        if (globalhelper.getExpSem()) {
            console.log("delay");
            setTimeout(() => AchievementsControler.claimAchievement(req, res), 50);
        } else {
            const user = await AchievementsControler.getUserFromRequest(req);
            await AchievementsControler.updateUserInfo(user);


            if (req.body.achievementid == null) {
                globalhelper.setExpFalse();
                throw new ConnectError('UNKNOWN_ACHIEVEMENT');
            }
            const achievement = achievementslist.filter(obj => {
                return obj.id === req.body.achievementid
            })
            if (achievement == null) {
                globalhelper.setExpFalse();
                throw new ConnectError('UNKNOWN_ACHIEVEMENT');
            }
            const u: any = user;
            if (achievement[0].value > (u[achievement[0].attribute])) {
                globalhelper.setExpFalse();
                throw new ConnectError('ACHIEVEMENT_REQUIREMENTS');
            }

            let userAchievements = await AchievementsService.claimAchievement(user, achievement[0]);

            res.status(200).send({
                message: 'ok',
                data: { user: user, userAchievements: userAchievements }
            });
        }

    }
}

