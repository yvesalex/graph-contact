const mongoose = require('mongoose');
const Email = require('./email');
const Phone = require('./phone');
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
    firstname: String,
    lastname: String, 
    address: String, 
    birthdate: Date,
    emails: [Email], 
    phones: [Phone]
}, {
    timestamps: true
});


module.exports = mongoose.model('Contact', ContactSchema);