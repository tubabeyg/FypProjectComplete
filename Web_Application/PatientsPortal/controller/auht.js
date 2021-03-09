var jwt = require("jsonwebtoken");
require("dotenv").config();
var expressJwt = require("express-jwt");
const Patient = require("../model/patient");
const Hospital = require("../model/hospital");
const Doctor = require("../model/doctor");
const SuperAdmin = require("../model/superAdmin");

/*superAdmin Authetication */
exports.superAdminsignup = async (req, res) => {
    console.log(req.body);
    const superAdminExists = await SuperAdmin.findOne({
        email: req.body.email,
    });

    if (superAdminExists) {
        return res.status(403).json({
            error: "Email have already taken",
        });
    }
    const superAdmin = await new SuperAdmin(req.body);
    await superAdmin.save();
    res.status(200).json({
        message: "Admin registered succesfully",
    });
};

exports.superAdminsignin = (req, res) => {
    //find the admin  based on email
    const { email, password } = req.body;
    console.log(req.body);
    SuperAdmin.findOne({ email }, (err, superAdmin) => {
        //if error or no user
        if (err || !superAdmin) {
            return res.status(401).json({
                error:
                    "Admin with this email is not registered. Please sign in with registered email.",
            });
        }
        // if hospital is found authenticate email and password
        if (!superAdmin.authenticate(password)) {
            console.log(password);
            return res.status(401).json({
                error: "Email and Password doesn't match",
            });
        }
        //generate a token with hospital id and secret
        const token = jwt.sign({ _id: superAdmin.id }, process.env.JWT_SECRET);

        //persist the token as 't' in cookie with expiry date
        res.cookie("t", token, { expire: new Date() + 9999 });
        //return response with user and token to frontend client
        const { _id, Name, email } = superAdmin;
        return res.json({ token, super: { _id, Name, email } });
    });
};

exports.superAdminsignout = (req, res) => {
    res.clearCookie("t");
    return res.json({ message: "signout successfully" });
};

exports.superAdminrequireSignIn = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth",
    algorithms: ["HS256"],
});

/*Hospital Authetication */
exports.hospitalsignup = async (req, res) => {
    console.log(req.body);
    const hospitalExists = await Hospital.findOne({ email: req.body.email });

    if (hospitalExists) {
        return res.status(403).json({
            error: "Email have already taken",
        });
    }
    const hospital = await new Hospital(req.body);
    await hospital.save();
    res.status(200).json({
        message: "Hospital registered succesfully",
    });
};

exports.hospitalsignin = (req, res) => {
    //find the hospital based on email
    const { email, password } = req.body;
    console.log(req.body);
    Hospital.findOne({ email }, (err, hospital) => {
        //if error or no user
        if (err || !hospital) {
            return res.status(401).json({
                error:
                    "Hospital with this email is not registered. Please sign in with registered email.",
            });
        }
        // if hospital is found authenticate email and password
        if (!hospital.authenticate(password)) {
            console.log(password);
            return res.status(401).json({
                error: "Email and Password doesn't match",
            });
        }
        //generate a token with hospital id and secret
        const token = jwt.sign({ _id: hospital.id }, process.env.JWT_SECRET);

        //persist the token as 't' in cookie with expiry date
        res.cookie("t", token, { expire: new Date() + 9999 });
        //return response with user and token to frontend client
        const { _id, Name, email } = hospital;
        return res.json({ token, hospital: { _id, Name, email } });
    });
};

exports.hospitalsignout = (req, res) => {
    res.clearCookie("t");
    return res.json({ message: "signout successfully" });
};

exports.hospitalrequireSignIn = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth",
    algorithms: ["HS256"],
});

/*Patient authetication */
exports.signup = async (req, res) => {
    console.log(req.body);
    const patientExists = await Patient.findOne({ email: req.body.email });

    if (patientExists) {
        return res.status(403).json({
            error: "Email have already taken",
        });
    }
    const patient = await new Patient(req.body);
    await patient.save();
    res.status(200).json({
        message: "signup succesfully",
    });
};

exports.signin = (req, res) => {
    //find the user based on email
    const { email, password } = req.body;
    console.log(req.body);
    Patient.findOne({ email }, (err, patient) => {
        //if error or no user
        if (err || !patient) {
            return res.status(401).json({
                error:
                    "Patient with this email does not exists.Please sign in with registered email.",
            });
        }
        // if user is found authenticate email and password
        if (!patient.authenticate(password)) {
            console.log(password);
            return res.status(401).json({
                error: "Email and Password doesn't match",
            });
        }
        //generate a token with user id and secret

        const token = jwt.sign({ _id: patient.id }, process.env.JWT_SECRET);

        //persist the token as 't' in cookie with expiry date
        res.cookie("t", token, { expire: new Date() + 9999 });
        //return response with user and token to frontend client
        const { _id, firstname, lastname, email } = patient;
        return res.json({
            token,
            patient: patient,
        });
    });
};

exports.signout = (req, res) => {
    res.clearCookie("t");
    return res.json({ message: "signout successfully" });
};

exports.requireSignIn = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth",
    algorithms: ["HS256"],
});

/**Doctor's authentication methods */
exports.doctorsignin = (req, res) => {
    //find the user based on email
    const { email, password } = req.body;
    console.log(req.body);
    Doctor.findOne({ email }, (err, doctor) => {
        //if error or no user
        if (err || !doctor) {
            return res.status(401).json({
                error:
                    "Doctor with this email does not exists.Please sign in with registered email.",
            });
        }
        // if user is found authenticate email and password
        if (!doctor.authenticate(password)) {
            console.log(password);
            return res.status(401).json({
                error: "Email and Password doesn't match",
            });
        }
        //generate a token with user id and secret

        const token = jwt.sign({ _id: doctor.id }, process.env.JWT_SECRET);

        //persist the token as 't' in cookie with expiry date
        res.cookie("t", token, { expire: new Date() + 9999 });
        //return response with user and token to frontend client
        const { _id, firstname, lastname, designation, gender, email } = doctor;
        return res.json({
            token,
            doctor: { _id, firstname, lastname, designation, gender, email },
        });
    });
};

exports.doctorsignout = (req, res) => {
    res.clearCookie("t");
    return res.json({ message: "signout successfully" });
};

exports.doctorrequireSignIn = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth",
    algorithms: ["HS256"],
});
