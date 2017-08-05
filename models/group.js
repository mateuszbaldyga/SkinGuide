var mongoose = require("mongoose");

var procedureSchema = new mongoose.Schema({
   name: String,
   price: Number,
   });

var groupSchema = new mongoose.Schema({
   name: String,
   procedures: [ procedureSchema ]
});

module.exports = mongoose.model("Group", groupSchema);