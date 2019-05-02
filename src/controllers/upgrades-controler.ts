import { Response, Request } from 'express';
import { AbstractController } from './abstract-controler';
import { ConnectError } from "../classes/connect-error";
import seedsUpgradesList from '../lists/seedsUpgradesList';
import seedsStorageList from '../lists/seedsStorageList';
import droppingsStorageList from '../lists/droppingsStorageList';
import aviaryUpgradesList from '../lists/aviaryUpgradesList';
import { upgradesService } from '../services/upgrades-service';

export class UpgradesControler extends AbstractController {

    static async getCurrentUpgrades(req: Request, res: Response) {
        const user = await UpgradesControler.getUserFromRequest(req);
        //await UpgradesControler.updateUserInfo(user);

        res.status(200).send({
            message: 'ok',
            data: {
                farmlvl: user.farmlvl,
                aviarylvl: user.aviarylvl,
                farmstoragelvl: user.farmstoragelvl,
                droppingsstoragelvl: user.droppingsstoragelvl
            }
        });
    }

    static async upgradeFarm(req: Request, res: Response) {
        const user = await UpgradesControler.getUserFromRequest(req);
        //await UpgradesControler.updateUserInfo(user);

        if (user.droppings < seedsUpgradesList[user.farmlvl + 1].droppingsCost) {
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
        // await UpgradesControler.updateUserInfo(user);
        
        if (user.feathers < aviaryUpgradesList[user.aviarylvl + 1].feathersCost) {
            throw new ConnectError('REQUIREMENTS_ERROR');
        }
        await upgradesService.upgradeAviary(user);
        res.status(200).send({
            message: 'ok',
            data: null
        });
    }

    static async upgradeFarmStorage(req: Request, res: Response) {
        const user = await UpgradesControler.getUserFromRequest(req);
        if (user.droppings < seedsStorageList[user.farmstoragelvl + 1].droppingsCost || user.feathers < seedsStorageList[user.farmstoragelvl + 1].feathersCost) {
            throw new ConnectError('REQUIREMENTS_ERROR');
        }
        await upgradesService.upgradeFarmStorage(user);
        res.status(200).send({
            message: 'ok',
            data: null
        });
    }
    static async upgradeDroppingsStorage(req: Request, res: Response) {
        const user = await UpgradesControler.getUserFromRequest(req);
        if (user.seeds < droppingsStorageList[user.droppingsstoragelvl + 1].seedsCost || user.feathers < droppingsStorageList[user.droppingsstoragelvl + 1].feathersCost) {
            throw new ConnectError('REQUIREMENTS_ERROR');
        }
        await upgradesService.upgradeDroppingsStorage(user);
        res.status(200).send({
            message: 'ok',
            data: null
        });
    }





}

