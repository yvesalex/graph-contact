const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmailSchema = new Schema({
    address: String,
    isDefault: Boolean
});

module.exports = mongoose.model('Email', EmailSchema);