import db from '../db/pgpool';
let pool = db.getPool();

export class LogService {
    static async logRequest(userid: any, method: any, url: any, body: any,ip:any) {
        const text = "INSERT INTO LOGS(userid,method,url,body,ip,date) VALUES  ($1,$2,$3,$4,$5,$6)";
        await pool.query(text,[userid,method,url,body,ip,Date.now()]);
    }
}