import db from '../db/pgpool';
let pool = db.getPool();

export class ErrorService {
    static async logError(errorcode:any,details:any) {
        const text = "INSERT INTO ERRORS(errorcode,details,date) VALUES  ($1,$2,$3)";
        await pool.query(text,[errorcode,details,Date.now()]);
    }
}