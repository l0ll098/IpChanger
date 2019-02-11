import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatToolbarModule, MatIconModule, MatButtonModule } from "@angular/material";
import { PlatformModule } from "@angular/cdk/platform";

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
		// Angular Material
		PlatformModule,
		MatToolbarModule,
		MatIconModule,
		MatButtonModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
