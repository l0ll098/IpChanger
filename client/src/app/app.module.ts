import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ServiceWorkerModule } from "@angular/service-worker";

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
import { AppAddressesListComponent } from "./components/addresses-list/addresses-list.component";
import { AppNewAddressComponent } from "./components/new-address/new-address.component";
import { DialogComponent } from "./components/dialog/dialog.component";

import { HttpService } from "./services/http.service";

const appRoutes: Routes = [
	{
		path: "",
		component: AppShellComponent,
		children: [
			{
				path: "",
				component: AppAddressesListComponent
			},
			{
				path: "new",
				component: AppNewAddressComponent
			}
		]
	}
];


@NgModule({
	declarations: [
		DialogComponent,
		AppComponent,
		AppShellComponent,
		AppAddressFormFieldComponent,
		AppNewAddressComponent,
		AppAddressesListComponent
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
		MatRadioModule,
		ServiceWorkerModule.register("ngsw-worker.js", { enabled: environment.production })
	],
	providers: [
		HttpService
	],
	bootstrap: [
		AppComponent
	],
	entryComponents: [
		DialogComponent
	]
})
export class AppModule { }
