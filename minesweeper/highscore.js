var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var highScore = new Schema({
    score : Number,
    rows : Number,
    collums : Number,
    name : String
})

module.exports = mongoose.model('highScore', highScore);