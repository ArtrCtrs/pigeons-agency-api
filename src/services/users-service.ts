import db from '../db/pgpool';
let pool = db.getPool();

export class UsersService {
    static async addDummyUser(lvl: number) {
        const text = "INSERT INTO USERS(username,password,lvl) VALUES  ('bob','password',$1)";
        const dbres = await pool.query(text, [lvl]);

    }
    static async getUsers(): Promise<string> {
        const text = 'SELECT * FROM USERS;';
        const dbres = await pool.query(text);
        return dbres.rows;

    };



}