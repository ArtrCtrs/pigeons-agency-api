import db from '../db/pgpool';
let pool = db.getPool();

export class UsersService {
    static async getUsers(): Promise<string> {
        const text = 'SELECT * FROM USERS;';
        const dbres = await pool.query(text);
        return dbres.rows;

    };



}