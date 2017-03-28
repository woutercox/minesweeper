'use strict';
const MINESWEEPERGAME_DEFAULT_ROWS = 10;
const MINESWEEPERGAME_DEFAULT_COLS = 10;
const MINESWEEPERGAME_DEFAULT_BOMBS = 10;

//minesweeper multiplayer demo
var SWMPRepo = function(){
    this.runningGames = [];
    this.newGame = function(name, rows , cols , bombs){
        var msmpSes = new MineSweeperSession(name, rows, cols , bombs)
        var sessionID = this.genSessionID();
        while(sessionID in this.runningGames) sessionID = this.genSessionID();
        this.runningGames[sessionID] = msmpSes;
        console.log("new game with id " + sessionID)
        return {sessionID:sessionID,flagsLeft:msmpSes.bombFlagsLeft(),mineField:msmpSes.viewData()};
    }
    this.leftClickAndGetViewData= function(sessionID, row, col){
        console.log("left click " + sessionID + " on : " + row + " : " + col)
        var go = this.getGame(sessionID);
        go.leftClick(row,col);
        return this.getViewDataFromGameObject(sessionID,go);
    }
    this.rightClickAndGetViewData= function(sessionID, row, col){
        console.log("right click " + sessionID + " on : " + row + " : " + col)
        var go = this.getGame(sessionID);
        go.rightClick(row,col);
        return this.getViewDataFromGameObject(sessionID,go);
    }
    this.getViewDataFromGameObject= function(sessionID,go){
         return {sessionID:sessionID,name:go.name,gameState:go.gameStateString(),flagsLeft:go.bombFlagsLeft(),mineField:go.viewData(),timeElapsed:go.timeElapsed()}
    }
    this.getViewData= function(sessionID){
         var go = this.getGame(sessionID);
         return this.getViewDataFromGameObject(sessionID,go);
    }
    this.activeGamesCount = function(){
        return Object.keys(this.runningGames).length;
    }
    this.getLiveGames = function(top){
        var returnCnt = (top?top:9) - 1;
        var output = new Array();
        for (var key in this.runningGames) {
            var go = this.runningGames[key];
            output.push(
                {   sessionID:key,
                    name:go.name,
                    state:go.gameStateString(), 
                    flagsleft:go.bombFlagsLeft(),
                    timer:go.timeElapsed()
            })
            if (! --returnCnt) return output
        }
        return { games : output}
    }
    this.getGame = function (sessionID){
        console.log("get game " + sessionID)     
        if(sessionID && this.runningGames[sessionID]) return this.runningGames[sessionID];
        throw "Game does not exist or your session has expired"
    }
    this.terminateGame = function (sessionID){
        if(sessionID && this.runningGames[sessionID]) 
            delete this.runningGames[sessionID];
    }
    this.terminateAll = function (){
        this.runningGames = [];
    }
    this.genSessionID = function(){
        var d = new Date().getTime();
        var uuid = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    }
}

class MineSweeperSession{
    constructor(name,rows , cols  , bombs){
        this.name = name;
        this.start = new Date();
        this.game = new MineSweeperGame(rows, cols , bombs);
        this.game.start();
        this.bombFlagsLeft = function (){return this.game.bombFlagsLeft()};
        this.viewData  = function (){return this.game.getViewData()};
        this.gameState = this.game.gameState;
        this.timeElapsed = function(){return (new Date() - this.start) / 1000;}
        this.gameStateString = function(){
            if (this.game.gameState == 0)
                return "busy"
            else if (this.game.gameState == 1)
                return "win"
            else 
                return "lost"
        }
        this.time = 0;
        this.leftClick = function(row,col) {
             this.game.clickTile(row,col)
             this.clickCount++;
             if (this.game.gameState == 2 || this.game.gameState == 2) //loose
                this.time = new Date() - this.start
        } 
        this.rightClick = function(row,col){
            this.game.rightClickTile(row,col)
            this.clickCount++;
            if (this.game.gameState == 1 || this.game.gameState == 1) //win
                this.time = new Date() - this.start
            return this.viewData();
        }
        this.clickCount = 0;
    }
}

