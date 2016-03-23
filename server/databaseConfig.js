var mongoose        = require('mongoose');

module.exports = function(app) {
    var db = require('./config/db');

    mongoose.connect(db.url); 

    app.set("conn", mongoose.connection);
};