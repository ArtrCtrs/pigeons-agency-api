import db from '../db/pgpool';
import { User } from '../entities/User';
let pool = db.getPool();

export class MerchantService {
    static async honorpointsToFeathers(user: User) {
        const text = "UPDATE USERS set honorpoints = $1,feathers=$2 where id= $3;";
        await pool.query(text, [user.honorpoints, user.feathers, user.id]);
    }
    static async feathersToDroppings(user: User) {
        const text = "UPDATE USERS set droppings = $1,feathers=$2 where id= $3;";
        await pool.query(text, [user.droppings, user.feathers, user.id]);
    }
}