'use strict';
//server specific settings
const PROTOCOL = "http://"
const HOST = "localhost"
const PORT = 8081;
const SERVERNAME = "MineSwerver"
const VERSIONNAME = "0.15"
/* Libraries 'verkrijgen' */
var SWMPRepo = require('./SWMPRepo'); //main code of app
var repo = new SWMPRepo();
var express = require('express');
var app = express();
var path = require("path");
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//viewengine = pug = jade
app.set('view engine', 'pug')

// MongoDB Connection URL
//var url = 'mongodb://localhost:27017/test';
//var mongoClient = require('mongodb').MongoClient;

app.use(express.static('public'))

app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-reqed-With, Content-Type, Accept");
    next();
});

app.get('/test', function (req, res) {
   console.log(SERVERNAME + " v " + VERSIONNAME + " is working");
   var ng= repo.newGame("Steven",10,10,10);
   var gameInfo = "<div>New game started ID : <a href='/viewGame/" + ng["sessionID"] + "' target='_blank'>" + ng["sessionID"] + "</a></div><div>There are " + repo.activeGamesCount() + " active games"; 
   res.send('Hello from ' + SERVERNAME + " v " + VERSIONNAME + gameInfo);
});
app.get('/liveGamesInfo', function (req, res) {
   console.log(SERVERNAME + " v " + VERSIONNAME + " is working");
   var gameInfo = "<div>Games running : " + repo.activeGamesCount(); + "</div>";
   if (repo.activeGamesCount() > 0){
       gameInfo +="<table>"
       gameInfo +="<thead><tr><th>player</th><th>session</th><th>flagsleft</th><th>state</th><th>started</th></tr>"
        for (var sessionID in repo.runningGames) {
            var g = repo.runningGames[sessionID]
            gameInfo +="<tbody><tr>"
            gameInfo +="<tr><td>" + g.name + "</td>"
            gameInfo += "<td><a href='/viewGame/" + sessionID + "' target='_blank'>" + sessionID + "</a></td>"
            gameInfo += "<td>" + g.bombFlagsLeft()  + "</td>"
            gameInfo += "<td>" + g.gameStateString()  + "</td>"
            gameInfo += "<td>" + g.start.toISOString()  + "</td>"
            gameInfo += "</tr></tbody>"
        }
        gameInfo +="</table>"
   }
   //res.header("text/html")
   var head = "<head><style>td {padding:5px;border-bottom:1px solid grey}</style></head>" 
   res.send("<html>" + head + "<body>Hello from " + SERVERNAME + " v " + VERSIONNAME + gameInfo + "</body></html>");
   
});
// Start a Publicly viewable minesweeper game
app.post('/startGame', function(req, res) {
    console.log("startGame");
    var name = req.body.name || "new player";
    var cols = req.body.cols;
    var rows = req.body.rows;
    var bombs = req.body.bombs;
    var ro = repo.newGame(name,cols,rows,bombs);
    res.status(200).send(JSON.stringify(ro));
});

// Perform a leftCLick in a game and retrieve the result
app.post('/leftClick', function(req, res) {
    var sessionID = req.body.sessionID;
    var row = parseInt(req.body.row);
    var col = parseInt(req.body.col);
    var ro = repo.leftClickAndGetViewData(sessionID, row,col);
    res.status(200).send(JSON.stringify(ro));
});

// Perform a rightClick in a game and retrieve the result
app.post('/rightClick', function(req, res) {
    var sessionID = req.body.sessionID;
    var row = parseInt(req.body.row);
    var col = parseInt(req.body.col);
    var ro = repo.rightClickAndGetViewData(sessionID, row,col);
    res.status(200).send(JSON.stringify(ro));
});

// View a Publicly viewable minesweeper game
app.get('/viewGameOld/:sessionID', function (req, res) {
    var sessionID = req.params.sessionID;
    var ro = repo.getViewData(sessionID);
    var out = "<table>"
    out += "<tr><td>session ID</td><td>" + sessionID + "</td></tr>"  
    out += "<tr><td>name</td><td>" + ro["name"] + "</td></tr>"  
    out += "<tr><td>game state</td><td>" + ro["gameState"]  + "</td></tr>"  
    out += "<tr><td>flags left</td><td>" + ro["flagsLeft"]  +  "</td></tr>"  
    out += "<tr><td>time elapsed</td><td>" + ro["timeElapsed"]  + "</td></tr>"  
    out += "</table>"
    out += "<table>"
    var mineField =ro["mineField"]
    for (var i=0 ; i<mineField.length; i++){
        out += "<tr>"
        for (var j=0 ; j<mineField[i].length; j++){
            out += "<td class='swmp_td_hidden'>" + mineField[i][j] + "</td>"
        }
        out += "</tr>"
    }
    out += "</table>"
    var head = "<head></head>" 
    res.send("<html>" + head + "<body>Hello from " + SERVERNAME + " v " + VERSIONNAME + "<br/>" + out + "</body></html>");
    //res.status(200).send(JSON.stringify(viewModel));;
});

app.get('/viewGame/:sessionID', function (req, res) {
    var sessionID = req.params.sessionID;
    var viewData = repo.getViewData(sessionID);
    viewData.sessionID = sessionID;
    viewData.apiUrl = PROTOCOL + HOST  + ":" + PORT + "/"
    res.render('SWMPViewClient', viewData)
});

app.get('/play', function (req, res) {
    res.render('SWMPGameClient', {apiUrl: PROTOCOL + HOST  + ":" + PORT + "/"})
});

app.get('/liveGames/', function (req, res) {
    var gameCount = 9 //req.params.count;
    var viewData = repo.getLiveGames(gameCount);
    viewData.apiUrl = PROTOCOL + HOST  + ":" + PORT + "/"
    //template wordt hier gebruikt : SWMPMultiplayer.pug  uit /view
    //en  samengevoegd met data
    if(viewData){
        console.dir(viewData["games"].length);
    }
    res.render('SWMPMultiplayer', viewData) 
});

app.get('/liveGamesRefresh/', function (req, res) {
    var gameCount = 9 //req.params.count;
    var viewData = repo.getLiveGames(gameCount);
    viewData.apiUrl = PROTOCOL + HOST  + ":" + PORT + "/"
    //template wordt hier gebruikt : SWMPMultiplayer.pug  uit /view
    //en  samengevoegd met data
     res.status(200).send(JSON.stringify(viewData));  
});

// Listen on port
var server = app.listen(PORT, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("App listening at http://%s:%s", host, port);
});
