import { PigeonsService } from '../services/pigeons-service';
import { Response, Request } from 'express';
import { AbstractController } from './abstract-controler';
export class PigeonsControler extends AbstractController {

    static async getPigeons(req: Request, res: Response) {

        const user = await PigeonsControler.getUserFromRequest(req);
       
        let data = await PigeonsService.getPigeons(user.id);
        res.status(200).send({
            message: 'ok',
            data: data
        });

    }
    static async addPigeon(req: Request, res: Response) {

        const user = await PigeonsControler.getUserFromRequest(req);
        console.log(req.body);
       
        await PigeonsService.addPigeon(user.id,req.body.pigeon);
        res.status(200).send({
            message: 'ok',
            data: null
        });

    }

}