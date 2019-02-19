import { User } from './../entities/User';
import db from '../db/pgpool';
let pool = db.getPool();

export class AttackService {
    static async attackPlayer(attacker:User,defender:User) {
        //todo

    }
}