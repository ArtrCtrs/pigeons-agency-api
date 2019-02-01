import { Request, Response } from 'express';
import { ConnectError } from "../classes/connect-error";
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
	'REQUIREMENTS_ERROR':{
		errorCode: 409,
        errorMessage: 'You don\'t have the necessary ressources.'
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
	static clientErrorHandler(err: Error, req: Request, res: Response, next: Function) {
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
		} else {
			// unhandled error
			console.error(err.stack);

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
		}
	}
}
interface Errors {
    [key: string]: {
		errorCode: number;
		errorMessage: string;
	};
}

