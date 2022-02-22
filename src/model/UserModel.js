const mongoose = require("mongoose");
var AutoIncrement = require("mongoose-sequence")(mongoose);

const size = 10;
mongoose.plugin(require("mongoose-nanoid"), size); // custom size. see nanoid for more details

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: false },
    email: {
      type: String,
      required: true,
      unique: [true, "Email must be unique"],
    },
    phone: { type: Number, required: true, unique: false },
    sex: { type: String, required: false },
    registered: { type: Boolean, required: true },
    qrcode: { type: String, required: false },
    attend_id: Number,
  },
  { collection: "users" }
);

UserSchema.plugin(require("mongoose-nanoid")); // default size = 12

UserSchema.plugin(AutoIncrement, { id: "attend_seq", inc_field: "attend_id" });

const model = mongoose.model("UserSchema", UserSchema);

module.exports = model;
