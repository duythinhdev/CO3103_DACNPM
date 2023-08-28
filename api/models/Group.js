const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    groupname: {type:String},
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
  }, {timestamps: true});
  
  const GroupModel = mongoose.model('Group', GroupSchema);
  module.exports = GroupModel;