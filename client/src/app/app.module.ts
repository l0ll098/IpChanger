import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { PlatformModule } from "@angular/cdk/platform";
import {
	MatToolbarModule,
	MatIconModule,
	MatButtonModule,
	MatInputModule,
	MatRadioModule,
	MatFormFieldModule
} from "@angular/material";

import { environment } from "../environments/environment";

import { AppComponent } from "./app.component";
import { AppShellComponent } from "./shell/app-shell.component";
import { AppNewAddressComponent } from "./new-address/new-address.component";


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
		HttpClientModule,
		ReactiveFormsModule,
		FormsModule,
		// Angular Material
		PlatformModule,
		MatToolbarModule,
		MatIconModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatRadioModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
