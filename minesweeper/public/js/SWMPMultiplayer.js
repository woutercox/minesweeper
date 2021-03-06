//available variables from pug template .script :
/* sessionID = session id of the current game
   apiUrl = rest service url */
var posities = [];
var timer;

$( document ).ready(
        timer = setInterval(fetchEnLaadData, 3000)
)

function fetchEnLaadData(){
        var gameCount = 15;
        //laad alles via ajax
        $.ajax({
                type: "GET",
                        url: apiUrl + "liveGamesData/" + gameCount,
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function(data){
                                console.log('iets opgehaald')
                                console.dir(data)
                                //do stuff
                                $('#map').html('')
                           laadDataInHtml(data['games']);
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
        //$.each(data, function( key, value ) {
        for(var i = 1 ; i <= data.length ; i++){
                var value = data[i-1]
                console.dir(data)
                $('.spawnPlaatsMarker'+i).append("<div id='marker"+i+"' class='marker'></div>");   
                $a = $('<a onclick=\'viewSession("' + apiUrl + "viewgame/" + value.sessionID + '", "' + value.name +'")\'></a>')
                        .attr('title', 'game : ' + value.name + "\nbooze barrels : " + value.flagsleft + "\nstate : " + value.state + "\ntime : " + value.timer);
                $('.marker:last-child').append($a);
                $a.append('<img src="../img/crate.svg" style="width:40px;height:40px">')
                randomizePositieInGrid(i)
                if(value.state == "lost"){
                        $('#marker'+i).css('background', 'red')
                }else if(value.state == "win"){
                        $('#marker'+i).css('background', 'green')
                }
                else{
                        $('#marker'+i).css('background', 'orange')                    
                }
        }
        $('document').tooltip();
}

function randomizePositieInGrid(i){
        var mapWidth = $('.spawnPlaatsMarker'+i).width();
        var mapHeight = $('.spawnPlaatsMarker'+i).height();
        var randPosX = Math.floor((Math.random()*mapWidth));
        var randPosY = Math.floor((Math.random()*mapHeight));
        $('#marker'+i).css('left', randPosX)
        $('#marker'+i).css('top', randPosY)
        /*huidigePositie = {
        y : randPosY,
        x : randPosX
        }*/
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