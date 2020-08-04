const { model, Schema } = require('mongoose');

const TeamSchema = new Schema({
    name: String,
    manager: String,
    employees: [{
        user_id: String,
        username: String,
        email: String
    }]
});

module.exports = model('Team', TeamSchema);