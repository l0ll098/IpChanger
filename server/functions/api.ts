import express = require("express");
import * as os from "os";
import * as isIp from "is-ip";

import { AddressesFileHanlder } from "../handlers/AddressesFileHandler";
import { Address } from "../types/Data";


export function getValidNetworkInterfaceNames(): string[] {
	const allInterfaces = os.networkInterfaces();
	const names = Object.keys(allInterfaces);
	const validNames = [];

	names.forEach((intName) => {
		const interfaces = allInterfaces[intName];

		interfaces.forEach((int) => {
			if (!int.internal && validNames.indexOf(intName) === -1) {
				validNames.push(intName);
			}
		});
	});

	return validNames;
}

/**
 * Reads and returns an Address from the request body
 * @param req The HTTP request
 * @param generateId Set this to true if you are inserting a new Address. Use false, if you are parsing the Address to perform an update
 */
export function parseAddress(req: express.Request, generateId: boolean = true): Address | false {
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
export function addressValidator(toValidate: Address): Address | false {
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

	if (isIp(toValidate.address) && isIp(toValidate.subnet)) {

		// If gateway is provided and it's not a valid ip, return false. Otherwise proceed
		if (toValidate.gateway && !isIp(toValidate.gateway)) {
			return false;
		}

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
