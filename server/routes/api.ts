import express = require("express");
import { networkInterfaces } from "os";

import { AddressesFileHanlder } from "../handlers/AddressesFileHandler";
import { CommandHandler } from "../handlers/CommandHandler";

import { sendOK, sendErr, parseAddress, addressValidator, getValidNetworkInterfaceNames } from "../functions/functions";
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

router.get("/interfaces", async (req, res) => {
	try {
		return sendOK(res, getValidNetworkInterfaceNames());
	} catch (err) {
		return sendErr(res, HttpStatus.InternalServerError, err);
	}
});

router.get("/interfaces/:name", async (req, res) => {
	try {
		const interfaces = networkInterfaces();
		const names = Object.keys(interfaces);

		if (names.indexOf(req.params.name) > -1) {
			return sendOK(res, interfaces[req.params.name]);
		} else {
			return sendErr(res, HttpStatus.BadRequest, { invalidInterface: true });
		}
	} catch (err) {
		return sendErr(res, HttpStatus.InternalServerError, err);
	}
});


export { router };
