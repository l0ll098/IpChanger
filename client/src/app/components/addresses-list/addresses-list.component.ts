import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";

import { HttpService } from "../../services/http.service";
import { Address } from "../../models/Address";
import { DialogComponent } from "../dialog/dialog.component";



@Component({
	selector: "app-addresses-list",
	styleUrls: ["addresses-list.component.css"],
	templateUrl: "addresses-list.component.html"
})
export class AppAddressesListComponent implements OnInit {

	public addresses: Address[] = [];

	constructor(
		private httpService: HttpService,
		private dialog: MatDialog) { }

	ngOnInit(): void {
		this.getAddresses()
			.then((addr) => {
				this.addresses = addr;
			})
			.catch((err) => {
				console.log(err);

				this.dialog.open(DialogComponent, {
					data: {
						title: "Error",
						message: "Something went retrieving saved data. Please retry later.",
						doActionBtn: {
							text: "Ok"
						}
					}
				});
			});
	}

	public async getAddresses() {
		try {
			return Promise.resolve(await this.httpService.getAddresses());
		} catch (err) {
			return Promise.reject(err);
		}
	}
}
