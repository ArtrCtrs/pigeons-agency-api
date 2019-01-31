import db from '../db/pgpool';
let pool = db.getPool();

export class PigeonsService{

    static async getPigeons(id:number):Promise<string>{
        const text = "SELECT * FROM PIGEONS WHERE ownerid=$1;";
        const dbres = await pool.query(text,[id]); 
        return dbres.rows;

    }

    static async addPigeon(id:number){
        const text = "INSERT INTO PIGEONS(type,attack,defense,ownerid) VALUES  (1,2,2,$1)";
        const dbres = await pool.query(text,[id]); 

    }

}
