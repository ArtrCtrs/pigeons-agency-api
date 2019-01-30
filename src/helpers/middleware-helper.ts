import { Request, Response } from 'express';

import jwt from 'jsonwebtoken';
import config from '../config/config.json';
import { ConnectError } from '../classes/connect-error';

export default class MiddlewareHelper {
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