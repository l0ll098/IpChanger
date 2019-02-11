import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatToolbarModule } from "@angular/material";

import { environment } from "../environments/environment";

import { AppComponent } from "./app.component";
import { AppShellComponent } from "./shell/app-shell.component";


const appRoutes: Routes = [
	{
		path: "",
		component: AppShellComponent,
		children: [

		]
	}
];


@NgModule({
	declarations: [
		AppComponent,
		AppShellComponent
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
		MatToolbarModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
