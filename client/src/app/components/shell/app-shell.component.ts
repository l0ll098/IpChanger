import { Component, ChangeDetectionStrategy, ElementRef, AfterViewInit } from "@angular/core";
import { LocationStrategy } from "@angular/common";
import { Router, NavigationStart } from "@angular/router";
import { Platform } from "@angular/cdk/platform";


enum toolbarTypes {
	sidenav,
	back
}

@Component({
	selector: "app-shell",
	templateUrl: "app-shell.component.html",
	styleUrls: ["app-shell.component.css"]
})
export class AppShellComponent implements AfterViewInit {

	// Cheat: Doing so the html part can see the enum
	public toolbarTypes = toolbarTypes;
	public toolbarToShow: toolbarTypes = toolbarTypes.sidenav;

	public DEFAULT_TOOLBAR_TILE = "IP Changer";
	public toolbarTitle = this.DEFAULT_TOOLBAR_TILE;

	public deviceType: "desktop" | "mobile";
	public showNewFAB = true;

	private pathVisited: string[] = ["/"];


	constructor(
		private router: Router,
		private location: LocationStrategy,
		private elementRef: ElementRef,
		private platform: Platform) { }

	ngAfterViewInit(): void {
		/*
			Check if it"s a mobile device.
			This is used to show the toolbar with the back icon on mobile and
			the toolbar with the sidenav icon on desktop
		*/
		if (this.platform.ANDROID || this.platform.IOS) {
			this.deviceType = "mobile";
		} else {
			this.deviceType = "desktop";
		}

		// Subscribe to path changes
		this.router.events.subscribe((event) => {
			if (event instanceof NavigationStart) {
				// When user changes path, add it to the array
				if (this.pathVisited.includes(event.url.split("/")[0])) {
					this.pathVisited.push(event.url);
				} else {
					this.pathVisited = ["/"];
					this.showNewFAB = true;
				}
			}
		});


		// Intercept the "back arrow". Both in mobile and desktop
		this.location.onPopState((e) => {
			if (this.location.path() === "/") {
				this.returnToHomePath();
			} else {
				this.goToPath(this.location.path());
			}
		});

		this.showNewFAB = true;
	}


	public goBack() {
		// Get the previously visited path and remove it from the array
		const prevPath = this.pathVisited[this.pathVisited.length - 1];
		this.pathVisited.splice(this.pathVisited.length - 1, 1);
		// Then navigate to that path
		this.goToPath(prevPath);

		this.showNewFAB = true;
	}

	public returnToHomePath() {
		this.goToPath("/");

		this.showNewFAB = true;
	}

	public goToNew() {
		this.goToPath("/new");
		this.showNewFAB = false;
	}

	/**
	 * This method will redirect user to the selected path
	 * @param path Path where user has to be redirected
	 */
	goToPath(path) {
		if (path) {
			// Check if the path is the main one
			if (path === "/") {
				// If so change the toolbar and reset the array of the path visited
				this.toolbarToShow = toolbarTypes.sidenav;
				this.pathVisited = [];

				// If user returns to the main path, show the app name
				this.toolbarTitle = this.DEFAULT_TOOLBAR_TILE;

				this.showNewFAB = true;
			} else {
				this.toolbarToShow = toolbarTypes.back;

				// const btn = this.sidenavButtons.find(_btn => _btn.path === path);

				/*if (btn) {
					// When user changes path, show the text alongside the back arrow
					this.toolbarTitle = btn.text;
				}*/
			}
			this.router.navigate([path]);
		}
	}
}
