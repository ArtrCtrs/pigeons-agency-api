import db from '../db/pgpool';
import expeditionsList from '../model/expeditionsList';
import pigeonList from '../model/pigeonsList';
let pool = db.getPool();

export class PigeonsService {

    static async getPigeons(id: number): Promise<string> {
        const text = "SELECT * FROM PIGEONS WHERE ownerid=$1;";
        const dbres = await pool.query(text, [id]);
        return dbres.rows;

    }

    static async addPigeon(id: number, expeditiontype: number) {
        const random = Math.random() * 100;
        let i = 0;
        while (random > expeditionsList[expeditiontype].reward[i].probability) {
            i++;
        }
        const pigeonid = expeditionsList[expeditiontype].reward[i].pigeontype;

        const attackdiff = Math.round(Math.random() * pigeonList[pigeonid].attackvariance * 2 - pigeonList[pigeonid].attackvariance);
        const pigeonattack = pigeonList[pigeonid].attack + attackdiff;

        const defensediff = Math.round(Math.random() * pigeonList[pigeonid].defensevariance * 2 - pigeonList[pigeonid].defensevariance);
        const pigeondefense = pigeonList[pigeonid].defense + defensediff;

        const lifediff = Math.round(Math.random() * pigeonList[pigeonid].lifevariance * 2 - pigeonList[pigeonid].lifevariance);
        const pigeonlife = pigeonList[pigeonid].life + lifediff;

        const droppingsdiff = Math.round(Math.random() * pigeonList[pigeonid].droppingsminutevariance * 2 - pigeonList[pigeonid].droppingsminutevariance);
        const pigeondroppings = pigeonList[pigeonid].droppingsminute + droppingsdiff;




        const text = "INSERT INTO PIGEONS(type,name,rank,attack,defense,life,droppingsminute,feathers,ownerid) VALUES  ($1,$2,$3,$4,$5,$6,$7,$8,$9)";
        await pool.query(text, [pigeonid, pigeonList[pigeonid].name, pigeonList[pigeonid].rank, pigeonattack, pigeondefense, pigeonlife, pigeondroppings, pigeonList[pigeonid].feathers, id]);
        await this.updateUser(id, pigeondroppings);

    }
    static async deletePigeon(userid: number, pigeonid: number) {
        let text = "SELECT droppingsminute,feathers FROM PIGEONS WHERE id=$1"
        const pigeon = (await pool.query(text, [pigeonid])).rows[0];
        text = "SELECT totaldroppingsminute,feathers,birds from USERS WHERE id=$1"
        const user = (await pool.query(text, [userid])).rows[0];
        text = text = "UPDATE USERS SET totaldroppingsminute = $1,feathers=$2,birds=$3  WHERE id =$4;";
        await pool.query(text, [user.totaldroppingsminute - pigeon.droppingsminute, user.feathers + pigeon.feathers,user.birds-1, userid]);
        text = "DELETE FROM PIGEONS WHERE id=$1"
        await pool.query(text, [pigeonid]);

    }

    static async updateUser(userid: number, droppings: number) {
        let text = "SELECT totaldroppingsminute,birds from USERS WHERE id = $1";
        const user = (await pool.query(text, [userid])).rows[0];

        text = "UPDATE USERS SET totaldroppingsminute = $1,birds=$2  WHERE id =$3;";
        await pool.query(text, [user.totaldroppingsminute + droppings,user.birds+1, userid]);


    }

}
