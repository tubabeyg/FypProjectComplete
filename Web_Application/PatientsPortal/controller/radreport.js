var radreport = require("../model/radreport");
var Doctor = require("../model/doctor");
const { extend } = require("lodash");

exports.createradreport = async (req, res, next) => {
  console.log(req.body);
  console.log("exports.createradreport -> req.body", req.body);
  const radreport = await new radreport(req.body);
  const doctor = await new Doctor(req.body);
  console.log(
    "exports.createradreport -> await radreport.save()",
    await radreport.save()
  );

  res.status(200).json({
    message: "Report saved succesfully",
    message: req.body,
  });
};

exports.getradreportById = (req, res) => {
  return res.json(req.radreportData);
};

exports.getradreportsByDoctor = async (req, res) => {
  const resu = await radreport.find({ doctor: req.doctor.id });

  const tmp = resu.values;
  // console.log("exports.getReportsByDoctor -> tmp", tmp);

  let results = Array.from(resu);
  // console.log("exports.getReportsByDoctor -> results", results);

  const x = [];
  resu.map(async (r) => {
    const xx = await Doctor.findOne({ _id: r.doctor });
    r["doctorx"] = xx;
    r["doctory"] = 123;

    x.push(xx);
  });

  res.status(200).json({
    results,
    x,
  });
};

exports.getradreportsOfPatient = async (req, res) => {
  const results = await radreport.find({ patient: req.patient.id });
  res.status(200).json({
    results,
  });
};

exports.getAllradreports = (req, res) => {
  radreport
    .find()
    .select(
      "doctor patient field1 field2 field3 field4 field5 field6 field7 field8 field9 field10"
    )
    .then((radreport) => {
      console.log("exports.getAllradreports -> radreport", radreport);
      res.status(200).json(radreport);
    })
    .catch((err) => console.error(err));
};

exports.editradreportById = (req, res) => {
  console.log("exports.editradreportById -> req.body", req.body);
  let radreport = req.radreportData;
  radreport = extend(radreport, req.body);

  radreport.save((err) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
      console.log("exports.updateradreport -> err", err);
    }
    res.json(radreport);
    console.log("exports.updateradreport -> radreport", radreport);
  });
  console.log(radreport);
};

exports.deleteradreportById = (req, res, next) => {
  let radreport = req.radreportData;
  radreport.remove((err, radreport) => {
    if (err) {
      console.log("exports.deleteradreportById -> err", err);
      return res.status(400).json({
          error: err,
        });
    }
    res.json({ message: "Report deleted successfully" });
});
};
