//available variables from pug template .script :
/* sessionID = session id of the current game
   apiUrl = rest service url */
var timer = null;
function load() {
        timer = setInterval(getData, 200);
}
window.onload = load;

function getData(){
        $.ajax({
                type: "POST",
                        url: apiUrl + "viewGameData",

                        data: JSON.stringify({ sessionID: sessionID}),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function(data){
                                prepareMap( data["cols"],data["rows"]);
                        setData(data)
                        },
                        failure: function(errMsg) {
                                alert("Server issues " + errMsg);
                        }
                });
}
function setData(data){        
        //setTime(data["timeElapsed"]);
       if( data["gameState"] == "lost")
        {
                clearInterval(timer);
               /* $("#minefield").effect( "shake" );
                $( "#dialogBadJobKid" ).dialog( "open" );*/
        }else if( data["gameState"] == "win")
        {
                clearInterval(timer);
               /* $( "#dialogGoodJobKid" ).dialog( "open" );*/
        }
        setMinefield(data["mineField"]);
        setHtmlFromData(data,"flagsLeft");
        setHtmlFromData(data,"timeElapsed");
        $("#gameState").html("<img class='gameclient_status_ico' src='../img/state_" + data["gameState"] + ".svg' title='" + data["gameState"] + "'>");
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

function prepareMap(rows,cols){
        $("#minefield").html("");
        var out = "<table id='tableMinefield'>"
        for(var i = 0 ; i < rows; i++){
                out += "<tr>"
                for(var j = 0 ; j < rows; j++){
                        out += "<td id='cell" + i + "-" + j + "' class='swmp_td_hidden'";
                        out += " oncontextmenu='return false;'";     
                        out += "</td>";                
                }
                out += "</tr>"
        }
        $("#minefield").html(out + "</table>")
}