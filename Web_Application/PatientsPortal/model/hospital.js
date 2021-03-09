const mongoose = require('mongoose');
const uuidv1 = require('uuidv1')
const crypto = require('crypto');
const hospitalSchema = new mongoose.Schema({
    Name:{
        type: String,
        trim: true,
        required: true
    },
    phone:{
        type: String,
        trim: true,
        required: true
    },
    email:{
        type: String,
        trim: true,
        required: true
    },
    hashed_password:{
        type: String,
        required: true
    },
    salt: String,
    created:{
        type: Date,
        default: Date.now()
    },
    updated: Date,
});

//virtual field
hospitalSchema.virtual('password').set(function (password) {
    //creating temp variable _password
    this._password = password;
    //generating a timestamp
    this.salt= uuidv1();
    this.hashed_password = this.encryptPassword(password);
})
.get(function () {
    return this._password
})

hospitalSchema.methods= {
    authenticate : function(plainText){
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword : function (password) {
        if(!password){
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
const Hospital = mongoose.model('Hospital',hospitalSchema);
module.exports = Hospital;