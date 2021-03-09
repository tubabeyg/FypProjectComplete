var Appointment = require('../model/appointment');
var Doctor = require('../model/doctor');
var _ = require('lodash');
var formidable = require('formidable');
var fs = require('fs');
const app = require('../app');

exports.appointmentById = (req, res, next, id) => {
    Appointment.findById(id)
        .populate("postedBy", "_id firstname lastname")
        .exec((err, appointment) => {
            if (err || !appointment) {
                return res.status(400).json({
                    error: err
                });
            }
            req.appointment = appointment;
            next();
        });
};

exports.getAppointment = (req, res) => {
    var appointment = Appointment.find({})
        .populate("postedBy", "_id firstname lastname")
        .select("_id  title body")
        .then((appointment) => {
            res.status(200).json({
                appointment
            });
        })
        .catch(err => console.log(err));
};


exports.createAppointment = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image couldn't be uploaded"
            })
        }
        let appointment = new Appointment(fields);
        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        console.log("patient", req.profile)
        console.log("doctor", req.doctorProfile)
        appointment.postedBy = req.profile._id;
        appointment.sentTo = req.doctorProfile._id;
        if (files.photo) {
            appointment.photo.data = fs.readFileSync(files.photo.path);
            appointment.photo.contentType = files.photo.type
        }
        console.log(appointment, "app saved.")
        appointment.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            Doctor.findById(req.doctorProfile._id, (err, doctor) => {
                if (err) {
                    console.log("error aaya he")
                }
                else {
                    doctor.appointments.push(result)
                    doctor.save((err, doctor) => {
                        if (err) {
                            console.log("save main error")
                        }
                    })
                }
            })
            res.json(result);
        })
    });
};


exports.appointmentByPatient = (req, res) => {
    Appointment.find({ postedBy: req.profile._id })
        .populate("postedBy", "_id firstname lastname")
        .sort("_created")
        .exec((err, appointment) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(appointment);
        });

}

exports.updateAppointment = (req, res, next) => {
    let appointment = req.appointment;
    appointment = _.extend(appointment, req.body);
    appointment.updated = Date.now();
    console.log(appointment.updated)
    appointment.save(err => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json(appointment);
    });
    console.log(appointment)
}


exports.isPoster = (req, res, next) => {
    let isPoster = req.appointment && req.auth && req.appointment.postedBy._id == req.auth._id;

    if (!isPoster) {
        return res.status(403).json({
            error: "You are not authroized"
        });
    }
    next();
};


exports.deleteAppointment = (req, res) => {
    let appointment = req.appointment
    console.log(appointment);
    appointment.remove((err, appointment) => {
        if (err) {
            res.status(400).json({
                error: err
            });
        }
        res.json({
            message: "Appointment deleted successfully"
        });
    });
};

exports.getPendingAppointments = (req, res) => {
    Appointment.find({ postedBy: req.profile._id, status: 'pending' })
        .populate("postedBy", "_id firstname lastname")
        .sort("_created")
        .exec((err, appointment) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(appointment);
        });
}

exports.acceptAppointment = (req, res) => {
    Appointment.find({ status: false })
        .populate("postedBy", "_id firstname lastname")
        .sort("_created")
        .exec((err, appointment) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(appointment);
        });
}