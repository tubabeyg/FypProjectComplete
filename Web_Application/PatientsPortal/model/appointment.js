var mongoose = require('mongoose');
var { ObjectId } = mongoose.Schema
var appointmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: "Ttile is required",
        minlength: 4,
        maxlength: 150
    },
    status: {
        type: String,
        default: "pending",

    },
    body: {
        type: String,
        required: "Body is required",
        minlength: 4,
        maxlength: 150
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    postedBy: {
        type: ObjectId,
        ref: "Patient"
    },
    created: {
        type: Date,
        default: Date.now()
    },
    sentTo: {
        type: ObjectId,
        ref: "Doctor",
    }
});

module.exports = mongoose.model("Appointment", appointmentSchema);