'use strict';
class MineSweeperGame{
    constructor(rows, cols ,bombs){
        console.log("game initialised");
        this.gameState = 0; //0= started , 1 = won , 2 = loss
        this.rows = rows || MINESWEEPERGAME_DEFAULT_ROWS;
        this.cols = cols || MINESWEEPERGAME_DEFAULT_COLS;
        this.bombs = bombs || MINESWEEPERGAME_DEFAULT_BOMBS;
        this.bombsFlagged = 0;
        this.bombsFlaggedCorrectly = 0;
        this.spaces = [];
        this.show = [];
    }
    bombFlagsLeft(){
        return this.bombs - this.bombsFlagged;
    }
    allBombsFlaggedCorrectly(){ //= win
        return this.bombsFlaggedCorrectly == this.bombs;
    }
    preLoadSpaces(){ //premake the grid with 0 in every place (0= no bombs nearby and not a bomb itself thus 0 means EMPTY)
        console.log("game preload space");
        this.spaces = new Array(this.rows)
        this.show = new Array(this.rows)
        for (var i = 0; i < this.rows; i++) {
            this.spaces[i] = new Array(this.cols);
            this.show[i] = new Array(this.cols);
            for (var j = 0; j < this.cols; j++) {
                this.spaces[i][j] = 0;
                this.show[i][j] = "h"; //h for hidden
            }
        }
    }
    distributeBombs(){ // place bombs randomly on the grid , following NO distribution pattern , but bombs can not overlap
        console.log("game distributeBombs");
        var cntSpaces = this.rows * this.cols;
        if (this.bombs > cntSpaces)
            throw 'Nuclear fallout : Not enough spaces to put this many bombs';
        var bombSpaces = new Array();
        var bombsToDistribute = this.bombs;
        while (bombsToDistribute--){
            var bombToDistribute = Math.floor((Math.random() * cntSpaces) + 1) - 1;
            while (bombSpaces.includes(bombToDistribute))
                bombToDistribute = Math.floor((Math.random() * cntSpaces) + 1) - 1;
            bombSpaces.push(bombToDistribute); 
            var ro = Math.floor((bombToDistribute)/this.cols)
            var co = (bombToDistribute)%this.cols;
            this.spaces[ro][co] = "b" //b for bomb
        }
    }
    calculateNumbers(){ //for every element calculate surrounding bomb count if it is not a bomb
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                if (this.spaces[i][j] != "b"){
                    //topleft
                    if( j > 0 && i > 0 && this.spaces[i-1][j-1] == "b") 
                        this.spaces[i][j]++
                    //top
                    if(i > 0 && this.spaces[i-1][j] == "b") 
                        this.spaces[i][j]++
                    //topright
                    if(i > 0 && j < (this.cols - 1)  && this.spaces[i-1][j+1] == "b") 
                        this.spaces[i][j]++
                    //left
                    if(j > 0  && this.spaces[i][j-1] == "b") 
                        this.spaces[i][j]++
                    //right
                    if(j < (this.cols - 1)   && this.spaces[i][j+1] == "b") 
                        this.spaces[i][j]++
                    //bottomleft
                    if( j > 0 && i < (this.rows - 1)  && this.spaces[i+1][j-1] == "b") 
                        this.spaces[i][j]++
                    //bottom
                    if(i < (this.rows - 1)  && this.spaces[i+1][j] == "b") 
                        this.spaces[i][j]++
                    //bottomright
                    if( j < (this.cols - 1) && i < (this.rows - 1)  && this.spaces[i+1][j+1] == "b") 
                        this.spaces[i][j]++
                }
            }
        }
    }
    start(){
        console.log("game started");
        this.preLoadSpaces();
        this.distributeBombs();
        this.calculateNumbers();
    }  
    getTestData(){ //for testing
        var out =  "";
        for (var i = 0; i < this.rows; i++) {     
            for (var j = 0; j < this.cols; j++) {
                out += this.spaces[i][j] + " ";
            }
            out += " row : " + i + "\n"
        }
        return out
    } 
    getTestOutput(){ //for testing
        var out =  "";
        for (var i = 0; i < this.rows; i++) {  
            for (var j = 0; j < this.cols; j++) {
                if (this.show[i][j] == "s" )
                    out += this.spaces[i][j] + " ";
                else 
                    out +=  this.show[i][j] + " ";
            }
            out += " row : " + i + "\n"
        }
        return out;
    } 
    getViewData(){
        var out =  new Array(this.rows);
        for (var i = 0; i < this.rows; i++) {  
            out[i] = new Array(this.cols)
            for (var j = 0; j < this.cols; j++) {
                if (this.show[i][j] == "s" )
                    out[i][j] = this.spaces[i][j];
                else 
                    out[i][j] = this.show[i][j];
            }
        }
        //console.dir(out);
        return out;
    }
    showConnectedRecursive(row,col){ //=flood pattern for showing of connected cells on click
        //console.log(row + " " + col + " " + this.show[row][col] )
        if (this.show[row][col] == "h"){
            if (this.spaces[row][col] != "b"){
                this.show[row][col] = "s";
                if (this.spaces[row][col] == 0){ //flood if the current value is empty
                    if(row > 0) //top
                        this.showConnectedRecursive(row - 1 ,col)
                    if(col> 0 ) //left
                        this.showConnectedRecursive(row,col - 1)
                    if(col < (this.cols - 1) ) //right
                        this.showConnectedRecursive(row,col + 1)
                    if(row < (this.rows - 1)) //bottom
                        this.showConnectedRecursive(row + 1,col)
                //topleft
                    if( row > 0 && col > 0) this.showConnectedRecursive(row - 1,col - 1)
                //topRight 
                    if(row > 0 && col < (this.cols - 1) ) this.showConnectedRecursive(row - 1 ,col + 1)
                //bottom left 
                    if( col > 0 && row < (this.rows - 1) )  this.showConnectedRecursive(row + 1 ,col - 1)
                //bottomright 
                    if( col < (this.cols - 1) && row < (this.rows - 1)) this.showConnectedRecursive(row + 1 ,col + 1)
                }
             }
        }
    }
    clickTile(row,col){
        if(this.gameState == 0 && this.show[row][col]){
            if ( this.show[row][col] == "h"){
                if (this.spaces[row][col] == "b"){
                    this.show[row][col] = "s"
                    this.gameState = 2; //BOOM !  
                }
                else
                    this.showConnectedRecursive(row,col)
            }
        }
    }
    rightClickTile(row,col){
        console.log("rightclick (" + row + "," + col + ") " + this.show[row][col] + " - " + this.spaces[row][col]  + " flagsleft: " +this.bombFlagsLeft())
        if (this.gameState == 0){
            if (this.show[row][col] == "h" && this.bombFlagsLeft() > 0){ //check if can still place flags
                this.show[row][col] = "f" // f for flagged
                this.bombsFlagged++;
                if (this.spaces[row][col] == "b") this.bombsFlaggedCorrectly++
                if (this.allBombsFlaggedCorrectly()) 
                    {this.gameState = 1; //WIN !!!!
                        console.log("win")}
            }
            else if (this.show[row][col] == "f"){
                this.bombsFlagged--;
                if (this.spaces[row][col] == "b") this.bombsFlaggedCorrectly--
                this.show[row][col] = "?" // ? for unknown
            }           
            else if (this.show[row][col] == "?")
                this.show[row][col] = "h" 
        }
    }
}

//if(typeof exports !== 'undefined')
    module.exports = SWMPRepo;