var pathReport = require("../model/pathreport");
var Doctor = require("../model/doctor");
const { extend } = require("lodash");
const formidable = require("formidable");
var _ = require("lodash");
var fs = require("fs");
var mongoose = require("mongoose");

exports.createpathReport = async (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
        console.log("form parsed");
        if (err) {
            return res.status(400).json({
                error: "Photo could not be uploaded",
            });
        }
        let pathreport = req.body;

        pathreport = _.extend(pathreport, fields);

        if (files.image) {
            image = {};
            image.data = fs.readFileSync(files.image.path);
            image.contentType = files.image.type;

            Object.assign(pathreport, { image });
        }

        const newpathreport = await new pathReport(pathreport).save();
        return res.status(200).json({
            id: newpathreport._id,
            message: "You have created new pathology report",
        });
    });
};

exports.getpathReportById = async (req, res) => {
    const report = await pathReport.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(req.pathreportData._id),
            },
        },
        {
            $lookup: {
                from: "patients",
                localField: "patient",
                foreignField: "_id",
                as: "patients",
            },
        },
        { $unwind: "$patients" },
    ]);

    return res.json(report);
};

exports.pathReportImage = (req, res, next) => {
    if (req.pathReport.image.data) {
        res.set(("Content-Type", req.pathReport.image.contentType));
        return res.send(req.pathReport.image.data);
    }
    next();
};

exports.getpathReportsByDoctor = async (req, res) => {
    const results = await pathReport.aggregate([
        {
            $match: {
                doctor: mongoose.Types.ObjectId(req.doctor.id),
            },
        },
        {
            $lookup: {
                from: "patients",
                localField: "patient",
                foreignField: "_id",
                as: "patients",
            },
        },
        { $unwind: "$patients" },
    ]);

    res.status(200).json({
        results,
    });
};

exports.getpathReportsOfPatient = async (req, res) => {
    const results = await pathReport.find({ patient: req.patient.id });
    res.status(200).json({
        results,
    });
};

exports.getPathReportsOfPatientByDoctor = async (req, res) => {
    const results = await pathReport.aggregate([
        {
            $match: {
                doctor: mongoose.Types.ObjectId(req.doctor.id),
                patient: mongoose.Types.ObjectId(req.patient.id),
                created: {
                    $gte: new Date(req.body.fromDate + " 00:00:00"),
                    $lte: new Date(req.body.toDate + " 23:59:59"),
                },
            },
        },
        {
            $lookup: {
                from: "patients",
                localField: "patient",
                foreignField: "_id",
                as: "patients",
            },
        },
        { $unwind: "$patients" },
    ]);

    res.status(200).json({
        results,
    });
};

exports.getAllpathReports = (req, res) => {
    pathReport
        .find()
        .select(
            "doctor patient field1 field2 field3 field4 field5 field6 field7 field8 field9 field10"
        )
        .then((pathreport) => {
            console.log("exports.getAllpathReports -> pathreport", pathreport);
            res.status(200).json(pathreport);
        })
        .catch((err) => console.error(err));
};

exports.editpathReportById = (req, res) => {
    console.log("exports.editpathReportById -> req.body", req.body);
    let pathreport = req.pathreportData;
    pathreport = extend(pathreport, req.body);

    pathreport.save((err) => {
        if (err) {
            return res.status(400).json({
                error: err,
            });
            console.log("exports.updatepathReport -> err", err);
        }
        res.json(pathreport);
        console.log("exports.updatepathReport -> pathreport", pathreport);
    });
    console.log(pathreport);
};

exports.deletepathReportById = (req, res, next) => {
    let pathreport = req.pathreportData;
    pathreport.remove((err, pathreport) => {
        if (err) {
            console.log("exports.deletepathReportById -> err", err);
            return res.status(400).json({
                error: err,
            });
        }
        res.json({ message: "Report deleted successfully" });
    });
};
