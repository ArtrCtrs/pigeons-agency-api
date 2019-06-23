import db from '../db/pgpool';
import { User } from '../entities/User';
import { PigeonsService } from './pigeons-service';
let pool = db.getPool();

export class UsersService {

    static async getUserFromRequest(id: number): Promise<User> {
        let text = "SELECT * FROM USERS WHERE id=$1;";
        let user: User = (await pool.query(text, [id])).rows[0];
        user.password = null;
        return user;

    }
    static async getAllUsers(): Promise<User[]> {
        const text = 'SELECT * FROM USERS ORDER BY militaryscore DESC, (totalspentdroppings + totalspentseeds + 10 * totalspentfeathers) DESC;';
        const users: User[] = (await pool.query(text)).rows;
        users.forEach(element => {
            element.password = null;
        });
        return users;

    }

    static async getUsersForAttacks(user: User): Promise<User[]> {
        const text = 'SELECT * FROM USERS ORDER BY (ABS($1 - lvl)) ASC,(ABS($2 - militaryscore)) ASC;';
        const users: User[] = (await pool.query(text, [user.lvl,user.militaryscore])).rows;
        users.forEach(element => {
            element.password = null;
        });
        return users;
    }

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
        const text = "SELECT * FROM EXPEDITIONS WHERE ownerid=$1 AND finished = false;";
        let expeditions = (await pool.query(text, [user.id])).rows;
        if (expeditions.length > 0) {
            const time = Date.now();
            const text2 = "SELECT COUNT(*) FROM PIGEONS where ownerid=$1;";
            let nbrBirds: number = (await pool.query(text2, [user.id])).rows[0].count;
            let toUpdate = false;

            for (let i = 0; i < expeditions.length; i++) {
                if (time > Number.parseInt(expeditions[i].starttime) + Number.parseInt(expeditions[i].duration)) {
                    const text = "UPDATE EXPEDITIONS SET finished = true WHERE id=$1;";
                    await pool.query(text, [expeditions[i].id]);
                    if (nbrBirds < user.maxbirds) {
                        toUpdate = true;
                        await PigeonsService.addPigeon(user, expeditions[i].type);
                        nbrBirds = (+nbrBirds + 1);
                    }
                }
            }
            if (toUpdate) {
                const text3 = "SELECT SUM(droppingsminute) as droppings, COUNT(*) as birds from pigeons where ownerid=$1;";
                const info = (await pool.query(text3, [user.id])).rows[0];

                const text4 = "UPDATE users SET birds=$1,totaldroppingsminute=$2 where id=$3;";
                await pool.query(text4, [info.birds, info.droppings, user.id]);

            }

        }

    }
}
