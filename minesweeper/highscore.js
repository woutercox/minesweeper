
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/my_database');

var Schema = mongoose.Schema;
 
var highScore = new Schema({
    score : Number,
    rows : Number,
    collums : Number,
    name : String,
    bombs : Number
})

module.exports = mongoose.model('highScore', highScore);