import { Component } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { Ip } from "../../models/Ip";
import { HttpService } from "../../services/http.service";

@Component({
	selector: "app-new-address",
	templateUrl: "new-address.component.html",
	styleUrls: ["new-address.component.css"]
})
export class AppNewAddressComponent {

	public FormControls = {
		type: new FormControl(),
		name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
		isStatic: new FormControl(),
		address: new FormControl(null, [Validators.required]),
		subnet: new FormControl(null, [Validators.required]),
		gateway: new FormControl(null, [Validators.required])
	};

	public newAddressFG = new FormGroup({
		type: this.FormControls.type,
		name: this.FormControls.name,
		isStatic: this.FormControls.isStatic,
		address: this.FormControls.address,
		subnet: this.FormControls.subnet,
		gateway: this.FormControls.gateway
	});

	constructor(private httpService: HttpService) {
		// Set default values
		this.FormControls.type.setValue("ipv4");
		this.FormControls.isStatic.setValue("true");

		this.FormControls.address.setValue({ block1: "", block2: "", block3: "", block4: "" } as Ip);
		this.FormControls.subnet.setValue({ block1: "", block2: "", block3: "", block4: "" } as Ip);
		this.FormControls.gateway.setValue({ block1: "", block2: "", block3: "", block4: "" } as Ip);
	}

	async save() {
		const type = this.FormControls.type.value;

		try {
			const res = await this.httpService.postAddress({
				isStatic: this.FormControls.isStatic.value,
				name: this.FormControls.name.value,
				type: type,
				address: this.ipToString(type, this.FormControls.address.value),
				subnet: this.ipToString(type, this.FormControls.subnet.value),
				gateway: this.ipToString(type, this.FormControls.gateway.value),
			});

			console.log(res);
		} catch (err) {
			console.log(err);
		}

	}

	private ipToString(type: "ipv4" | "ipv6", ip: Ip): string {
		if (type === "ipv4") {
			return ip.block1 + "." + ip.block2 + "." + ip.block3 + "." + ip.block4;
		} else {
			// tslint:disable-next-line:max-line-length
			return ip.block1 + ":" + ip.block2 + ":" + ip.block3 + ":" + ip.block4 + ":" + ip.block5 + ":" + ip.block6 + ":" + ip.block7 + ":" + ip.block8;
		}
	}
}
