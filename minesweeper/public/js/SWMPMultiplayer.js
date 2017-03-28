//available variables from pug template .script :
/* sessionID = session id of the current game
   apiUrl = rest service url */

function load() {
  test();
}
window.onload = load;

function test(row,col){
        /* Server api expects   :  */
      alert("js werkt , jeej");
}


function fetchEnLaadData(){
        $.ajax({
        type: "POST",
                url: apiUrl + "livegames",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){
                        //do stuff
                    
                },
                failure: function(errMsg) {
                        alert("Server issues " + errMsg);
                }
        });

        //fetchgames : liveGamesRefresh

        //do calc

        //laad in html . laadDataInHtml
}

//wordt aangeroepen door de server , naam niet aanpassen !
function laadDataInHtml(data){
        console.dir(data)
}
 