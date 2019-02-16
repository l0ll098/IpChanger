import { Address, AddressesFile } from "../types/Data";
import { FilesHandler } from "./FilesHandler";
import { IdsHanlder } from "./IdsHandler";


export abstract class AddressesFileHanlder {

	private static writeFile(content: string) {
		return FilesHandler.writeFile(FilesHandler._addressesFilePath, content);
	}

	private static readFile(): AddressesFile {
		return FilesHandler.readFile(FilesHandler._addressesFilePath) as AddressesFile;
	}

	/**
	 * Reads the addresses file
	 */
	public static getAllAddresses(): AddressesFile {
		const file = FilesHandler.readFile(FilesHandler._addressesFilePath) as AddressesFile;
		delete file.$comment;
		return file;
	}

	public static getAddressById(id: number): Address | null {
		const addresses = AddressesFileHanlder.getAllAddresses();
		return addresses.addresses.find((addr) => addr.id === id) || null;
	}

	public static async addAddress(address: Address) {
		try {
			const file = AddressesFileHanlder.readFile();
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

	public static async updateAddress(id: number, newAddress: Address) {
		try {
			const file = AddressesFileHanlder.getAllAddresses();
			const index = file.addresses.findIndex((addr) => addr.id === id);

			if (index === -1) {
				return Promise.reject(true);
			}

			// Remove the old one
			file.addresses.splice(index, 1);
			// Add the new one
			file.addresses.push(newAddress);

			await AddressesFileHanlder.writeFile(JSON.stringify(file, null, 2));
		} catch (err) {
			return Promise.reject(err);
		}
	}

	public static generateId(): number {
		return IdsHanlder.generateId();
	}
}
