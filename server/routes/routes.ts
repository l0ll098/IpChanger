import express = require("express");
const router = express.Router();

import api = require("./api");

router.use("/api/", api.router);

export { router };
