import * as path from "path";
import * as fs from "fs";
import { Address, AddressesFile } from "../types/Data";

export const ADDRESSES_FILE_NAME = "addresses.json";

export abstract class AddressesFileHanlder {

	private static _dataFolder: string;
	private static _filePath: string;

	private static _lastId: number;


	private static writeFile(content: string) {
		return new Promise((resolve, reject) => {
			fs.writeFile(AddressesFileHanlder._filePath, content, (err) => {
				if (err) {
					return reject(err);
				} else {
					return resolve(null);
				}
			});
		});
	}

	/**
	 * This method will return the path where the files should be stored.
	 */
	public static getConfigsFilePath(): string {
		return path.join(__dirname, "../../Data/");
	}

	public static ensureAddressesFileIsPresent() {
		AddressesFileHanlder._dataFolder = AddressesFileHanlder.getConfigsFilePath();
		AddressesFileHanlder._filePath = path.join(AddressesFileHanlder._dataFolder, ADDRESSES_FILE_NAME);

		// Check if file is not present
		if (!fs.existsSync(AddressesFileHanlder._filePath)) {
			// Check if the folder that will contain the file is present
			if (!fs.existsSync(AddressesFileHanlder._dataFolder)) {
				// If not, create it
				fs.mkdirSync(AddressesFileHanlder._dataFolder);
			}

			// Create the file
			fs.writeFileSync(AddressesFileHanlder._filePath, JSON.stringify({ addresses: [] }, null, 2));

			// The lastId is -1, since data file is empty
			AddressesFileHanlder._lastId = -1;
		} else {
			const file = AddressesFileHanlder.getAllAddresses();
			const lastAddress = file.addresses[file.addresses.length - 1];
			AddressesFileHanlder._lastId = lastAddress ? lastAddress.id : -1;
		}
	}

	/**
	 * Reads the addresses file
	 */
	public static getAllAddresses(): AddressesFile {
		return JSON.parse(fs.readFileSync(AddressesFileHanlder._filePath, { encoding: "utf8" }));
	}

	public static getAddressById(id: number): Address | null {
		const addresses = AddressesFileHanlder.getAllAddresses();
		return addresses.addresses.find((addr) => addr.id === id) || null;
	}

	public static async addAddress(address: Address) {
		try {
			const file = AddressesFileHanlder.getAllAddresses();
			file.addresses.push(address);
			await AddressesFileHanlder.writeFile(JSON.stringify(file, null, 2));
		} catch (err) {
			return Promise.reject(err);
		}

		return Promise.resolve(true);
	}

	public static async deleteAddress(id: number) {
		try {
			const file = AddressesFileHanlder.getAllAddresses();
			const index = file.addresses.findIndex((addr) => addr.id === id);

			if (index === -1) {
				return Promise.reject(true);
			}

			file.addresses.splice(index, 1);
			await AddressesFileHanlder.writeFile(JSON.stringify(file, null, 2));
		} catch (err) {
			return Promise.reject(err);
		}
	}

	public static generateId(): number {
		return ++AddressesFileHanlder._lastId;
	}
}
