import {
	Component,
	HostBinding,
	Input,
	ElementRef,
	OnDestroy,
	ViewChild,
	Self,
	Optional,
	forwardRef
} from "@angular/core";
import {
	FormGroup,
	FormControl,
	Validators,
	AbstractControl,
	ControlValueAccessor,
	DefaultValueAccessor,
	NgControl,
	NG_VALUE_ACCESSOR
} from "@angular/forms";
import { Subject } from "rxjs";

import { MatFormFieldControl } from "@angular/material";
import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { FocusMonitor } from "@angular/cdk/a11y";

import { Ip } from "../../models/Ip";



@Component({
	selector: "app-address-form-field",
	templateUrl: "address-form-field.component.html",
	styleUrls: ["address-form-field.component.css"],
	providers: [
		{
			provide: MatFormFieldControl,
			useExisting: AppAddressFormFieldComponent
		}
	]
})
export class AppAddressFormFieldComponent
	implements MatFormFieldControl<Ip>, ControlValueAccessor, OnDestroy {


	static nextId = 0;

	autofilled = false;
	parts: FormGroup;
	stateChanges = new Subject<void>();
	focused = false;
	errorState: any = false;
	controlType = "app-address-form-field";

	private _ip: Ip;


	@HostBinding() id = `app-address-form-field-${AppAddressFormFieldComponent.nextId++}`;
	@HostBinding("attr.aria-describedby") describedBy = "";

	@Input() type: "ipv4" | "ipv6" = "ipv4";


	get empty() {
		const { value: { minutes, seconds, millisecs } } = this.parts;

		if (minutes !== null || seconds !== null || millisecs !== null) {
			return false;
		} else {
			return true;
		}
	}

	@HostBinding("class.floating")
	get shouldLabelFloat() {
		return this.focused || !this.empty;
	}

	@Input()
	get placeholder(): string { return this._placeholder; }
	set placeholder(value: string) {
		this._placeholder = value;
		this.stateChanges.next();
	}
	private _placeholder: string;

	@Input()
	get required(): boolean { return this._required; }
	set required(value: boolean) {
		this._required = coerceBooleanProperty(value);
		this.stateChanges.next();
	}
	private _required = false;

	@Input()
	get disabled(): boolean { return this._disabled; }
	set disabled(value: boolean) {
		this._disabled = coerceBooleanProperty(value);
		this.stateChanges.next();
	}
	private _disabled = false;


	@Input()
	get value(): Ip | null {
		return this._ip;
	}
	set value(ip: Ip | null) {
		this._ip = ip;
		this.propagateChange(this._ip);
	}


	public FormControls = {
		block1: new FormControl(null, [Validators.required]),
		block2: new FormControl(null, [Validators.required]),
		block3: new FormControl(null, [Validators.required]),
		block4: new FormControl(null, [Validators.required]),
		block5: new FormControl(null),
		block6: new FormControl(null),
		block7: new FormControl(null),
		block8: new FormControl(null)
	};

	constructor(
		private fm: FocusMonitor,
		private elRef: ElementRef<HTMLElement>,
		@Optional() @Self() public ngControl: NgControl) {

		if (this.ngControl != null) {
			this.ngControl.valueAccessor = this;
		}

		this.parts = new FormGroup({
			block1: this.FormControls.block1,
			block2: this.FormControls.block2,
			block3: this.FormControls.block3,
			block4: this.FormControls.block4,
			block5: this.FormControls.block5,
			block6: this.FormControls.block6,
			block7: this.FormControls.block7,
			block8: this.FormControls.block8
		}, {
				// Required in order to validate the form as a unique indivisible thing
				// validators: validator("minutes", "seconds", "millisecs")
			}
		);

		fm.monitor(elRef.nativeElement, true).subscribe((origin) => {
			this.focused = !!origin;
			this.stateChanges.next();
		});
	}


	ngOnDestroy() {
		this.stateChanges.complete();
		this.fm.stopMonitoring(this.elRef.nativeElement);
	}

	setDescribedByIds(ids: string[]) {
		this.describedBy = ids.join(" ");
	}

	onContainerClick(event: MouseEvent) {
		if ((event.target as Element).tagName.toLowerCase() !== "input") {
			if (this.elRef.nativeElement) {
				this.elRef.nativeElement.querySelector("input").focus();
			}
		}
	}

	onInput(event) {
		// Check if there is an error
		if (this.parts.errors) {
			// If so, update the errorState. This will highlight the form input of red
			this.errorState = this.parts.errors;
			// Propagate the error. Required in order to show custom error messages
			this.ngControl.control.setErrors(this.errorState);
		} else {
			// If there isn't an error, update the errorState to false so that it will pass in the
			// normal state
			this.errorState = false;
			this.ngControl.control.setErrors(null);

			// Update the stored value
			this.value = {
				block1: this.FormControls.block1.value,
				block2: this.FormControls.block2.value,
				block3: this.FormControls.block3.value,
				block4: this.FormControls.block4.value,
				block5: this.FormControls.block5.value || "",
				block6: this.FormControls.block6.value || "",
				block7: this.FormControls.block7.value || "",
				block8: this.FormControls.block8.value || ""
			};
		}
	}

	propagateChange = (_: any) => { };

	writeValue(ip: Ip): void {
		this._ip = ip;
	}
	registerOnChange(fn: any): void {
		this.propagateChange = fn;
	}
	registerOnTouched(fn: any): void { }

	setDisabledState?(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}
}
