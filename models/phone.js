const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhoneSchema = new Schema({
    number: String,
    isDefault: Boolean
});

module.exports = mongoose.model('Phone', PhoneSchema);