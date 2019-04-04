# IP Changer

A simple GUI tool to change IP address on Windows.

# Overview
This tool is composed by two parts. <br>
The first one is an Express server used to expose some REST APIs to save, get, update and  delete addresses saved on the local PC. It handles also the logic to change IP address.<br>
The second part is an Angular app that provides an handy interface to the APIs.

## How data are stored
A new folder called <code>Data</code> will be created in the <code>homedir</code> folder if the application is running in Electron and that directory doesn't already exist.
If running from source files, it will save data in the project root folder.

The <code>Data</code> folder contains two files. The first one is called <code>ids.json</code> and it's used to keep track of the last address id. The other file, called <code>addresses.json</code>, is used to save addresses created by the user.

## Why this approach?
Mainly because this program has not to handle too many requests and it will run only locally (so there is not really any need to have a proper database).

# APIs

| API                                | Method | Path                  | Parameters | Description                                                      |
|------------------------------------|--------|-----------------------|------------|------------------------------------------------------------------|
| Change IP                          | GET    | /api/run/:id          | id         | Changes IP based on the passed id. id must be a valid number     |
| List addresses                     | GET    | /api/addresses        |            | Returns a list of previously saved IP addresses                  |
| Get a single address               | GET    | /api/addresses/:id    | id         | Returns details of a previously saved IP address, known it's id  |
| Insert a new address               | POST   | /api/addresses        |            | Adds a new IP address. It has to be a valid <code>Address</code> |
| Delete an address                  | DELETE | /api/addresses/:id    | id         | Deletes a saved IP address based on it's id                      |
| Put a new address                  | PUT    | /api/addresses/:id    | id         | Saves a new address knowing it's id                              |
| Get a list of network interfaces   | GET    | /api/interfaces       |            | Returns a list of the available network interfaces               |
| Get details of a network interface | GET    | /api/interfaces/:name | name       | Returns details of a specific network interface                  |

# Development
In order to compile both the server and client side (without packaging them), run the following command: 

```
$ npm run gulp BuildAndCopyFiles
```

To build and package the application, run:

```
$ npm run gulp
```

## Windows 10 app
In order to package it as a Windows 10 app, you will have to run those commands
```
npm install -g electron-windows-store

electron-windows-store --input-directory ./dist/bin/ipchanger-win32-x64 --output-directory ./dist/bin/msStore --package-version 1.0.0.0 --package-name IpChanger --package-display-name IpChanger --package-description "A GUI based tool to change IP addresses on Windows" --assets "./client/src/assets" --publisher-display-name "Ip Changer" --manifest ./AppXManifest.xml
```

**Note**: the second command, must be executed in an high privileges command prompt (run as Administrator)
