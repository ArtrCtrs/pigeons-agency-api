import { Message } from './../entities/message';
import db from '../db/pgpool';
let pool = db.getPool();

export class MessageService {
    static async createMessage(message: Message) {
        const text = "INSERT INTO messages(ownerid,title,body,sender,time) VALUES ($1,$2,$3,$4,$5);"
        await pool.query(text, [message.ownerid, message.title, message.body, message.sender, Date.now()]);

        const text2 = "INSERT INTO USERS(hasnotifications) VALUES(true) WHERE id=$1;"
        await pool.query(text2, [message.ownerid]);

    }

    static async readMessages(userid: number) {
        const text = "INSERT INTO USERS(hasnotifications) VALUES(false) WHERE id=$1;"
        await pool.query(text, [userid]);
    }

}