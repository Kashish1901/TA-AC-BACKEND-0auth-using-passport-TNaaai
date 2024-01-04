var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    github: {
      name: String,
      username: String,
      image: String,
    },
    google: {
      name: String,

      image: String,
    },
    providers: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
