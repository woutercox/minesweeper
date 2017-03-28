//available variables from pug template .script :
/* sessionID = session id of the current game
   apiUrl = rest service url */

function load() {
  //do some stuff
}
window.onload = load;

var SessionID = "";
var currentFlagsLeft = "";

function startGame(){
        if($("#name").val() == "" || $("#rows").val() == "" || $("#cols").val() == "" || $("#bombs").val() == ""){
                console.log("pls fill")
        }else{
                $("#gameClientTitle").html($("#name").val());
                $("#gameClientForm").toggle();
                $("#ClientMinefieldMsg").html("Fetching battlemap");
                $("#gameClientField").toggle();
                var rows =  $("#rows").val();
                var cols = $("#cols").val();
                prepareMap(rows,cols);
                $.ajax({
                type: "POST",
                        url: apiUrl + "startGame",
                        data: JSON.stringify({ name:$("#name").val(), rows : rows, cols : cols, bombs:$("#bombs").val() }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function(data){
        //sessionID:sessionID,flagsLeft:msmpSes.bombFlagsLeft(),mineField:msmpSes.viewData()
                                sessionID = data["sessionID"]
                                data.gameState = "Busy"
                                data.timeElapsed = 0;
                                console.dir(data);
                                setData(data)
                                $("#ClientMinefieldMsg").html("");
                        },
                        failure: function(errMsg) {
                                alert("Server issues " + errMsg);
                        }
                });
        }

        function restartGame(){
                $("#gameClientTitle").html("New attack plan");
                $("#gameClientForm").toggle()
                $("#gameClientField").toggle()
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
        function setData(data){
                if (data["gameState"] == "busy" || data["gameState"] == "Busy"){
                        //setHtmlFromData(data,"name");
                        setMinefield(data["mineField"]);
                }else{
                        $("#minefield").html("");
                }
                setHtmlFromData(data,"gameState");
                setHtmlFromData(data,"flagsLeft");
                setHtmlFromData(data,"timeElapsed");
        }
        function setMinefield(mf){
                if(mf)
                        for (var i = 0 ; i < mf.length; i++){
                                for (var j = 0 ; j < mf[i].length;j++){
                                        var cssClass = "swmp_td_hidden";
                                        //console.log("'" + mf[i][j] + "'");
                                        var checkMe = mf[i][j]
                                        switch (checkMe) {
                                        case "0":
                                                cssClass = "swmp_td_shown";
                                                break;
                                        case "1":
                                        case "2":
                                        case "3":
                                        case "4":
                                        case "5":
                                        case "6":
                                        case "7":
                                        case "8":
                                                cssClass = "swmp_td_" + mf[i][j];
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
                                        $(id).text(mf[i][j]);
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

        function prepareMap(rows,cols){
                $("#minefield").html("");
                var out = "<table>"
                for(var i = 0 ; i < rows; i++){
                        out += "<tr>"
                        for(var j = 0 ; j < rows; j++){
                                out += "<td id='cell" + i + "-" + j + "' class='swmp_td_hidden'";
                                out += " onclick='leftClick(" + i + "," + j + ")'";
                                out += " oncontextmenu='rightClick(" + i + "," + j + ");return false;'"; 
                                out += "</td>";                
                        }
                        out += "</tr>"
                }
                $("#minefield").html(out + "</table>")
        }
        }
