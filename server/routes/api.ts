import express = require("express");
import * as isIp from "is-ip";

import { AddressesFileHanlder } from "../handlers/AddressesFileHandler";
import { sendOK, sendErr } from "../functions/functions";
import { Address } from "../types/Data";
import { HttpStatus } from "../types/HttpStatus";


const router = express.Router();



router.get("/addresses", (req, res) => {
	sendOK(res, AddressesFileHanlder.getAllAddresses());
});

router.get("/addresses/:id", (req, res) => {
	// id is in base 10
	sendOK(res, AddressesFileHanlder.getAddressById(parseInt(req.params.id, 10)));
});

router.post("/addresses", async (req, res) => {
	const address: Address = {
		id: AddressesFileHanlder.generateId(),
		type: req.body.type,
		name: req.body.name,
		isStatic: req.body.isStatic ? true : false,
		address: req.body.address,
		subnet: req.body.subnet,
		gateway: req.body.gateway
	};
	const validAddress = addressValidator(address);

	if (addressValidator(address)) {
		try {
			await AddressesFileHanlder.addAddress(validAddress as Address);

			return sendOK(res, { address: validAddress }, HttpStatus.Created);
		} catch (err) {
			return sendErr(res, HttpStatus.InternalServerError, err);
		}
	} else {
		return sendErr(res, HttpStatus.BadRequest, { malformedAddress: true });
	}

});



function addressValidator(toValidate: Address): Address | false {
	// By defualt, it's an empty Address
	const validAddress: Address = {
		type: "ipv4",
		name: "",
		isStatic: true,
		address: "",
		subnet: "",
		gateway: ""
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
	if (/\s/g.test(toValidate.name)) {
		return false;
	} else {
		validAddress.name = toValidate.name;
	}

	validAddress.id = toValidate.id;
	return validAddress;
}

export { router };
