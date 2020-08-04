const { model, Schema } = require('mongoose');

const ProjectSchema = new Schema({
    user_id: String,
    title: String,
    description: String
});

module.exports = model('Project', ProjectSchema);