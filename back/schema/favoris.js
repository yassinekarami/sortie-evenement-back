var mongoose = require('mongoose');


const favorisModelSchema = mongoose.Schema({
    eventid: String,
    title: String,
    startDate: Date,
    endDate: Date
})

module.exports = mongoose.model('FavorisModel', favorisModelSchema);