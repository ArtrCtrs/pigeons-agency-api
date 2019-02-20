import db from '../db/pgpool';
import expeditionsList from '../lists/expeditionsList';
import pigeonList from '../lists/pigeonsList';
import { User } from '../entities/User';
import { ConnectError } from '../classes/connect-error';
let pool = db.getPool();

export class PigeonsService {

    static async getPigeons(id: number): Promise<string> {
        const text = "SELECT * FROM PIGEONS WHERE ownerid=$1 ORDER BY creationtime desc;";
        const dbres = await pool.query(text, [id]);
        return dbres.rows;

    }

    static async addPigeon(id: number, expeditiontype: number) {
        const random = Math.random() * 100;
        let i = 0;
        while (random > expeditionsList[expeditiontype].reward[i].probability) {
            i++;
        }
        const pigeontype = expeditionsList[expeditiontype].reward[i].pigeontype;

        const attackdiff = Math.round(Math.random() * pigeonList[pigeontype].attackvariance * 2 - pigeonList[pigeontype].attackvariance);
        const pigeonattack = pigeonList[pigeontype].attack + attackdiff;

        const shielddiff = Math.round(Math.random() * pigeonList[pigeontype].shieldvariance * 2 - pigeonList[pigeontype].shieldvariance);
        const pigeonshield = pigeonList[pigeontype].shield + shielddiff;

        const defensediff = Math.round(Math.random() * pigeonList[pigeontype].defensevariance * 2 - pigeonList[pigeontype].defensevariance);
        const pigeondefense = pigeonList[pigeontype].defense + defensediff;

        const droppingsdiff = Math.round(Math.random() * pigeonList[pigeontype].droppingsminutevariance * 2 - pigeonList[pigeontype].droppingsminutevariance);
        const pigeondroppings = pigeonList[pigeontype].droppingsminute + droppingsdiff;


        const text = "INSERT INTO PIGEONS(type,name,rank,attack,attackrandomness,shield,defense,defenserandomness,droppingsminute,feathers,energy,maxenergy,element,feedcost,creationtime,ownerid) VALUES  ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)";
        await pool.query(text, [pigeontype, pigeonList[pigeontype].name, pigeonList[pigeontype].rank, pigeonattack, pigeonList[pigeontype].attackrandomness, pigeonshield, pigeondefense, pigeonList[pigeontype].defenserandomness, pigeondroppings, pigeonList[pigeontype].feathers, pigeonList[pigeontype].energy, pigeonList[pigeontype].energy, pigeonList[pigeontype].element, pigeonList[pigeontype].feedcost, Date.now(), id]);
        await this.updateUser(id, pigeondroppings);

    }
    static async sellPigeon(pigeonid: number) {
        let text = "SELECT ownerid,droppingsminute,feathers FROM PIGEONS WHERE id=$1"
        const pigeon = (await pool.query(text, [pigeonid])).rows[0];
        text = "SELECT totaldroppingsminute,feathers,birds from USERS WHERE id=$1"
        const user = (await pool.query(text, [pigeon.ownerid])).rows[0];
        text = "UPDATE USERS SET totaldroppingsminute = $1,feathers=$2,birds=$3  WHERE id =$4;";
        await pool.query(text, [user.totaldroppingsminute - pigeon.droppingsminute, user.feathers + pigeon.feathers, user.birds - 1, pigeon.ownerid]);
        text = "DELETE FROM PIGEONS WHERE id=$1"
        await pool.query(text, [pigeonid]);
    }

    static async destroyPigeon(pigeonid: number) {
        let text = "SELECT ownerid, droppingsminute FROM PIGEONS WHERE id=$1"
        const pigeon = (await pool.query(text, [pigeonid])).rows[0];
        text = "SELECT totaldroppingsminute,birds from USERS WHERE id=$1"
        const user = (await pool.query(text, [pigeon.ownerid])).rows[0];
        text = "UPDATE USERS SET totaldroppingsminute = $1,birds=$2  WHERE id =$3;";
        await pool.query(text, [user.totaldroppingsminute - pigeon.droppingsminute, user.birds - 1, pigeon.ownerid]);
        text = "DELETE FROM PIGEONS WHERE id=$1"
        await pool.query(text, [pigeonid]);
    }
    static async feedPigeon(user: User, pigeonid: number) {
        let text = 'SELECT feedcost,energy,maxenergy FROM PIGEONS WHERE id=$1';
        const pigeon = (await pool.query(text, [pigeonid])).rows[0];
        const feedcost = pigeonList[pigeon.type].feedcost;
        if (user.seeds < feedcost || pigeon.energy>=pigeon.maxenergy) {
            throw new ConnectError('REQUIREMENTS_ERROR');
        }
        text = 'UPDATE USERS SET seeds = $1 WHERE id = $2';
        await pool.query(text, [user.seeds - feedcost, user.id]);
        text = 'UPDATE PIGEONS SET energy = $1 WHERE id = $2';
        await pool.query(text, [pigeon.energy + 1, pigeonid]);



    }

    static async updateUser(userid: number, droppings: number) {
        let text = "SELECT totaldroppingsminute,birds from USERS WHERE id = $1";
        const user = (await pool.query(text, [userid])).rows[0];

        text = "UPDATE USERS SET totaldroppingsminute = $1,birds=$2  WHERE id =$3;";
        await pool.query(text, [user.totaldroppingsminute + droppings, user.birds + 1, userid]);

    }

}
