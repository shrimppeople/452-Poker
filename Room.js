// Import express
var express = require('express');

// Create an instance of the app
var app = express();

// Set ejs as the template engine
app.set("view engine", "ejs");

app.get("/", function(req, resp){
	
	// Generate am HTML file from the template
	// and send it to the client	
	resp.render("Room", {c1: "7", c2: "2", c3: "13", round:"1"});
	
});

// Listen for requests
app.listen(3100);
