// Import express
var express = require('express');
//Import Body Parser
var bodyParser = require('body-parser');
var forge = require("node-forge");
var S = require('string');
var bigInt = require("big-integer");
// Create an instance of the app
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var players =["0"];
var player1 =[];
var player1R = [];
var player2R = [];
var player2 =[];
var win = "Congrats you WON!!!!!!! *throws confetti";
var lose = "Bummer you lose.";
// Set ejs as the template engine
app.set("view engine", "ejs");

app.get("/", function(req, resp){
	pnum = players.length-1;
	if(pnum > 1){
		resp.render("Poker", {occup: pnum, room:"/full"});
	}else{
		resp.render("Poker", {occup: pnum, room:"/room"});
	}
});
app.get("/home", function(req, resp){
	players.pop();
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
	var sess = session_key();
	var sess_key = sess[0];
	var iv = sess[1];
	pnum = players.length-1;

	//Utilizing RSA Public-Private key encryption
	//Defining our RSA object
	var rsa = forge.pki.rsa;

	//Creating Public-Private key pair
	var keypair = rsa.generateKeyPair({bits:2048, e:0x10001});
	console.log("\n")
	console.log("original session key: ",sess_key);

	//Encrypting the key pair with servers public key
	var encrypted_session = keypair.publicKey.encrypt(sess_key);
	console.log("encrypted session key:", encrypted_session)
	console.log("\n")
	
	//Server is decrypting encrypted session key
	var decrypted_session = keypair.privateKey.decrypt(encrypted_session);
	console.log("decrypted session key: ",decrypted_session);
	console.log("\n\n")

	//Saving player variables in the correct array
	if(pnum === 1){
		player1.push(id);
		player1R.push(id);
		player1R.push(sess_key);
		player1R.push(iv);
	}else{
		player2.push(id)
		player2R.push(id);
		player2R.push(sess_key);
		player2R.push(iv);
	}
	resp.render("Room", {c1: cards[0], c2: cards[1], c3: cards[2], round:"1", sess: id, room:"/room2"});
});
app.post("/room2", urlencodedParser, function(req, resp){
	var temp = req.body.select;
	var par1 = S(temp).left(5).s;
	var par2 = S(temp).right(2).s;

	if(player1[0] === par1){
		player1.push(par2);
		id = player1[0];
	}else{
		player2.push(par2);
		id = player2[0];
	}
	if(player1.length === player2.length){
		if(compare(player1[1], player2[1])===true){
			player1.push("W");
			player2.push("L");
		}else if(compare(player2[1], player1[1])===true){
			player2.push("W");
			player1.push("L");
		}else{
			var tem = Math.floor(1 + (Math.random() * 2));
			if(temp = "1"){
				player1.push("W");
				player2.push("L");
			}else{
				player2.push("W");
				player1.push("L");
			}
		}
	}

	var cards = deal_cards();
	resp.render("Room", {c1: cards[0], c2: cards[1], c3: cards[2], round:"2", sess: id,room:"/room3"});
});
app.post("/room3", urlencodedParser, function(req, resp){
	var temp = req.body.select;
	var par1 = S(temp).left(5).s;
	var par2 = S(temp).right(2).s;

	if(player1[0] === par1){
		player1.push(par2);
		id = player1[0];
	}else{
		player2.push(par2);
		id = player2[0];
	}
	if(player1.length === player2.length){
		if(compare(player1[3], player2[3])===true){
			player1.push("W");
			player2.push("L");
		}else if(compare(player2[3], player1[3])===true){
			player2.push("W");
			player1.push("L");
		}else{
			var tem = Math.floor(1 + (Math.random() * 2));
			if(temp = "1"){
				player1.push("W");
				player2.push("L");
			}else{
				player2.push("W");
				player1.push("L");
			}
		}
	}

	var cards = deal_cards();
	resp.render("Room", {c1: cards[0], c2: cards[1], c3: cards[2], round:"3", sess: id,room:"/room4"});
});
app.post("/room4", urlencodedParser, function(req, resp){
	var temp = req.body.select;
	var par1 = S(temp).left(5).s;
	var par2 = S(temp).right(2).s;

	if(player1[0] === par1){
		player1.push(par2);
		id = player1[0];
	}else{
		player2.push(par2);
		id = player2[0];
	}
	if(player1.length === player2.length){
		if(compare(player1[1], player2[1])===true){
			player1.push("W");
			player2.push("L");
		}else if(compare(player2[1], player1[1])===true){
			player2.push("W");
			player1.push("L");
		}else{
			var tem = Math.floor(1 + (Math.random() * 2));
			if(temp = "1"){
				player1.push("W");
				player2.push("L");
			}else{
				player2.push("W");
				player1.push("L");
			}
		}
	}
	
	if(player1.length === player2.length){
		standing1 = winCount("1");
		standing2 = winCount("2");

		check1 = winCheck(standing1);
		check2 = winCheck(standing2);

		if(check1 === true){
			if(par1 === player1[0]){
				yhand = [player1[1], player1[3], player1[5]];
				ohand = [player2[1], player2[3], player2[5]];
				resp.render("Results", {message: win, yhand:yhand, ohand:ohand});
			}else{
				yhand = [player2[1], player2[3], player2[5]];
				ohand = [player1[1], player1[3], player1[5]];
				resp.render("Results", {message: lose, yhand:yhand, ohand:ohand});
			}
		}else if(check2 === true){
			if(par1 === player2[0]){
				yhand = [player2[1], player2[3], player2[5]];
				ohand = [player1[1], player1[3], player1[5]];
				resp.render("Results", {message: win, yhand:yhand, ohand:ohand});
			}else{
				yhand = [player1[1], player1[3], player1[5]];
				ohand = [player2[1], player2[3], player2[5]];
				resp.render("Results", {message: lose, yhand:yhand, ohand:ohand});
			}
		}else{
			var cards = deal_cards();
			resp.render("Room", {c1: cards[0], c2: cards[1], c3: cards[2], round:"4", sess: id,room:"/room5"});
		}
	}else{
		var cards = deal_cards();
		resp.render("Room", {c1: cards[0], c2: cards[1], c3: cards[2], round:"4", sess: id,room:"/room5"});
	}
	
});
app.post("/room5", urlencodedParser, function(req, resp){
	var temp = req.body.select;
	var par1 = S(temp).left(5).s;
	var par2 = S(temp).right(2).s;
	
	standing1 = winCount("1");
	standing2 = winCount("2");
	check1 = winCheck(standing1);
	check2 = winCheck(standing2);
	if(check1 === true){
		if(par1 === player1[0]){
			yhand = [player1[1], player1[3], player1[5]];
			ohand = [player2[1], player2[3], player2[5]];
			resp.render("Results", {message: win, yhand:yhand, ohand:ohand});
		}else{
			yhand = [player2[1], player2[3], player2[5]];
			ohand = [player1[1], player1[3], player1[5]];
			resp.render("Results", {message: lose, yhand:yhand, ohand:ohand});
		}
	}else if(check2 === true){
		if(par1 === player2[0]){
			yhand = [player2[1], player2[3], player2[5]];
			ohand = [player1[1], player1[3], player1[5]];
			resp.render("Results", {message: win, yhand:yhand, ohand:ohand});
		}else{
			yhand = [player1[1], player1[3], player1[5]];
			ohand = [player2[1], player2[3], player2[5]];
			resp.render("Results", {message: lose, yhand:yhand, ohand:ohand});
		}
	}
});

