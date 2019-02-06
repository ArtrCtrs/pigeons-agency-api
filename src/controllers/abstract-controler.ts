import { Request } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config.json';
import { ConnectError } from '../classes/connect-error';
import db from '../db/pgpool';
import { PigeonsService } from '../services/pigeons-service';
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

        if (!decodedPayload.user.id) {
            throw new ConnectError('INVALID_TOKEN');
        }

        let text = "SELECT * FROM USERS WHERE id=$1;";
        let user:HomePageDataAPIReturn = (await pool.query(text, [decodedPayload.user.id])).rows[0];
        if (!user.id) {
            throw new ConnectError('INVALID_TOKEN');
        }

        //update ressources
        const elapsedTime = (Date.now() - user.lastupdate) / 1000; //seconds 
        user.lastupdate = Date.now();
        user.seeds += Math.floor(user.seedsminute * elapsedTime);
        user.droppings+=Math.floor(user.totaldroppingsminute*elapsedTime);

        text = 'UPDATE USERS SET seeds = $1, droppings = $2, lastupdate = $3  WHERE id =$4;';
        await pool.query(text, [user.seeds,user.droppings, user.lastupdate, user.id]);

        await this.updateExpeditions(user);

        return user;
    };

    static async updateExpeditions(user: any) {
        let text = "SELECT * FROM EXPEDITIONS WHERE ownerid=$1 AND finished = false;";
        let expeditions = (await pool.query(text, [user.id])).rows;
        const time = Date.now();

        for (let i = 0; i < expeditions.length; i++) {
            if (time > Number.parseInt(expeditions[i].starttime) + Number.parseInt(expeditions[i].duration)) {
                let text = "UPDATE EXPEDITIONS SET finished = true WHERE id=$1;";
                await pool.query(text, [expeditions[i].id]);
                if(user.birds<user.maxbirds){
                    await PigeonsService.addPigeon(user.id, expeditions[i].type);
                }
                
            }
        }


    }
    
}
export interface HomePageDataAPIReturn { //to check
        id: number;
        username: string;
        password: string;
        lvl: number;
        birds:number;
        maxbirds: number;
        seeds: number;
        seedsminute: number;
        droppings: number;
        totaldroppingsminute: number;
        feathers: number;
        xcoord: number;
        ycoord: number;
        lastupdate: number;
    
}
