const express = require("express");
const params = require("../controller/params-resolver");

const {
    getAllReports,
    createReport,
    editReportById,
    deleteReportById,

    getReportById,
    getReportsByDoctor,
    getReportsOfPatient,
    getReportsOfPatientByDoctor,
} = require("../controller/report");

const router = express.Router();

router.post("/create", createReport); // first time save
router.get("/all", getAllReports); // see all reports of all doctors and all patients
router.get("/:reportId", getReportById); // see one report by given id

router.put("/:reportId", editReportById); // edit a saved report by its id
router.delete("/:reportId", deleteReportById); // delete a saved report by its id

router.get("/reports-by-doctor/:doctorId", getReportsByDoctor); // see all reports by given doctor's id
router.get("/reports-of-patient/:patientId", getReportsOfPatient); // see all reports by given patient's id
router.post(
    "/reports-of-patient-by-doctor/:patientId/:doctorId",
    getReportsOfPatientByDoctor
); // see all reports by given patient's id

router.param("reportId", params.reportIdParam); // resolve reportId parameter
router.param("doctorId", params.doctorIdParam); // resolve doctorId parameter
router.param("patientId", params.patientIdParam); // resolve patientId parameter

module.exports = router;
