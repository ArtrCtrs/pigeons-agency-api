import db from '../db/pgpool';
import { User } from '../entities/User';
let pool = db.getPool();

export class AchievementsService {
    static async getAchievements(user:User) {
        const text = "SELECT * from ACHIEVEMENTS WHERE ownerid=$1";
        const resp = (await pool.query(text,[user.id])).rows[0];
        return resp;
    }
}