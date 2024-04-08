const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  });


const Team = mongoose.model('Team', TeamSchema);

module.exports = Team;