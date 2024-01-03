var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: { type: String, required: true },
  username: String,
  photo: String,
});

module.exports = mongoose.model("User", userSchema);
