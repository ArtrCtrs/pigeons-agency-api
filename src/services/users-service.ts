import db from '../db/pgpool';
let pool = db.getPool();

export class UsersService{
    static async addDummyUser(id:number){
        let text = "INSERT INTO USERS VALUES  ($1, 'bob', 'ttt', 2)";
        let dbres = await pool.query(text,[id]);

    }
    static async getUsers(): Promise<string>{
        let text = 'SELECT * FROM USERS;';
        let dbres = await pool.query(text); 
        console.log(dbres.rows);
        let ret = await Promise.resolve(dbres.rows);
       
        return ret;
        //return dbres.rows;

    };
}