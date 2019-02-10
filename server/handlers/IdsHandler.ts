import { FilesHandler } from "./FilesHandler";
import { IdsFile } from "../types/Data";

export abstract class IdsHanlder {
	private static lastId: number;

	public static readLastId() {
		const file: IdsFile = FilesHandler.readFile(FilesHandler._idsFilePath) as IdsFile;

		if (file && typeof file.lastId === "number") {
			IdsHanlder.lastId = file.lastId;
		} else {
			IdsHanlder.lastId = -1;
		}
	}

	public static writeLastId() {
		const file: IdsFile = {
			lastId: IdsHanlder.lastId
		};

		return FilesHandler.writeFile(FilesHandler._idsFilePath, JSON.stringify(file, null, 2));
	}

	public static generateId(): number {
		const id = ++IdsHanlder.lastId;
		IdsHanlder.writeLastId();
		return id;
	}
}
