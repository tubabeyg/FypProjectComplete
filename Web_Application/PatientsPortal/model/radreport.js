var mongoose = require("mongoose");
var { ObjectId } = mongoose.Schema;

var radreportSchema = new mongoose.Schema({
  type: {
    type: String,
    default: "None",
  },
  doctor: {
    type: ObjectId,
    ref: "Doctor",
    required: true,
  },
  patient: {
    type: ObjectId,
    ref: "Patient",
    required: true,
  },
  Indication: {
    type: String,
    trim: true,
    required: false,
  },
  Comparison: {
    type: String,
    trim: true,
    required: false,
  },
  Technique: {
    type: String,
    trim: true,
    required: false,
  },
  Findings: {
    type: String,
    trim: true,
    required: false,
  },
  Conclusion: {
    type: String,
    trim: true,
    required: false,
  },
});

const radreport = mongoose.model("radreport", radreportSchema);
module.exports = radreport;
