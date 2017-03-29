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
        //laad alles via ajax
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
        console.dir(data);
        $.each(data, function( key, value ) {
        console.log( value.name, value.state );
    
    $('#map').append("<div class='marker'></div>");    
    $('.marker:last-child').append('<p>'+ value.name +'</p>')
    $('.marker:last-child').append('<p>' + value.flagsleft + '</p>')
    $('.marker:last-child').append('<p>' + value.state + '</p>')
    $('.marker:last-child').append('<p>' + value.sessionID + '</p>')
    $('.marker:last-child').append('<p>' + value.timer + '</p>')
    $a = $('<a href="' + apiUrl + "viewgame/" + value.sessionID + '"></a>').attr('class', 'linkMarker');
    $('.marker:last-child').append($a);
    $a.append('<img>')
  });
}
 