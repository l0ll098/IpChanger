import express = require("express");
import * as isIp from "is-ip";

import { AddressesFileHanlder } from "../handlers/AddressesFileHandler";
import { CommandHandler } from "../handlers/CommandHandler";

import { sendOK, sendErr } from "../functions/functions";
import { Address } from "../types/Data";
import { HttpStatus } from "../types/HttpStatus";


const router = express.Router();

router.get("/run/:id", async (req, res) => {
	const intId = parseInt(req.params.id, 10);
	if (typeof intId !== "number") {
		return sendErr(res, HttpStatus.NotFound, { invalidId: req.params.id });
	}
	const address = AddressesFileHanlder.getAddressById(intId);

	try {
		const stdout = await CommandHandler.changeIp(address);
		return sendOK(res, { stdout });
	} catch (err) {
		if ((err as any).missingAdminPrivileges) {
			return sendErr(res, HttpStatus.Forbidden, err);
		}

		if ((err as any).invalidInterface) {
			return sendErr(res, HttpStatus.NotModified, err);
		}
		return sendErr(res, HttpStatus.InternalServerError, err);
	}
});

router.get("/addresses", (req, res) => {
	sendOK(res, AddressesFileHanlder.getAllAddresses());
});

router.get("/addresses/:id", (req, res) => {
	// id is in base 10
	const intId = parseInt(req.params.id, 10);
	const matching = AddressesFileHanlder.getAddressById(intId);
	if (matching) {
		sendOK(res, matching);
	} else {
		sendErr(res, HttpStatus.NotFound, { message: `Address with id ${intId} has not been found!` });
	}

});

router.post("/addresses", async (req, res) => {
	const address = parseAddress(req);

	if (typeof address === "boolean") {
		return sendErr(res, HttpStatus.BadRequest, { malformedAddress: true });
	}

	let validAddress: Address;
	if (address.isStatic) {
		validAddress = addressValidator(address as Address) as Address;

		if (typeof validAddress === "boolean") {
			return sendErr(res, HttpStatus.BadRequest, { malformedAddress: true });
		}
	} else {
		validAddress = address as Address;
		validAddress.address = "";
		validAddress.gateway = "";
		validAddress.subnet = "";
	}

	try {
		await AddressesFileHanlder.addAddress(validAddress);

		return sendOK(res, { address: validAddress }, HttpStatus.Created);
	} catch (err) {
		return sendErr(res, HttpStatus.InternalServerError, err);
	}

});

router.delete("/addresses/:id", async (req, res) => {
	try {
		await AddressesFileHanlder.deleteAddress(parseInt(req.params.id, 10));
		return sendOK(res, null);

	} catch (err) {
		if (typeof err === "boolean") {
			return sendErr(res, HttpStatus.NotFound, { message: `Address with id ${req.params.id} has not been found!` });
		}

		return sendErr(res, HttpStatus.InternalServerError, err);
	}
});

router.put("/addresses/:id", async (req, res) => {
	const address = parseAddress(req, false);
	const validAddress = addressValidator(address as Address);

	if (typeof address === "object" && typeof validAddress === "object") {
		try {
			await AddressesFileHanlder.updateAddress(parseInt(req.params.id, 10), validAddress);
			return sendOK(res, null);

		} catch (err) {
			if (typeof err === "boolean") {
				return sendErr(res, HttpStatus.NotFound, { message: `Address with id ${req.params.id} has not been found!` });
			}

			return sendErr(res, HttpStatus.InternalServerError, err);
		}
	} else {
		return sendErr(res, HttpStatus.BadRequest, { malformedAddress: true });
	}

});


/**
 * Reads and returns an Address from the request body
 * @param req The HTTP request
 * @param generateId Set this to true if you are inserting a new Address. Use false, if you are parsing the Address to perform an update
 */
function parseAddress(req: express.Request, generateId: boolean = true): Address | false {
	const address: Address = {
		id: generateId ? AddressesFileHanlder.generateId() : parseInt(req.params.id, 10),
		type: req.body.type,
		name: req.body.name,
		isStatic: req.body.isStatic ? true : false,
		address: req.body.address,
		subnet: req.body.subnet,
		gateway: req.body.gateway,
		description: req.body.description
	};

	return address;
}

/**
 * Checks if the passed Address is correct.
 * If so, it will be returned. Otherwise, a false result will be returned
 * @param toValidate The Address that has to be validated
 */
function addressValidator(toValidate: Address): Address | false {
	// By defualt, it's an empty Address
	const validAddress: Address = {
		type: "ipv4",
		name: "",
		isStatic: true,
		address: "",
		subnet: "",
		gateway: "",
		description: ""
	};

	if (toValidate.type !== "ipv4" && toValidate.type !== "ipv6") {
		return false;
	}

	if (isIp(toValidate.address) && isIp(toValidate.subnet) && isIp(toValidate.gateway)) {
		validAddress.address = toValidate.address;
		validAddress.gateway = toValidate.gateway;
		validAddress.subnet = toValidate.subnet;
	} else {
		return false;
	}

	// Check if it contains only whitespaces
	if (/^\s*$/.test(toValidate.name)) {
		return false;
	} else {
		validAddress.name = toValidate.name;
	}

	// Check if it contains only whitespaces
	if (/^\s*$/.test(toValidate.description)) {
		return false;
	} else {
		validAddress.description = toValidate.description;
	}

	validAddress.id = toValidate.id;
	return validAddress;
}

export { router };
