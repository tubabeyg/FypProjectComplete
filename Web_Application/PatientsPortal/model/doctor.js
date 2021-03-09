var mongoose = require("mongoose");
var { ObjectId } = mongoose.Schema;
const uuidv1 = require("uuidv1");
const crypto = require("crypto");
var doctorSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    trim: true,
    required: true,
  },
  designation: {
    type: String,
    trim: true,
    //required: true
  },
  gender: {
    type: String,
    trim: true,
    //  required: true
  },
  cnic: {
    type: String,
    trim: true,
    required: true,
  },
  phone: {
    type: String,
    trim: true,
    required: true,
  },
  age: {
    type: Number,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  hashed_password: {
    type: String,
    required: true,
  },
  salt: String,
  photo: {
    data: Buffer,
    contentType: String,
  },
  createdBy: {
    type: ObjectId,
    ref: "Hospital",
  },
  appointments: [{
    type: ObjectId,
    ref: "Appointment",
  }],
  created: {
    type: Date,
    default: Date.now(),
  },
});

//virtual field
doctorSchema
  .virtual("password")
  .set(function (password) {
    //creating temp variable _password
    this._password = password;
    //generateing a timestamp
    this.salt = uuidv1();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

doctorSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) {
      return "";
    }
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (e) {
      return "";
    }
  },
};
const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
