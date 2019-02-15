import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Address } from "../models/Address";

@Injectable()
export class HttpService {
	private api = "http://" + location.host + "/api/";

	constructor(private http: HttpClient) { }

	postAddress(addresses: Address) {
		return this.http.post(this.api + "addresses", addresses).toPromise();
	}

	async getAddresses(): Promise<Address[]> {
		try {
			const res = await this.http.get(this.api + "addresses").toPromise() as any;
			if (res.success) {
				return Promise.resolve(res.data.addresses);
			} else {
				return Promise.reject(res);
			}
		} catch (err) {
			return Promise.reject(err);
		}
	}
}
