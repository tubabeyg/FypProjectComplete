var _ = require("lodash");
var formidable = require("formidable");
var fs = require("fs");
var Doctor = require("../model/doctor");
const { DH_CHECK_P_NOT_PRIME } = require("constants");

exports.doctorById = (req, res, next, id) => {
    Doctor.findById(id)
        .populate('appointments', '_id title status')
        .exec((err, doctor) => {
            if (err || !doctor) {
                return res.status(400).json({
                    error: "Doctor not found",
                });
            }
            if (req.profile) {
                req.doctorProfile = doctor
            }
            else {
                req.profile = doctor;
            }
            ;
            next();
        });
};
exports.hasAuthorization = (req, res, next) => {
    const authorized =
        req.profile && req.auth && req.profile._id === req.auth._id;

    if (!authorized) {
        res.status(403).json({
            error: "Doctor is not authorized to perform this action",
        });
    }
};

exports.getAllDoctors = (req, res) => {
    var doctor = Doctor.find()
        .select(
            "_id  firstname lastname designation gender cnic phone email age created"
        )
        .then((doctor) => {
            console.log("DOCTORS");
            console.log(doctor);
            res.status(200).json(doctor);
        })
        .catch((err) => console.log(err));
};

exports.getDoctor = (req, res) => {
    return res.json(req.profile);
};

exports.updateDoctor = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        console.log("form parsed");
        if (err) {
            return res.status(400).json({
                error: "Photo could not be uploaded",
            });
        }
        let doctor = req.profile;

        doctor = _.extend(doctor, fields);

        if (files.photo) {
            doctor.photo.data = fs.readFileSync(files.photo.path);
            doctor.photo.contentType = files.photo.type;
        }
        doctor.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err,
                });
            }
            doctor.hashed_password = undefined;
            doctor.salt = undefined;
            res.json(doctor);
        });
    });
};

exports.doctorPhoto = (req, res, next) => {
    if (req.profile.photo.data) {
        res.set(("Content-Type", req.profile.photo.contentType));
        return res.send(req.profile.photo.data);
    }
    next();
};

exports.getAppointments = (req, res) => {
    res.json(req.profile)
}

exports.acceptAppointment = (req, res) => {
    let appointment = req.appointment;
    const updatedFields = {
        status: 'Accepted'
    }
    appointment = _.extend(appointment, updatedFields);
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
}

exports.deleteDoctor = (req, res, next) => {
    let doctor = req.profile;
    doctor.remove((err, doctor) => {
        if (err) {
            return res.status(400).json({
                error: err,
            });
        }
        doctor.hashed_password = undefined;
        doctor.salt = undefined;
        res.json({
            message: "Doctor deleted successfully",
        });
    });
};
