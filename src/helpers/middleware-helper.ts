import { Request, Response } from 'express';

import jwt from 'jsonwebtoken';
import config from '../config/config.json';
import { ConnectError } from '../classes/connect-error';



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