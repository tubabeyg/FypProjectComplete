var express = require('express');
var { patientById, getAllPatients, getPatient, updatePatient, deletePatient, patientPhoto } = require("../controller/patient");
const { patientSignUpValidation } = require('../validator/index');
const { requireSignIn } = require('../controller/auht');
var router = express.Router();

router.get("/patients", getAllPatients);
router.get("/patient/:patientId", requireSignIn, getPatient);
router.put("/patient/:patientId", requireSignIn, updatePatient);
router.delete("/patient/:patientId", requireSignIn, deletePatient);
router.get("/patient/photo/:patientId", patientPhoto)
router.param("patientId", patientById);

module.exports = router;
