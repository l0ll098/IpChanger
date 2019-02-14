import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { PlatformModule } from "@angular/cdk/platform";
import {
	MatToolbarModule,
	MatButtonModule,
	MatIconModule,
	MatListModule,
	MatSidenavModule,
	MatCheckboxModule,
	MatSlideToggleModule,
	MatFormFieldModule,
	MatAutocompleteModule,
	MatInputModule,
	MatSelectModule,
	MatTableModule,
	MatPaginatorModule,
	MatSortModule,
	MatSnackBarModule,
	MatDialogModule,
	MatRadioModule
} from "@angular/material";

import { environment } from "../environments/environment";

import { AppComponent } from "./app.component";
import { AppShellComponent } from "./components/shell/app-shell.component";
import { AppAddressFormFieldComponent } from "./components/address-form-field/address-form-field.component";
import { AppNewAddressComponent } from "./components/new-address/new-address.component";

import { HttpService } from "./services/http.service";

const appRoutes: Routes = [
	{
		path: "",
		component: AppShellComponent,
		children: [
			{
				path: "new",
				component: AppNewAddressComponent
			}
		]
	}
];


@NgModule({
	declarations: [
		AppComponent,
		AppShellComponent,
		AppAddressFormFieldComponent,
		AppNewAddressComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		RouterModule,
		RouterModule.forRoot(
			appRoutes,
			{ enableTracing: (environment.enableAngularRoutingLog ? true : false) }
		),
		PlatformModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		// Angular Material
		MatToolbarModule,
		MatButtonModule,
		MatIconModule,
		MatListModule,
		MatSidenavModule,
		MatCheckboxModule,
		MatSlideToggleModule,
		MatFormFieldModule,
		MatAutocompleteModule,
		MatInputModule,
		MatSelectModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		MatSnackBarModule,
		MatDialogModule,
		MatRadioModule
	],
	providers: [
		HttpService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
