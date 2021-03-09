const express = require("express");
const params = require("../controller/params-resolver");

const {
    getAllpathReports,
    createpathReport,
    editpathReportById,
    deletepathReportById,

    getpathReportById,
    getpathReportsByDoctor,
    getpathReportsOfPatient,
    pathReportImage,
    getPathReportsOfPatientByDoctor,
} = require("../controller/pathreport");

const router = express.Router();

router.post("/createpath", createpathReport); // first time save
router.get("/all", getAllpathReports); // see all reports of all doctors and all patients
router.get("/:pathreportId", getpathReportById); // see one report by given id

router.put("/:pathreportId", editpathReportById); // edit a saved report by its id
router.delete("/:pathreportId", deletepathReportById); // delete a saved report by its id

router.get("/pathreports-by-doctor/:doctorId", getpathReportsByDoctor); // see all reports by given doctor's id
router.get("/pathreports-of-patient/:patientId", getpathReportsOfPatient); // see all reports by given patient's id
router.get("/image/:reportId", pathReportImage);
router.post(
    "/pathreports-of-patient-by-doctor/:patientId/:doctorId",
    getPathReportsOfPatientByDoctor
); // see all reports by given patient's id

router.param("pathreportId", params.pathreportIdParam); // resolve reportId parameter
router.param("doctorId", params.doctorIdParam); // resolve doctorId parameter
router.param("patientId", params.patientIdParam); // resolve patientId parameter

module.exports = router;
