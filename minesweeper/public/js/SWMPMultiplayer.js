//available variables from pug template .script :
/* sessionID = session id of the current game
   apiUrl = rest service url */
var posities = [];
var huidigePositie = {};
var teller = 0

function load() {
  test();
}
window.onload = load;

function test(row,col){
        /* Server api expects   :  */
      //alert("js werkt , jeej");
}


function fetchEnLaadData(){
        var gameCount = 15;
        //laad alles via ajax
        $.ajax({
                type: "POST",
                        url: apiUrl + "livegames/" + gameCount,
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
        //TODO:fetchgames : liveGamesRefresh
}

//wordt aangeroepen door de server , naam niet aanpassen !
function laadDataInHtml(data){
        $('#map').append("<table id='smurf'><tr><td class='spawnPlaatsMarker1'></td><td class='spawnPlaatsMarker2'></td><td class='spawnPlaatsMarker3'></td></tr><tr><td class='spawnPlaatsMarker4'></td><td class='spawnPlaatsMarker5'></td><td class='spawnPlaatsMarker6'></td></tr><tr><td class='spawnPlaatsMarker7'></td><td class='spawnPlaatsMarker8'></td><td class='spawnPlaatsMarker9'></td></tr></table>")  
        $.each(data, function( key, value ) {
                teller++
                $('.spawnPlaatsMarker'+teller)
                $('.spawnPlaatsMarker'+teller).append("<div id='marker"+teller+"' class='marker'></div>");   
                /*$('.marker:last-child').append('<p>'+ value.name +'</p>')
                $('.marker:last-child').append('<p>' + value.flagsleft + '</p>')
                $('.marker:last-child').append('<p>' + value.state + '</p>')
                $('.marker:last-child').append('<p>' + value.timer + '</p>')*/
                $a = $('<a onclick=\'viewSession("' + apiUrl + "viewgame/" + value.sessionID + '", "' + value.name +'")\'></a>')
                        .attr('title', 'game : ' + value.name + "\nbooze barrels : " + value.flagsleft + "\nstate : " + value.state + "\ntime : " + value.timer);
                $('.marker:last-child').append($a);
                $a.append('<img src="../img/crate.svg" style="width:40px;height:40px">')
                randomizePositieInGrid(teller)
        });
        $('document').tooltip();
}

function randomizePositieInGrid(teller){
        var mapWidth = $('.spawnPlaatsMarker'+teller).width();
        var mapHeight = $('.spawnPlaatsMarker'+teller).height();
        var randPosX = Math.floor((Math.random()*mapWidth));
        var randPosY = Math.floor((Math.random()*mapHeight));
        $('#marker'+teller).css('left', randPosX)
        $('#marker'+teller).css('top', randPosY)
        huidigePositie = {
        y : randPosY,
        x : randPosX
        }
}

function viewSession(url, name){
        var $dialog = $('<div></div>')
               .html('<iframe style="border: 0px; " src="' + url + '" width="100%" height="100%"></iframe>')
               .dialog({
                   autoOpen: false,
                  /* modal: true,*/
                   height: 625,
                   width: 500,
                   title: name
               });
        $dialog.dialog('open');
}