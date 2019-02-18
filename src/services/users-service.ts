import db from '../db/pgpool';
import { User } from '../entities/User';
import { PigeonsService } from './pigeons-service';
let pool = db.getPool();

export class UsersService {

    static async getUserFromRequest(id: number): Promise<User> {
        let text = "SELECT * FROM USERS WHERE id=$1;";
        let user: User = (await pool.query(text, [id])).rows[0];

        return user;

    }
    static async getAllUsers(): Promise<string> {
        const text = 'SELECT * FROM USERS ORDER BY (totalspentdroppings + totalspentseeds + 10 * totalspentfeathers) DESC;';
        const dbres = await pool.query(text);
        return dbres.rows;

    };

    static async updateUserInfo(user: User) {
        //update ressources
        const elapsedTime = (Date.now() - user.lastupdate) / (1000 * 60); //minutes 
        user.lastupdate = Date.now();
        user.seeds += Math.round(user.seedsminute * elapsedTime);
        user.droppings += Math.round(user.totaldroppingsminute * elapsedTime);

        //handle max seeds and droppings
        user.seeds = user.seeds > user.maxseeds ? user.maxseeds : user.seeds;
        user.droppings = user.droppings > user.maxdroppings ? user.maxdroppings : user.droppings;

        const text = 'UPDATE USERS SET seeds = $1, droppings = $2, lastupdate = $3  WHERE id =$4;';
        await pool.query(text, [user.seeds, user.droppings, user.lastupdate, user.id]);
    }

    static async updateExpeditions(user: User) {
        let text = "SELECT * FROM EXPEDITIONS WHERE ownerid=$1 AND finished = false;";
        let expeditions = (await pool.query(text, [user.id])).rows;
        const time = Date.now();
        
        for (let i = 0; i < expeditions.length; i++) {
            if (time > Number.parseInt(expeditions[i].starttime) + Number.parseInt(expeditions[i].duration)) {
                let text = "UPDATE EXPEDITIONS SET finished = true WHERE id=$1;";
                await pool.query(text, [expeditions[i].id]);
                if (user.birds < user.maxbirds) {
                    user.birds+=1;
                    await PigeonsService.addPigeon(user.id, expeditions[i].type);
                }
            }
        }
    }
}
