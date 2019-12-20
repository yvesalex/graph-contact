const mongoose = require('mongoose');
const Email = require('./email');
const Phone = require('./phone');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: String,
    lastname: String, 
    address: String, 
    birthdate: Date, 
    username: String,
    password: String,
    emails: [Email], 
    phones: [Phone], 
    contacts: [Contact]
}, {
    timestamps: true
});


module.exports = mongoose.model('User', UserSchema);