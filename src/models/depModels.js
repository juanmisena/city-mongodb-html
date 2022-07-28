const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;
const depSchema = new Schema({
  name_dep: String
});
const depModel = mongoose.model('Dep', depSchema);
module.exports = depModel; 