app.get("/full", function(req, resp){
	
	resp.render("Full");
	
});
function key()
{
	pnum = players.length-1;
	if(pnum === 1){
		var key = "00000";
	}else{
		var key = "11111"
	}

	return key;
}
function session_key()
{
    var length = 16;
		var id = '';
		var iv = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++ ) {
       id += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		for (var i = 0; i < length; i++ ) {
			iv += characters.charAt(Math.floor(Math.random() * charactersLength));
	 }
    return [iv, id];
}
function compare(a,b)
{
    if (a > b) return true
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
function winCount(a){
	var i;
	var w1 = 0;
	var l1 = 0;
	var d1 = 0;
	var w2 = 0;
	var l2 = 0;
	var d2 = 0;

	if(a === "1"){
		for (i = 0; i < player1.length; i++) {
			if(player1[i] === "W") {
				w1 += 1;
			}else if(player1[i] === "L"){
				l1 += 1;
			}else if(player1[i] === "D"){
				d1 += 1;
			}			
		}
		var results = [w1,l1,d1];
	}else{
		for (i = 0; i < player1.length; i++) {
			if(player2[i] === "W") {
				w2 += 1;
			}else if(player2[i] === "L"){
				l2 += 1;
			}else if(player2[i] === "D"){
				d2 += 1;
			}
		}
		var results = [w2,l2,d2];		
	}
	return results;
}
function winCheck(a){
	if(a[0] === 3){
		return true;
	}
	return false;
}


// Listen for requests
app.listen(3000);
