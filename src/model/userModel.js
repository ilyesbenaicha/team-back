const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["SuperAdmin", "Admin", "Employer"]
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    last_name : {
      type: String,
    },
    tel : {
      type : Number,
    },
    addresse : {
      type : String
    },
  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model("user", userSchema);
