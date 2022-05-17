var mongoose = require('mongoose');
  
var contestSchema = new mongoose.Schema({
    name: String,
    desc: String,
    startDate: String,
    link: String,
    isPrevious: Boolean
});
  
//Image is a model which has a schema imageSchema
  
module.exports = new mongoose.model('contests', contestSchema);