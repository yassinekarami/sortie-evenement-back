var mongoose = require('mongoose');


const evenementModelSchema = mongoose.Schema({
    eventapi: String,
    eventid: String,
    enddate: Date,
    startdate: Date,
    //geopoint:[],
    categorie_name: String,
    city_title: String,
    title: String,
    favoris: { type: Boolean, default: false},
    vote: { type: Number, default: 0, minimum: 0}


})

module.exports = mongoose.model('EvenementModel', evenementModelSchema);