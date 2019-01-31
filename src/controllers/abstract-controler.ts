import { Request } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config.json';
import { ConnectError } from '../classes/connect-error';
import db from '../db/pgpool';
let pool = db.getPool();

export class AbstractController {

    /**
	 * Retrieves a user from the request
     * 
     * @param {Request} req The request
	 */
    static async getUserFromRequest(req: Request) {

        const token = req.headers.authorization.split(' ')[1];
        const decodedPayload: any = jwt.verify(token, config.jwtSecret);
        
        const text = "SELECT * FROM USERS WHERE id=$1;";
        let user = (await pool.query(text,[decodedPayload.user.id])).rows[0];

        if (!user.id) {
            throw new ConnectError('INVALID_TOKEN');
        }

        return user;
    };
}