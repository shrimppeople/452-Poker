// Import express
var express = require('express');
//Import Body Parser
var bodyParser = require('body-parser');
// Create an instance of the app
var app = express();
var players =["0"];
// Set ejs as the template engine
app.set("view engine", "ejs");

app.get("/", function(req, resp){
	
	// Generate am HTML file from the template
	// and send it to the client
	pnum = players.length-1;
	if(pnum > 1){
		resp.render("Poker", {occup: pnum, room:"/full"});
	}else{
		resp.render("Poker", {occup: pnum, room:"/room"});
	}
});
app.get("/room", function(req, resp){
	
	players.push("1");	
	var cards = deal_cards();
	var id = key();
	resp.render("Room", {c1: cards[0], c2: cards[1], c3: cards[2], round:"1", sess: id});
});
app.post("/room2", function(req, resp){
	var temp = req.query[test];
	console.log(temp);
	var cards = deal_cards();
	var id = key();
	resp.render("Room", {c1: cards[0], c2: cards[1], c3: cards[2], round:"1", sess: id});
});
app.get("/full", function(req, resp){
	
	resp.render("Full");
	
});
function key()
{
	var key = "10101";
	return key;
}
function compare(a,b)
{
    if (a >= b) return true
    else return false
}
function deal_cards()
{
    // returns 3 numbers between 1 to 15
    var hand =  []
    for (var i = 0; i < 3; i++)
		hand[i] = ("0" + Math.floor(1 + (Math.random() * 15))).slice(-2);
    return hand
}

// Listen for requests
app.listen(3000);
