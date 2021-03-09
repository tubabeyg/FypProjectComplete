var express = require('express');
var { doctorById, getAllDoctors, getDoctor, updateDoctor, deleteDoctor, doctorPhoto, getAppointments, acceptAppointment } = require("../controller/doctor");
var { appointmentById } = require('../controller/appointment')
const { doctorrequireSignIn } = require('../controller/auht');
var router = express.Router();

router.get("/doctors", getAllDoctors);
router.get("/:doctorId", getDoctor);
router.put("/:doctorId", doctorrequireSignIn, updateDoctor);
router.delete("/:doctorId", doctorrequireSignIn, deleteDoctor);
router.get("/photo/:doctorId", doctorPhoto)
router.get("/appointments/:doctorId", getAppointments)
router.get("/acceptAppointments/:appointmentId", acceptAppointment)
router.param("doctorId", doctorById);
router.param("appointmentId", appointmentById);


module.exports = router;
