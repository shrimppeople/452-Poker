// poke simulation


const express = require('express');
const sessions = require('sessions');

var app = express()
app.set('view engine', 'ejs')

// cookie

app.get('/', function(req,resp) {
    resp.render("cats", {catname: "Murka", catbreed: "Siberian"})
})

app.post('/room1', function(req,resp) {
    // on button redirect to here
    // waits until there are 2 players to start
    deal_cards()
});

function compare(a,b)
{
    if (a >= b) return true
    else return false
}

function deal_cards()
{
    // returns 3 numbers between 1 to 15
    var hand =  []
    for (let i = 0; i < 3; i++)
        hand[i] = Math.floor(1 + (Math.random() * 15));
    return hand
}

app.listen(3000)