var express = require("express");
var router = express.Router();
var { superAdminrequireSignIn } = require("../controller/auht");
var {
  displayHospital,
  hospitalsignup,
  DeleteHospital,
  EditHospital,
  displayAllHospitals,
} = require("../controller/superAdmin");
var { deleteHospital } = require("../controller/hospital");
var { hospitalSignUpValidation } = require("../validator/index");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

//SuperAdmin's hospital action routes
router.post("/hospitalsignup", hospitalSignUpValidation, hospitalsignup);
router.get(
  "/displayHospital/:hospitalId",
  superAdminrequireSignIn,
  displayHospital
);
router.get(
  "/displayAllHospitals",
  superAdminrequireSignIn,
  displayAllHospitals
);
router.delete(
  "/DeleteHospital/:hospitalId",
  superAdminrequireSignIn,
  DeleteHospital
);
router.put("/EditHospital/:_id", superAdminrequireSignIn, EditHospital);

module.exports = router;
