const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name_user: String,
  pass_user: String
});
const userModel = mongoose.model('User', userSchema);
module.exports = userModel;