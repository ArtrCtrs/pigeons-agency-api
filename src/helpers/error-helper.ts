import { Request, Response } from 'express';
import { ConnectError } from "../classes/connect-error";
import { ErrorService } from '../services/error-service';
import globalhelper from '../helpers/globals-helper';

export default class ErrorHelper {
	static handledErrors: Errors = {
		'MISSING_TOKEN': {
			errorCode: 403,
			errorMessage: 'Failed to get an access token.'
		},
		'EXPIRED_TOKEN': {
			errorCode: 401,
			errorMessage: 'Expired access token.'
		},
		'INVALID_TOKEN': {
			errorCode: 403,
			errorMessage: 'Failed to verify the access token.'
		},
		'INVALID_PARAMETERS': {
			errorCode: 400,
			errorMessage: 'Your browser sent a request that our server could not understand.'
		},
		'INVALID_CREDENTIALS': {
			errorCode: 401,
			errorMessage: 'The given username or password is incorrect.'
		},
		'FORBIDDEN': {
			errorCode: 403,
			errorMessage: 'You do not have permission to access this resource.'
		},
		'USERNAME_ALREADY_EXISTS': {
			errorCode: 409,
			errorMessage: 'This username is not available.'
		},
		'EMAIL_ALREADY_EXISTS': {
			errorCode: 409,
			errorMessage: 'This email is not available.'
		},
		'REQUIREMENTS_ERROR': {
			errorCode: 409,
			errorMessage: 'You don\'t have the necessary ressources.'
		},
		'USER_NOT_FOUND': {
			errorCode: 409,
			errorMessage: 'User not found.'
		},
		'ATTACK_REQUIREMENTS': {
			errorCode: 409,
			errorMessage: 'You cannot attack this player at this time.'
		},
		'EXPEDITION_ERROR': {
			errorCode: 409,
			errorMessage: 'Expedition does not exist.'
		},
		'LEVEL_REQUIREMENT_ERROR': {
			errorCode: 409,
			errorMessage: 'Player level must be greater than upgrade level.'
		},
		'EVENT_REQUIREMENTS': {
			errorCode: 409,
			errorMessage: 'You cannot activate event at this time.'
		},
		'EVENT_REQUIREMENTS_NULL': {
			errorCode: 409,
			errorMessage: 'You cannot activate event at this time (null).'
		},
		'EVENT_REQUIREMENTS_WRONG': {
			errorCode: 409,
			errorMessage: 'You cannot activate event at this time (wrong).'
		},
		'EVENT_REQUIREMENTS_NULL_2': {
			errorCode: 409,
			errorMessage: 'You cannot activate event at this time (null2).'
		},
		'EVENT_REQUIREMENTS_WRONG_2': {
			errorCode: 409,
			errorMessage: 'You cannot activate event at this time (wrong2).'
		},
		'PIGEON_REQUIREMENTS': {
			errorCode: 409,
			errorMessage: 'This pigeon dosnt exist anymore.'
		},
		'UNKNOWN_ACHIEVEMENT': {
			errorCode: 409,
			errorMessage: 'This achievement does not exist.'
		},
		'ACHIEVEMENT_REQUIREMENTS': {
			errorCode: 409,
			errorMessage: 'You do not meet the required goals.'
		}
	};

	/**
		 * Returns the right error code to the client
		 * 
		 * @param err 
		 * @param req 
		 * @param res 
		 * @param next 
		 */
	static async clientErrorHandler(err: Error, req: Request, res: Response, next: Function) {
		if (err instanceof ConnectError) {
			// handled error
			let errorCode = 520;
			let errorMessage = 'A technical error occured. Please try again later.';

			const errorId: string = err.message;

			if (ErrorHelper.handledErrors.hasOwnProperty(errorId)) {
				errorCode = ErrorHelper.handledErrors[errorId].errorCode;
				errorMessage = ErrorHelper.handledErrors[errorId].errorMessage;
			} else {
				console.error(`Unknown error identifier: ${errorId}`);
				console.error(err.stack);
			}

			res.status(errorCode).send({
				data: null,
				message: errorMessage
			});

			await ErrorService.logError(errorCode, errorMessage);
		} else {
			// unhandled error
			console.error(err.stack);

			globalhelper.setExpFalse();

			let data = null;

			if (process.env.NODE_ENV === 'dev') {
				data = {
					error: err
				};
			}

			res.status(500).send({
				data: data,
				message: 'Something went wrong.'
			});
			await ErrorService.logError(500, err.stack);
		}

	}
}
interface Errors {
	[key: string]: {
		errorCode: number;
		errorMessage: string;
	};
}

