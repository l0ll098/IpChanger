import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { MatDialog, MatSlideToggleChange } from "@angular/material";

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
	public addressFG: FormGroup = new FormGroup({});

	constructor(
		private httpService: HttpService,
		private dialog: MatDialog) { }

	ngOnInit(): void {
		let id = 0;

		this.getAddresses()
			.then((addr) => {
				this.addresses = addr;


				// Initialize the FormGroup
				this.addresses.forEach(() => {
					this.addressFG.addControl("fc" + (id++), new FormControl(false));
				});
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

	public onchange(event: MatSlideToggleChange, id: number) {
		let alreadyChecked = false;
		for (let i = 0; i < this.addresses.length; i++) {
			// If the id is equal to the index, the corresponding form control has been already changed
			if (i === id) {
				if (!this.addressFG.controls["fc" + i].value) {
					alreadyChecked = true;
					break;
				}
			} else {
				if (this.addressFG.controls["fc" + i].value) {
					alreadyChecked = true;
					break;
				}
			}
		}

		// If there aren't other slide toggles have been already toggled, proceed changing ip
		if (!alreadyChecked) {

			if (event.checked) {
				console.log("call run change ip on val: ", this.addresses[id]);

				this.httpService.changeIp(this.addresses[id])
					.then(() => {
						console.log("changed");
					})
					.catch((err) => {
						console.log(err);
					});
			}

		} else {
			// Otherwise set it back to it's previous value
			if (this.addressFG.controls["fc" + id].value) {
				this.addressFG.controls["fc" + id].setValue(!this.addressFG.controls["fc" + id].value);

				this.dialog.open(DialogComponent, {
					data: {
						title: "Error",
						message: "Only one can be checked. Deselect the other and retry.",
						doActionBtn: {
							text: "Ok"
						}
					}
				});
			}
		}
	}
}
