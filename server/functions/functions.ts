import { Response } from "express";
import { Status, HttpStatus } from "../types/HttpStatus";

/**
 * Sends a response to the client
 * @param res The response
 * @param data The data that has to be sent to the client
 * @param success (optional) Defualt true.
 */
export function sendOK(res: Response, data: object, status: Status = HttpStatus.Ok, success = true): void {
	res.status(status.code).json({
		success: success,
		data: data
	});
}


/**
 * Sends an error to the client
 * @param res The response object
 * @param error The error thrown by a routine
 * @param data The data that has to be sent to the client
 * @param errMsg (optional) A custom string to specify the error that occurred
 * @param success (optional) Defualt false.
 */
export function sendErr(res: Response, error: Status, data: object, errMsg: string = error.msg, success = false): void {
	res.status(error.code).json({
		success: success,
		message: errMsg,
		error: data
	});
}


export * from "./api";
