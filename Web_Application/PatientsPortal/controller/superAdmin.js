var _ = require("lodash");
var formidable = require("formidable");
var fs = require("fs");
var superAdmin = require("../model/superAdmin");
var Hospital = require("../model/hospital");

exports.superAdminById = (req, res, next, id) => {
  superAdmin.findById(id).exec((err, superAdmin) => {
    if (err || !superAdmin) {
      return res.status(400).json({
        error: "Admin not found",
      });
    }
    req.profile = superAdmin;
    next();
  });
};

exports.hospitalsignup = async (req, res) => {
  console.log(req.body);
  const hospitalExists = await Hospital.findOne({ email: req.body.email });

  if (hospitalExists) {
    return res.status(403).json({
      error: "Email have already taken",
    });
  }
  const hospital = await new Hospital(req.body);
  await hospital.save();
  res.status(200).json({
    message: "Hospital registered succesfully",
  });
};

exports.hasAuthorization = (req, res, next) => {
  const authorized =
    req.profile && req.auth && req.profile._id === req.auth._id;

  if (!authorized) {
    res.status(403).json({
      error: "You are not authorized to perform this action",
    });
  }
};

// xports.EditHospital = function (req, res, next) {
//   response = null;
//   Hospital.findById(req.params._id)
//     .then((hospital) => {
//       console.log("exports.EditHospital -> req.body", req.body);

//       hospital
//         .update({
//           Name: req.body.Name,
//           phone: req.body.phone,
//           email: req.body.email,
//         })
//         .then((result) => {
//           return res.status(200).json(result);
//         })
//         .catch((err) => next(err));
//     })
//     .catch((err) => next(err));
// };
// e;
exports.EditHospital = async (req, res) => {
  console.log("exports.EditHospital -> req.body", req.body);
  // console.log("exports.EditHospital -> req", req)
  console.log("exports.EditHospital -> { Name: req.body.Name, phone: req.body.phone, email: req.body.email }", { Name: req.body.Name, phone: req.body.phone, email: req.body.email })
  const results = await Hospital.findOneAndUpdate(
    { _id: req.body._id },
    { Name: req.body.Name, phone: req.body.phone, email: req.body.email }
  );

  console.log(results);
  res.status(200).json({
    results: results,
  });
};
// Respond with valid data

// exports.EditHospital = async (req, res, next) => {
//   const hos = await Hospital.findOne({ _id: req.params._id });
//   hos.Name = req.body.Name;
//   hos.phone = req.body.phone;
//   hos.email = req.body.email;
//   await hos.save();
//   res.json("hoho");
// };

exports.DeleteHospital = (req, res, next) => {
  Hospital.deleteOne({ _id: req.params.hospitalId }, function (error, results) {
    if (error) {
      return next(error);
    }
    // Respond with valid data
    res.json({
      message: "Hospital deleted successfully",
    });
    // hospital.hashed_password = undefined;
    // hospital.salt = undefined;
  });
};

exports.displayHospital = async (req, res) => {
  const results = await Hospital.findOne({ _id: req.params.hospitalId });
  res.status(200).json({
    results,
  });
};

exports.displayAllHospitals = async (req, res) => {
  const results = await Hospital.find({});
  res.status(200).json({
    results,
  });
};
