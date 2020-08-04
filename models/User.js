const { model, Schema } = require('mongoose');

const UserSchema = new Schema({
    role: String,
    username: String,
    first_name: String,
    last_name: String,
    password: String,
    email: String
});

module.exports = model('User', UserSchema);