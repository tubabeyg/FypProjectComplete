const express = require("express");
const params = require("../controller/params-resolver");

const {
  getAllradreports,
  createradreport,
  editradreportById,
  deleteradreportById,

  getradreportById,
  getradreportsByDoctor,
  getradreportsOfPatient,
} = require("../controller/radreport");

const router = express.Router();

router.post("/create", createradreport); // first time save
router.get("/all", getAllradreports); // see all reports of all doctors and all patients
router.get("/:radreportId", getradreportById); // see one report by given id

router.put("/:radreportId", editradreportById); // edit a saved report by its id
router.delete("/:pathreportId", deleteradreportById); // delete a saved report by its id

router.get("/radreports-by-doctor/:doctorId", getradreportsByDoctor); // see all reports by given doctor's id
router.get("/radreports-of-patient/:patientId", getradreportsOfPatient); // see all reports by given patient's id

router.param("radreportId", params.radreportIdParam); // resolve reportId parameter
router.param("doctorId", params.doctorIdParam); // resolve doctorId parameter
router.param("patientId", params.patientIdParam); // resolve patientId parameter

module.exports = router;
