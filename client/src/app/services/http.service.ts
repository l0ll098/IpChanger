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
}
