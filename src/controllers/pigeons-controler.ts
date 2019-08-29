import { PigeonsService } from '../services/pigeons-service';
import { Response, Request } from 'express';
import { ConnectError } from "../classes/connect-error";
import { AbstractController } from './abstract-controler';
import globalhelper from '../helpers/globals-helper';
export class PigeonsControler extends AbstractController {

    static async getPigeons(req: Request, res: Response) {
        if (globalhelper.getExpSem()) {
            console.log("delayed")
            setTimeout(() => PigeonsControler.getPigeons(req, res), 50);
        } else {
            globalhelper.setExpTrue();

            let user = await PigeonsControler.getUserFromRequest(req);
            //await PigeonsControler.updateUserInfo(user);

            if (!req.query.orderby) {
                globalhelper.setExpFalse();
                throw new ConnectError('INVALID_PARAMETERS');
            }
            if (isNaN(req.query.orderby)) {
                globalhelper.setExpFalse();
                throw new ConnectError('INVALID_PARAMETERS');
            }

            user = await PigeonsControler.getUserFromRequest(req);
            await PigeonsControler.updateUserInfo(user);
            user = await PigeonsControler.getUserFromRequest(req);

            let pigeons = await PigeonsService.getPigeons(user.id, req.query.orderby);

            globalhelper.setExpFalse();

            res.status(200).send({
                message: 'ok',
                data: {
                    user: user,
                    pigeons: pigeons
                }
            });
        }
    }
    static async sellPigeon(req: Request, res: Response) {
        if (globalhelper.getExpSem()) {
            console.log("delayed")
            setTimeout(() => PigeonsControler.sellPigeon(req, res), 50);
        } else {
            globalhelper.setExpTrue();

            let user = await PigeonsControler.getUserFromRequest(req);
            //await PigeonsControler.updateUserInfo(user);

            if (!req.body.pigeonid) {
                globalhelper.setExpFalse();
                throw new ConnectError('INVALID_PARAMETERS');
            }
            if (!req.query.orderby) {
                globalhelper.setExpFalse();
                throw new ConnectError('INVALID_PARAMETERS');
            }
            if (isNaN(req.query.orderby)) {
                globalhelper.setExpFalse();
                throw new ConnectError('INVALID_PARAMETERS');
            }
            await PigeonsService.sellPigeon(user, req.body.pigeonid);

            user = await PigeonsControler.getUserFromRequest(req);
            await PigeonsControler.updateUserInfo(user);
            user = await PigeonsControler.getUserFromRequest(req);

            let pigeons = await PigeonsService.getPigeons(user.id, req.query.orderby);

            globalhelper.setExpFalse();


            res.status(200).send({
                message: 'ok',
                data: {
                    user: user,
                    pigeons: pigeons
                }
            });
        }
    }
    static async setAttacker(req: Request, res: Response) {
        if (globalhelper.getExpSem()) {
            console.log("delayed")
            setTimeout(() => PigeonsControler.setAttacker(req, res), 50);
        } else {
            globalhelper.setExpTrue();

            let user = await PigeonsControler.getUserFromRequest(req);
            //await PigeonsControler.updateUserInfo(user);
            if (!req.body.pigeonid) {
                globalhelper.setExpFalse();
                throw new ConnectError('INVALID_PARAMETERS');
            }
            if (!req.query.orderby) {
                globalhelper.setExpFalse();
                throw new ConnectError('INVALID_PARAMETERS');
            }
            if (isNaN(req.query.orderby)) {
                globalhelper.setExpFalse();
                throw new ConnectError('INVALID_PARAMETERS');
            }
            await PigeonsService.setAttacker(user, req.body.pigeonid);

            user = await PigeonsControler.getUserFromRequest(req);
            await PigeonsControler.updateUserInfo(user);
            user = await PigeonsControler.getUserFromRequest(req);

            let pigeons = await PigeonsService.getPigeons(user.id, req.query.orderby);

            globalhelper.setExpFalse();

            res.status(200).send({
                message: 'ok',
                data: {
                    user: user,
                    pigeons: pigeons
                }
            });
        }
    }
    static async setDefender(req: Request, res: Response) {
        if (globalhelper.getExpSem()) {
            console.log("delayed")
            setTimeout(() => PigeonsControler.setDefender(req, res), 50);
        } else {
            globalhelper.setExpTrue();

            let user = await PigeonsControler.getUserFromRequest(req);
            //await PigeonsControler.updateUserInfo(user);
            if (!req.body.pigeonid) {
                globalhelper.setExpFalse();
                throw new ConnectError('INVALID_PARAMETERS');
            }
            if (!req.query.orderby) {
                globalhelper.setExpFalse();
                throw new ConnectError('INVALID_PARAMETERS');
            }
            if (isNaN(req.query.orderby)) {
                globalhelper.setExpFalse();
                throw new ConnectError('INVALID_PARAMETERS');
            }
            await PigeonsService.setDefender(user, req.body.pigeonid);

            user = await PigeonsControler.getUserFromRequest(req);
            await PigeonsControler.updateUserInfo(user);
            user = await PigeonsControler.getUserFromRequest(req);

            let pigeons = await PigeonsService.getPigeons(user.id, req.query.orderby);
            globalhelper.setExpFalse();

            res.status(200).send({
                message: 'ok',
                data: {
                    user: user,
                    pigeons: pigeons
                }
            });
        }
    }
    // static async addPigeon(req: Request, res: Response) {

    //     const user = await PigeonsControler.getUserFromRequest(req);
    //     await PigeonsControler.updateUserInfo(user);

    //     await PigeonsService.addPigeon(user.id,req.body.expedition);
    //     res.status(200).send({
    //         message: 'ok',
    //         data: null
    //     });
    // }



    // static async feedPigeon(req:Request,res:Response){
    //     const user = await PigeonsControler.getUserFromRequest(req);
    //     //await PigeonsControler.updateUserInfo(user);
    //     if(!req.body.pigeonid){
    //         throw new ConnectError('INVALID_PARAMETERS');
    //     }

    //     await PigeonsService.feedPigeon(user,req.body.pigeonid);
    //     res.status(200).send({
    //         message: 'ok',
    //         data: null
    //     });

    // }


}