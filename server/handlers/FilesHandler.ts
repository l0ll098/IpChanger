import * as path from "path";
import * as fs from "fs";
import { app as electronApp } from "electron";
import { IdsHanlder } from "./IdsHandler";
import { AddressesFile, IdsFile } from "../types/Data";

export const ADDRESSES_FILE_NAME = "addresses.json";
export const IDS_FILE_NAME = "ids.json";

export const ADDRESSES_FILE_INITIALIZER: AddressesFile = {
	$comment: "DO NOT EDIT THIS FILE MANUALLY!",
	addresses: []
};
export const IDS_FILE_INITIALIZER: IdsFile = {
	$comment: "DO NOT EDIT THIS FILE MANUALLY!",
	lastId: -1
};

export abstract class FilesHandler {

	public static _dataFolder: string;
	public static _addressesFilePath: string;
	public static _idsFilePath: string;

	public static writeFile(filePath: string, content: string) {
		return new Promise((resolve, reject) => {
			fs.writeFile(filePath, content, (err) => {
				if (err) {
					return reject(err);
				} else {
					return resolve(null);
				}
			});
		});
	}

	/**
	 * Reads the file
	 */
	public static readFile(filePath: string): object {
		return JSON.parse(fs.readFileSync(filePath, { encoding: "utf8" }));
	}


	/**
	 * This method will return the path where the files should be stored.
	 */
	public static getConfigsFilePath(): string {
		if (!electronApp) {
			return path.join(__dirname, "../../Data/");
		} else {
			const execPath = process.execPath;
			const pieces = execPath.split("\\");
			pieces.pop();

			return path.join(pieces.join("\\"), "Data");
		}
	}

	public static ensureCreated() {
		FilesHandler._dataFolder = FilesHandler.getConfigsFilePath();
		FilesHandler._addressesFilePath = path.join(FilesHandler._dataFolder, ADDRESSES_FILE_NAME);
		FilesHandler._idsFilePath = path.join(FilesHandler._dataFolder, IDS_FILE_NAME);

		// Check if file is not present
		if (!fs.existsSync(FilesHandler._addressesFilePath)) {
			// Check if the folder that will contain the file is present
			if (!fs.existsSync(FilesHandler._dataFolder)) {
				// If not, create it
				fs.mkdirSync(FilesHandler._dataFolder);
			}

			// Create the file
			fs.writeFileSync(FilesHandler._addressesFilePath, JSON.stringify(ADDRESSES_FILE_INITIALIZER, null, 2));
			fs.writeFileSync(FilesHandler._idsFilePath, JSON.stringify(IDS_FILE_INITIALIZER, null, 2));
		}

		IdsHanlder.readLastId();
	}

}
