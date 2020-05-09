var isProd = process.env.NODE_ENV === "production";
if (!isProd) require("dotenv").config();

var express = require("express");
var path = require("path");
// var api = require("./src/api/api.js");

// instantiate app
var app = express();

// serve frontend
var dir = path.join(__dirname, "dist/", isProd ? "prod" : "dev");
app.use(express.static(dir));

// serve API
// app.use("/api", api);

var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.info("Listening on port", PORT);
});
