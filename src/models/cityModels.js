const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;
const citySchema = new Schema({
  name_ci: String,
  _idDep: Schema.Types.ObjectId
});
const cityModel = mongoose.model('City', citySchema);
module.exports = cityModel;