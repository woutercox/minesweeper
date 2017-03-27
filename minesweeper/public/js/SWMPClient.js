//available variables from pug template .script :
/* sessionID = session id of the current game
   apiUrl = rest service url */

function load() {
  //do some stuff
}
window.onload = load;

function leftClick(col,row){
        /* Server api expects   :  
        var sessionID = req.body.sessionID;
        var row = parseInt(req.body.row);
        var col = parseInt(req.body.col);*/
        console.log("Client left click on " + row + " - " + col + " for game " + sessionID)
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
function setData(data){
        setHtmlFromData(data,"gameState");
        setHtmlFromData(data,"flagsLeft");
        setHtmlFromData(data,"timeElapsed");
        setMinefield(data["mineField"]);
}
function setMinefield(mf){
        if(mf)
                for (var i = 0 ; i < mf.length; i++){
                        for (var j = 0 ; j < mf[i].length;j++){
                                $("#cell" + i + "-" + j)
                                // Remove all classes
                                .removeClass()
                                // give correct class
                                .addClass('primary-color pm_' + $(this).attr('class') ); 
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
        return false;
}
 