// Import express
var express = require('express');

// Create an instance of the app
var app = express();

// Set ejs as the template engine
app.set("view engine", "ejs");

app.get("/", function(req, resp){
	
	// Generate am HTML file from the template
	// and send it to the client	
	resp.render("Poker", {occup: "Murka"});
	
});

// Listen for requests
app.listen(3000);
