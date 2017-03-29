//available variables from pug template .script :
/* sessionID = session id of the current game
   apiUrl = rest service url */
var posities = [];
var huidigePositie = {};

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
                           laadDataInHtml(data);
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
        $.each(data, function( key, value ) {
                $('#spawnPlaatsMarker').append("<div class='marker'></div>");    
                $('.marker:last-child').append('<p>'+ value.name +'</p>')
                $('.marker:last-child').append('<p>' + value.flagsleft + '</p>')
                $('.marker:last-child').append('<p>' + value.state + '</p>')
                $('.marker:last-child').append('<p>' + value.sessionID + '</p>')
                $('.marker:last-child').append('<p>' + value.timer + '</p>')
                $a = $('<a href="' + apiUrl + "viewgame/" + value.sessionID + '"  target="_blank"></a>').attr('class', 'animated');
                $('.marker:last-child').append($a);
                $a.append('<img src="../img/crate.svg" style="width:40px;height:40px">')
                do{ 
                        randomizePositie();
                }
                while(checkOverlap());
                posities.push(huidigePositie);
        });
}

function randomizePositie(){
        var mapWidth = $('#spawnPlaatsMarker').width();
        var mapHeight = $('#spawnPlaatsMarker').height();
        var randPosX = Math.floor((Math.random()*mapWidth));
        var randPosY = Math.floor((Math.random()*mapHeight));
        var randPositieY = (randPosY - 50)

        $('.marker:last-child').css('left', randPosX);
        $('.marker:last-child').css('top', randPositieY);

        huidigePositie = {
        y : randPositieY,
        x : randPosX
        }
}

function checkOverlap(){
        for(var i = 0; i < posities.length; i++){
               /* if(huidigePositie.x > posities[i].x && huidigePositie.x < posities[i].x+40 && huidigePositie.y > posities[i].y && huidigePositie.y < posities[i].y+40 ){*/
                   if(((huidigePositie.x > posities[i].x && huidigePositie.x < posities[i].x+50) ||(posities[i].x > huidigePositie.x  && posities[i].x  < huidigePositie.x+50))&& 
                        ((huidigePositie.y > posities[i].y && huidigePositie.y < posities[i].y+50) ||(posities[i].y > huidigePositie.y  && posities[i].y  < huidigePositie.y+50))){
                        return true;
                }
                return false;
        }
}