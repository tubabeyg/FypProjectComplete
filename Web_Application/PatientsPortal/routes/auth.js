var express = require("express");
var { hospitalById } = require("../controller/hospital");
const {
  superAdminsignup,
  superAdminsignin,
  hospitalsignup,
  hospitalsignin,
  hospitalsignout,
  doctorsignin,
  doctorsignout,
  signup,
  signin,
  signout,
} = require("../controller/auht");
var { patientById } = require("../controller/patient");
var { doctorById } = require("../controller/doctor");
const {
  hospitalSignUpValidation,
  patientSignUpValidation,
  doctorSignUpValidation,
  superAdminSignUpValidation,
} = require("../validator/index");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/superAdminsignup", superAdminSignUpValidation, superAdminsignup);
router.post("/superAdminsignin", superAdminsignin);

/* Hospital Routes */
router.post("/hospitalsignup", hospitalSignUpValidation, hospitalsignup);
router.post("/hospitalsignin", hospitalsignin);
router.get("/hospitalsignout", hospitalsignout);
// any route
router.param("hospitalId", hospitalById);

/* Patient Routes */
router.post("/signup", patientSignUpValidation, signup);
router.post("/signin", signin);
router.get("/signout", signout);

// any route
router.param("patientId", patientById);
module.exports = router;

/* Doctor Routes */
router.post("/doctorsignin", doctorsignin);
router.get("/doctorsignout", doctorsignout);

// any route
router.param("doctorId", doctorById);

module.exports = router;
