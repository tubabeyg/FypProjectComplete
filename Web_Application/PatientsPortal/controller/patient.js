var _ = require('lodash');
var formidable = require('formidable');
var fs = require('fs');
var Patient = require("../model/patient");

exports.patientById = (req, res, next, id) => {
    Patient.findById(id).exec((err, patient) => {
        if (err || !patient) {
            return res.status(400).json({
                error: "Patient not found"
            });
        }
        req.profile = patient;
        next();
    });
};

exports.hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id === req.auth._id;

    if (!authorized) {
        res.status(403).json({
            error: "Patient os not authorized to perform this action"
        });
    }
};


exports.getAllPatients = (req, res) => {
    var patient = Patient.find()
        .select("_id  firstname lastname cnic phone email age created")
        .then((patient) => {
            res.status(200).json(
                patient
            );
        })
        .catch(err => console.log(err));
};


exports.getPatient = (req, res) => {

    return res.json(req.profile);
};

// exports.updatePatient = (req,res, next)=>{
//     let patient = req.profile
//     patient = _.extend(patient, req.body);// extend - mutate the source object
//     patient.updated = Date.now();
//     patient.save((err)=>{
//         if(err){
//             console.log(err)
//             return res.status(400).json({
//                 error: "You are not authorized  to perform this action"

//             })
//         }
//         patient.hashed_password = undefined;
//         patient.salt = undefined;
//         res.json({
//             patient
//         });

//     })

// };

exports.updatePatient = (req, res, next) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        console.log("form parsed")
        if (err) {
            return res.status(400).json({
                error: "Photo could not be uploaded"
            })
        }
        console.log("Fids", fields)
        let patient = req.profile
        patient = _.extend(patient, fields)

        if (files.photo) {
            patient.photo.data = fs.readFileSync(files.photo.path)
            patient.photo.contentType = files.photo.type
        }
        patient.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            patient.hashed_password = undefined;
            patient.salt = undefined;
            res.json(patient)
        })
    })
}

exports.patientPhoto = (req, res, next) => {
    if (req.profile.photo.data) {
        res.set(("Content-Type", req.profile.photo.contentType));
        return res.send(req.profile.photo.data)
    }
    next();
}

exports.deletePatient = (req, res, next) => {
    let patient = req.profile;
    patient.remove((err, patient) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        patient.hashed_password = undefined;
        patient.salt = undefined;
        res.json({
            message: "Patient deleted successfully"
        });
    });
};