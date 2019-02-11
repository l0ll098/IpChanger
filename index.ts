import express = require("express");
import path = require("path");
import * as fs from "fs";
import http = require("http");
import bodyParser = require("body-parser");
import { app as electronApp, BrowserWindow } from "electron";

import * as routes from "./server/routes/routes";
import { HttpStatus } from "./server/types/HttpStatus";
import { ConsoleColors } from "./server/types/Utils";
import { sendErr } from "./server/functions/functions";
import { FilesHandler } from "./server/handlers/FilesHandler";

const APP_TITLE = "Ip Changer";

const app = express();

// Startup server
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

// BodyParser e CookieParser Setup

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// It makes sure that file to keep data is present
FilesHandler.ensureCreated();

// File router
// By default, static files are served from the <root>/client/dist folder
const clientDistPath = __dirname.endsWith("dist") ? "../client/dist" : "client/dist";

// Dev env
if (fs.existsSync(clientDistPath)) {
	app.use(express.static(path.join(__dirname, clientDistPath)));
} else {
	if (fs.existsSync(path.join(__dirname, "client"))) {
		app.use(express.static(path.join(__dirname, "client")));
	} else {
		console.log("Client dist folder has not been found, did you forget it?");
	}
}

// Set routes router
app.use("/", routes.router);

// Catch all other routes and return the index file
// This catch all route, denoted with *, MUST come last after all other API routes have been defined
app.use("*", (req, res) => {
	if (fs.existsSync(clientDistPath)) {
		res.sendFile(path.join(__dirname, clientDistPath, "index.html"));
	} else {
		if (fs.existsSync(path.join(__dirname, "client"))) {
			res.sendFile(path.join(__dirname, "client", "index.html"));
		} else {
			sendErr(res, HttpStatus.NotFound, { error: "Page not found" }, "Page not found");
		}
	}
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error("Not Found");
	err["status"] = 404;
	next(err);
});

// ERROR HANDLERS

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
	app.use((err: any, req, res, next) => {
		res.status(err["status"] || 500);
		res.json({
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use((err: any, req, res, next) => {
	res.status(err.status || 500);
	res.json({
		message: err.message,
		error: {}
	});
});

function normalizePort(val) {
	const _port = parseInt(val, 10);

	if (isNaN(_port)) {
		// named pipe
		return val;
	}

	if (_port >= 0) {
		// port number
		return _port;
	}

	return false;
}

function onError(error) {
	if (error.syscall !== "listen") {
		throw error;
	}

	const bind = typeof port === "string"
		? "Pipe " + port
		: "Port " + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case "EACCES":
			console.error(bind + " requires elevated privileges");
			process.exit(1);
			break;
		case "EADDRINUSE":
			console.error(bind + " is already in use");
			process.exit(1);
			break;
		default:
			throw error;
	}
}

function onListening() {
	const addr = server.address();
	const bind = typeof addr === "string"
		? "pipe " + addr
		: "port " + addr.port;
	console.log(ConsoleColors.BgMagenta + "%s" + ConsoleColors.Reset, " Listening on " + bind + " ");
}


// Electron setup
let win: BrowserWindow;

/**
 * This function creates the window
 */
function createWindow() {
	win = new BrowserWindow({
		width: 1366,
		height: 768,
		// icon: ,
		title: APP_TITLE
	});

	win.loadURL("http://localhost:" + (process.env.PORT || "3000") + "/");

	win.on("closed", () => {
		win = null;
	});
}

electronApp.on("ready", createWindow);
electronApp.on("window-all-closed", () => {
	// macOs specific close process
	if (process.platform !== "darwin") {
		electronApp.quit();
	}
});
electronApp.on("activate", () => {
	if (win === null) {
		createWindow();
	}
});
