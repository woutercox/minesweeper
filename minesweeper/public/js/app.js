$(document).foundation();

// Object constructor for membership card data
function CardData(name, cv, portfolio, id) {
    this.name = name;
    this.cv = cv;
    this.portfolio = portfolio || null;
    this.id = id;
}

function createMemberID() {
    var min = 1001; var max = 9999;
    var randNr = 0;
    do {
        randNr = Math.floor(Math.random()*(max-min+1)+min);
    } while(existingIDs.indexOf(randNr) !== -1)
    existingIDs.push(randNr);
 
    return randNr;
}
// Data for the membershop 'ID' numbers
var existingIDs = [];

// Data for the 'membership cards'
var cards = [
    new CardData("Maximiliaan Verheyen", "http://maxverheyen.be/resume/", "http://maxverheyen.be/", createMemberID()),
    new CardData("Wouter Cox", "http://www.coxwouter.be/", "http://coxwouter.be/Designs/Portfolio/", createMemberID()),
    new CardData("Peter Melis", "http://www.google.be/", "http://www.google.be/", createMemberID())
]

var counter = 0; // Track the position of the current membership card

// Extend jQuery to wait for animations
$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    }
});

// Function to shuffle arrays
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function changeCard(index) {
    // console.dir(cards[index]);
    $(".member-name a").text(cards[index].name);
    $("#card-name").text(cards[index].name);
    $(".cv > a ").attr("href", cards[index].cv);
    
    // console.log(cards[0].portfolio);
        if(cards[index].portfolio !== null) {
            $(".portfolio > a ").attr("href", cards[index].portfolio).text("Portfolio");
            
        } else {
            $(".portfolio >a").html("");
        }
}

function changeMember(index) {
$(".membership").text("Member #" + cards[index].id + ": " + cards[index].name);
}

$(document).ready(function() {
    shuffleArray(cards);
    changeMember(0);
    $(".member-name a").text(cards[0].name);
    $("#card-name").text(cards[0].name);
    $(".cv > a ").attr("href", cards[0].cv);
    
    // console.log(cards[0].portfolio);
    if(cards[0].portfolio !== null) {
        $(".portfolio").attr("visibility", "visible");
        $(".portfolio > a ").attr("href", cards[0].portfolio);
    } else {
        $(".portfolio >a").text("");
    }  
    
    
})

$("#top-arrow a").click(function() {
    counter++;
    if(counter >= cards.length ) {
        counter = 0;
    } 
    
    $("#card-img").animateCss("flipInX");
    
    changeCard(counter);
    changeMember(counter);
})

$("#bottom-arrow a").click(function() {
    if(counter >0 ) {
        counter--;
    } else {
        counter = cards.length-1;
    }
    
    $("#card-img").animateCss("flipInX");
    changeCard(counter);
    changeMember(counter);
})