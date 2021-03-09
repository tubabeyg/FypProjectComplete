const mongoose = require('mongoose');
const uuidv1 = require('uuidv1')
const crypto = require('crypto');
var { ObjectId } = mongoose.Schema;
const patientSchema = new mongoose.Schema({
    firstname: {
        type: String,
        trim: true,
        required: true
    },
    lastname: {
        type: String,
        trim: true,
        required: true
    },
    cnic: {
        type: String,
        trim: true,
        required: true
    },
    phone: {
        type: String,
        trim: true,
        required: true
    },
    age: {
        type: Number,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    createdBy: {
        type: ObjectId,
        ref: "Hospital"
    },
    created: {
        type: Date,
        default: Date.now()
    },
    updated: Date,
    photo: {
        data: Buffer,
        contentType: String
    }
});
//virtual field
patientSchema.virtual('password').set(function (password) {
    //creating temp variable _password
    this._password = password;
    //generateing a timestamp
    this.salt = uuidv1();
    this.hashed_password = this.encryptPassword(password);
})
    .get(function () {
        return this._password
    })

patientSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function (password) {
        if (!password) {
            return ""
        }
        try {
            return crypto.createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        }
        catch (e) {
            return ""
        }
    }
};
const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;