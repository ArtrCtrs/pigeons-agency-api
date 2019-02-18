import { Request, Response } from 'express';

import jwt from 'jsonwebtoken';
import config from '../config/config.json';
import { ConnectError } from '../classes/connect-error';
import { LogService } from '../services/log-service';



export default class MiddlewareHelper {
	/**
 * Make sure that a valid token is present in the request headers
 *
 * @param {Request} req
 * @param {Response} res
 * @param next
 */
	static isLoggedIn(req: Request, res: Response, next: Function) {

		if (!req.headers.authorization || !(req.headers.authorization.split(' ')[0] === 'Bearer')) {
			throw new ConnectError('MISSING_TOKEN');
		}

		try {
			const token = req.headers.authorization.split(' ')[1];
			jwt.verify(token, config.jwtSecret);
			next();
		} catch (err) {
			if (err.name === 'TokenExpiredError') {
				throw new ConnectError('EXPIRED_TOKEN')
			} else {
				throw new ConnectError('INVALID_TOKEN')
			}
		}
	}

	static async logRequest(req: Request, res: Response, next: Function) {
		let userid;
		let body;

		if (req.headers.authorization) {
			const token = req.headers.authorization.split(' ')[1];
			const decodedPayload: any = (jwt.verify(token, config.jwtSecret));
			userid = decodedPayload.user.id;
			body = req.body;
		} else {

			body = req.body.username ? req.body.username : "";
			userid = -1;
		}

		await LogService.logRequest(userid, req.method, req.url, body, req.connection.remoteAddress);
		next();
	}

    /**
	 * Error wrapper
	 * 
	 * @param {Function} fn The function
	 */
	static wrapAsync(fn: Function) {
		return function (req: Request, res: Response, next: Function) {
			fn(req, res, next).catch(next);
		};
	}
}