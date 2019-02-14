import { Component } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { Ip } from '../../models/Ip';

@Component({
	selector: "app-new-address",
	templateUrl: "new-address.component.html",
	styleUrls: ["new-address.component.css"]
})
export class AppNewAddressComponent {

	public FormControls = {
		type: new FormControl(),
		name: new FormControl(null, [Validators.required, Validators.maxLength(10)]),
		isStatic: new FormControl(),
		address: new FormControl(null, [Validators.required]),
		subnet: new FormControl(),
		gateway: new FormControl()
	};

	public newAddressFG = new FormGroup({
		type: this.FormControls.type,
		name: this.FormControls.name,
		isStatic: this.FormControls.isStatic,
		address: this.FormControls.address,
		subnet: this.FormControls.subnet,
		gateway: this.FormControls.gateway
	});

	constructor() {
		// Set default values
		this.FormControls.type.setValue("ipv4");
		this.FormControls.isStatic.setValue("true");

		this.FormControls.address.setValue({ block1: "", block2: "", block3: "", block4: "" } as Ip);
	}

	save() {
		console.log(this.FormControls.type.value);
		console.log(this.FormControls.isStatic.value);
		console.log(this.FormControls.address.value);
	}
}
