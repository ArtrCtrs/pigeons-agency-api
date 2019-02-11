import { Response, Request } from 'express';
import { AbstractController } from './abstract-controler';
import { ConnectError } from "../classes/connect-error";
import seedsUpgradesList from '../model/seedsUpgradesList';
import aviaryUpgradesList from '../model/aviaryUpgradesList';
import { upgradesService } from '../services/upgrades-service';

export class UpgradesControler extends AbstractController {

    static async getCurrentUpgrades(req: Request, res: Response) {

        const user = await UpgradesControler.getUserFromRequest(req);

        res.status(200).send({
            message: 'ok',
            data: {
                farmlvl: user.farmlvl,
                aviarylvl: user.aviarylvl
            }
        });

    }

    static async upgradeFarm(req: Request, res: Response) {
        const user = await UpgradesControler.getUserFromRequest(req);
        if (user.droppings < seedsUpgradesList[user.farmlvl].droppingsCost) {
            throw new ConnectError('REQUIREMENTS_ERROR');
        }
        await upgradesService.upgradeFarm(user);
        res.status(200).send({
            message: 'ok',
            data: null
        });
    }
    static async upgradeAviary(req: Request, res: Response) {
        const user = await UpgradesControler.getUserFromRequest(req);
        if (user.feathers < aviaryUpgradesList[user.aviarylvl].feathersCost) {
            throw new ConnectError('REQUIREMENTS_ERROR');
        }
        await upgradesService.upgradeAviary(user);
        res.status(200).send({
            message: 'ok',
            data: null
        });
    }



}

