import db from '../db/pgpool';
let pool = db.getPool();

export class ExpeditionsService {

    static async getExpeditions(id: number): Promise<string> {
        const text = "SELECT * FROM EXPEDITIONS WHERE ownerid=$1 AND finished=false;";
        const dbres = await pool.query(text, [id]);
        return dbres.rows;

    }

    static async launchExpedition(id: number, exptype: number, duration: number) {

        const text = "INSERT INTO EXPEDITIONS(type,starttime,duration,ownerid) VALUES  ($1,$2,$3,$4)";
        await pool.query(text, [exptype, Date.now(), duration, id]);

    }
    static async updatePlayer(id: number, amount: number,total:number) {

        const text = 'UPDATE USERS SET seeds = $1,totalspentseeds = $2  WHERE id =$3;';
        await pool.query(text, [amount,total, id]);
    }

}
