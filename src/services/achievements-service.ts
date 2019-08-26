import db from '../db/pgpool';
import { User } from '../entities/User';
import { ConnectError } from '../classes/connect-error';
import globalhelper from '../helpers/globals-helper';
let pool = db.getPool();

export class AchievementsService {
    static async getAchievements(user: User) {
        const text = "SELECT * from ACHIEVEMENTS WHERE ownerid=$1";
        const resp = (await pool.query(text, [user.id])).rows[0];
        return resp;
    }

    static async claimAchievement(user: User, achievement: any) {
        let userachievements = await this.getAchievements(user);
        if (userachievements[achievement.id] == true) {
            globalhelper.setExpFalse();
            throw new ConnectError('ACHIEVEMENT_REQUIREMENTS');
        }
        userachievements[achievement.id] = false;
        const text = "UPDATE ACHIEVEMENTS set " + achievement.id + " = true where ownerid= $1;"
        await pool.query(text, [user.id]);

        const text2 = "UPDATE USERS set honorpoints = $1 where id= $2;"
        await pool.query(text2, [achievement.honorpoints, user.id])

        return userachievements;
    }
}