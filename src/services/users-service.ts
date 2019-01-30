import db from '../db/pgpool';
let pool = db.getPool();

export class UsersService{
    static async addDummyUser(lvl:number){
        let text = "INSERT INTO USERS(username,password,lvl) VALUES  ('bob','password',$1)";
        let dbres = await pool.query(text,[lvl]);

    }
    static async getUsers(): Promise<string>{
        let text = 'SELECT * FROM USERS;';
        let dbres = await pool.query(text); 
        return dbres.rows;

    };
}