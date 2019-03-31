import { PigeonsService } from '../services/pigeons-service';
import { Response, Request } from 'express';
import { ConnectError } from "../classes/connect-error";
import { AbstractController } from './abstract-controler';
export class PigeonsControler extends AbstractController {

    static async getPigeons(req: Request, res: Response) {

        const user = await PigeonsControler.getUserFromRequest(req);
        await PigeonsControler.updateUserInfo(user);
        
        if(!req.query.orderby){
            throw new ConnectError('INVALID_PARAMETERS');
        }
        if(isNaN(req.query.orderby)){
            throw new ConnectError('INVALID_PARAMETERS');
        }
        let data = await PigeonsService.getPigeons(user.id,req.query.orderby);
        res.status(200).send({
            message: 'ok',
            data: data
        });

    }
    static async addPigeon(req: Request, res: Response) {

        const user = await PigeonsControler.getUserFromRequest(req);
        await PigeonsControler.updateUserInfo(user);
       
        await PigeonsService.addPigeon(user.id,req.body.expedition);
        res.status(200).send({
            message: 'ok',
            data: null
        });
    }

    static async sellPigeon(req:Request,res:Response){
        const user = await PigeonsControler.getUserFromRequest(req);
        await PigeonsControler.updateUserInfo(user);
       
        await PigeonsService.sellPigeon(req.body.pigeonid);
        res.status(200).send({
            message: 'ok',
            data: null
        });

    }

    static async feedPigeon(req:Request,res:Response){
        const user = await PigeonsControler.getUserFromRequest(req);
        await PigeonsControler.updateUserInfo(user);
        if(!req.body.pigeonid){
            throw new ConnectError('INVALID_PARAMETERS');
        }
       
        await PigeonsService.feedPigeon(user,req.body.pigeonid);
        res.status(200).send({
            message: 'ok',
            data: null
        });

    }
    static async setAttacker(req:Request,res:Response){
        const user = await PigeonsControler.getUserFromRequest(req);
        await PigeonsControler.updateUserInfo(user);
        if(!req.body.pigeonid){
            throw new ConnectError('INVALID_PARAMETERS');
        }
       
        await PigeonsService.setAttacker(user,req.body.pigeonid);
        res.status(200).send({
            message: 'ok',
            data: null
        });
    }
    static async setDefender(req:Request,res:Response){
        const user = await PigeonsControler.getUserFromRequest(req);
        await PigeonsControler.updateUserInfo(user);
        if(!req.body.pigeonid){
            throw new ConnectError('INVALID_PARAMETERS');
        }
       
        await PigeonsService.setDefender(user,req.body.pigeonid);
        res.status(200).send({
            message: 'ok',
            data: null
        });
    }

}