# IP Changer

A simple GUI tool to change IP address on Windows.

# Overview
This tool is composed by two parts. <br>
The first one is an Express server used to expose some REST APIs to save, get, update and  delete addresses saved on the local PC. It handles also the logic to change IP address.<br>
The second part is an Angular app that provides an handy interface to the APIs.


# Development
In order to compile both the server and client side (without packaging them), run the following command: 

`$ npm run gulp BuildAndCopyFiles`

To build and package the application, run:

`$ npm run gulp`

