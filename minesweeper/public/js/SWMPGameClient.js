//available variables from pug template .script :
/* sessionID = session id of the current game
   apiUrl = rest service url */

function load() {
        var d = new Date().getTime();
        var uuid = 'xxxxxx'.replace(/[x]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        var guest = "Guest " + uuid.toUpperCase();
        //$("#name").val(guest);
        $("#name").val("sjoeke");
}
window.onload = load;

var SessionID = "";
var currentFlagsLeft = "";
var rows=8;
var cols =8;
var timer = null;
var time = 0;
var interval = 200;

function fTimer(){   
        setTime(time + interval / 1000);
};

function setTime(itime){
        time = 1 * itime;
        $("#timeElapsed").text(time.toFixed(2));
}
function pauzeGame(){
        clearInterval(timer);
        $.ajax({
        type: "POST",
                url: apiUrl + "pauseGame",

                data: JSON.stringify({ sessionID: sessionID}),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){
                        setData(data)             
                },
                failure: function(errMsg) {
                        alert("Server issues " + errMsg);
                }
        });
  
}
function unPauzeGame(){
        $.ajax({
        type: "POST",
                url: apiUrl + "unPauseGame",

                data: JSON.stringify({ sessionID: sessionID}),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){
                        setData(data)     
                        timer = setInterval(fTimer, interval);        
                },
                failure: function(errMsg) {
                        alert("Server issues " + errMsg);
                }
        });
  
}
function startGame(){
        if ($("#rows").val() == "" || $("#cols").val() == "" || $("#name").val() == "" || $("#bombs").val() == ""){
                
        }
        else{
                $("#gameClientTitle").html($("#name").val());
                $("#gameClientWrapperSetup").toggle();
                $("#ClientMinefieldMsg").html("Fetching battlemap");
                $("#gameClientWrapperGame").toggle();
                rows =  $("#rows").val();
                cols = $("#cols").val();
                prepareMap(rows,cols,true);
                $.ajax({
                type: "POST",
                        url: apiUrl + "startGame",
                        data: JSON.stringify({ name:$("#name").val(), rows : rows, cols : cols, bombs:$("#bombs").val() }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function(data){
        //sessionID:sessionID,flagsLeft:msmpSes.bombFlagsLeft(),mineField:msmpSes.viewData()
                                sessionID = data["sessionID"]
                                data.gameState = "busy"
                                data.timeElapsed = 0;
                                setData(data)
                                $("#ClientMinefieldMsg").html("");
                                timer = setInterval(fTimer, interval);
                        },
                        failure: function(errMsg) {
                                alert("Server issues " + errMsg);
                        }
                });
        }
}

function restartGame(){
        clearInterval(timer);
        $("#gameClientTitle").html("New attack plan");
        $("#gameClientWrapperSetup").toggle()
        $("#gameClientWrapperGame").toggle()
}

function leftClick(row,col){
        $.ajax({
                type: "POST",
                        url: apiUrl + "leftClick",

                        data: JSON.stringify({ sessionID: sessionID, col:col, row: row }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function(data){
                                setData(data)             
                        },
                        failure: function(errMsg) {
                                alert("Server issues " + errMsg);
                        }
                });
}

function showGamePlay(){
        $("#gamePlays").show();
        $.ajax({
        type: "POST",
                url: apiUrl + "getGamePlays",

                data: JSON.stringify({ player: $("#name").val() }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){
                        loadGamePlaysInHtml(data)        
                },
                failure: function(errMsg) {
                        alert("Server issues " + errMsg);
                }
        });
}

function loadGamePlaysInHtml(data){
        var out = "";
        for (var i=0; i < data.length; i++){
               out += "<div class='gameTypePlayed'>"
               out += "<div class='gameTypePlayedLeft'>1 st ,  10s</div>"
               out += "<div class='gameTypePlayedRight'><input type='button' value ='play'></div>"
               out += "<div class='gameTypePlayedMiddle'>" + data[i]["_id"]["rows"]  ;
               out += " * " +  data[i]["_id"]["collums"];
               out += " b :" + data[i]["_id"]["bombs"];
               out += "</div>"
               out += "</div>"
        }
        $("#gamePlays").html(out);
}
function setData(data){        
        var img = "";
        var state = data["gameState"];
        if (data["gameState"] == "busy"){
                prepareMap(rows,cols,true)
                 img = " <img src='../img/pauzex28.png' onclick='pauzeGame();'>" 
        }
        else
                prepareMap(rows,cols,false)
        if( data["gameState"] == "lost")
        {
                clearInterval(timer);
                $("#minefield").effect( "shake" );
                $( "#dialogBadJobKid" ).dialog( "open" );
                img = " loss"
        }else if( data["gameState"] == "win")
        {
                clearInterval(timer);
                $( "#dialogGoodJobKid" ).dialog( "open" );
                 img = " win"
        }else if (data["gameState"] == "pause"){
                state = "busy";
                img = " <img src='../img/playx28.png' onclick='unPauzeGame();'>"
        }
                
        setTime(data["timeElapsed"]);
        setMinefield(data["mineField"]);
        setHtmlFromData(data,"flagsLeft");

        $("#gameState").html("<img class='gameclient_status_ico' src='../img/state_" + state + ".svg' title='" + data["gameState"] + "'>" + img);
}
function setMinefield(mf){
        if(mf)
                for (var i = 0 ; i < mf.length; i++){
                        for (var j = 0 ; j < mf[i].length;j++){
                                var cssClass = "swmp_td_hidden";
                                //console.log("'" + mf[i][j] + "'");
                                var checkMe = mf[i][j]
                                switch (checkMe) {
                                case 0:
                                        cssClass = "swmp_td_shown";
                                        break;
                                case 1:
                                case 2:
                                case 3:
                                case 4:
                                case 5:
                                case 6:
                                case 7:
                                case 8:
                                        cssClass = "swmp_td_" + mf[i][j] ;
                                        break;
                                case "f":
                                console.log("FLag")
                                        cssClass = "swmp_td_flag";
                                        break;
                                case "?":
                                        cssClass = "swmp_td_question";
                                        break;
                                case "b":
                                        cssClass = "swmp_td_bomb";
                                        break;
                                default:     
                                        cssCLass = "swmp_td_hidden"
                                        break;
                                } 
                                var id = "#cell" + i + "-" + j 
                                //console.log("id " + id + " : " + cssClass)
                                $(id).text(" "); //mf[i][j]
                                $(id)
                                // Remove all classes
                                .removeClass()
                                // give correct class
                                .addClass(cssClass); 
                        }
                }
}
function setHtmlFromData(data,name){
        $("#" + name).text(data[name]);
}
function rightClick(row,col){
                /* Server api expects   :  
        var sessionID = req.body.sessionID;
        var row = parseInt(req.body.row);
        var col = parseInt(req.body.col);*/
        console.log("Client right click on " + row + " - " + col + " for game " + sessionID)
        $.ajax({
                type: "POST",
                        url: apiUrl + "rightClick",

                        data: JSON.stringify({ sessionID: sessionID,  row: row, col:col}),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function(data){
                                setData(data)
                        },
                        failure: function(errMsg) {
                                alert("Server issues " + errMsg);
                        }
                });
        return false;
}

function fillInValues(rows,cols,bombs){
        $("#rows").val(rows);
        $("#cols").val(cols);
        $("#bombs").val(bombs);
}

function prepareMap(rows,cols,canClick){
        $("#minefield").html("");
        var out = "<table id='tableMinefield'>"
        for(var i = 0 ; i < rows; i++){
                out += "<tr>"
                for(var j = 0 ; j < rows; j++){
                        out += "<td id='cell" + i + "-" + j + "' class='swmp_td_hidden'";
                        if (canClick){
                                out += " onclick='leftClick(" + i + "," + j + ")'";
                                out += " oncontextmenu='rightClick(" + i + "," + j + ");return false;'"; 
                        }else{
                            out += " oncontextmenu='return false;'";     
                        }
                        out += "</td>";                
                }
                out += "</tr>"
        }
        $("#minefield").html(out + "</table>")
}

$( function() {
        $( "#dialogGameInfo" ).dialog({
                width: 600,
                modal:true,
                autoOpen: false,
                        show: {
                        effect: "blind",
                        duration: 1000
                },
                hide: {
                        effect: "explode",
                        duration: 1000
                }
        });
        $( "#showGameInfoButton" ).on( "click", function() {
                $( "#dialogGameInfo" ).dialog( "open" );
        });
       $( "#dialogGoodJobKid" ).dialog({
                width: 320,
                modal:true,
                autoOpen: false,
                        show: {
                        effect: "blind",
                        duration: 1000
                },
                hide: {
                        effect: "explode",
                        duration: 1000
                }
        });
        $( "#dialogBadJobKid" ).dialog({
                width: 320,
                modal:true,
                autoOpen: false,
                        show: {
                        effect: "blind",
                        duration: 1000
                },
                hide: {
                        effect: "explode",
                        duration: 1000
                }
        });
} );