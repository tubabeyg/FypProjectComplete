// var formidable = require("formidable");
// var fs = require("fs");
var Conversation = require("../model/Conversation");
var Message = require("../model/Message");
var Doctor = require("../model/doctor");
const GridFsStorage = require("multer-gridfs-storage");
const multer = require("multer");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const crypto = require("crypto");
const bodyParser = require("body-parser");
var _ = require("lodash");
var formidable = require("formidable");
var fs = require("fs");

var mongoose = require("mongoose");

const MONGO_URI =
    "mongodb://talha123:talha123@radiology-shard-00-00.bsp2s.mongodb.net:27017,radiology-shard-00-01.bsp2s.mongodb.net:27017,radiology-shard-00-02.bsp2s.mongodb.net:27017/admindb?ssl=true&replicaSet=atlas-qwyx44-shard-0&authSource=admin&retryWrites=true&w=majority";

const conn = mongoose.createConnection(process.env.MONGO_URI);

const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, "uploads/");
    },
});
const upload = multer({ storage: storage });

exports.loadFile = (req, res) => {
    // gfs.files.find().toArray((err, files) => {
    //     // Check if files
    //     if (!files || files.length === 0) {
    //         res.render("index", { files: false });
    //     } else {
    //         files.map((file) => {
    //             if (
    //                 file.contentType === "image/jpeg" ||
    //                 file.contentType === "image/png"
    //             ) {
    //                 file.isImage = true;
    //             } else {
    //                 file.isImage = false;
    //             }
    //         });
    //         res.render("index", { files: files });
    //     }
    // });
};

// @route POST /upload
// @desc  Uploads file to DB
// app.post("/upload", upload.single("file"), (req, res) => {
/* exports.upload = (req, res) => {
    console.log("kkk");
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    console.log(form);
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: "Image couldn't be uploaded",
            });
        }
        console.log(fields);
        console.log(files);
        upload.single(files.file);

        res.json({ success: true });
    });
    // res.json({ file: req.file });
}; */

exports.display = (req, res) => {
    // gfs.files.find().toArray((err, files) => {
    //     // Check if files
    //     if (!files || files.length === 0) {
    //         return res.status(404).json({
    //             err: "No files exist",
    //         });
    //     }
    //     // Files exist
    //     return res.json(files);
    // });
};

exports.allmessages = async (req, res) => {
    const re = await Message.find({});

    res.status(200).json({
        data: re,
    });
    console.log(re);
};

// @route GET /files/:filename
// @desc  Display single file object
// app.get("/files/:filename", (req, res) => {
exports.displaysingle = (req, res) => {
    // gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    //     // Check if file
    //     if (!file || file.length === 0) {
    //         return res.status(404).json({
    //             err: "No file exists",
    //         });
    //     }
    //     // File exists
    //     return res.json(file);
    // });
};

// @route GET /image/:filename
// @desc Display Image
// app.get("/image/:filename", (req, res) => {
// exports.displayImage = (req, res) => {
//     console.log("kkk", req.params.id)
//     const id = mongoose.Types.ObjectId(req.params.id)
//     Message.findById(id), function (err, results) {
//         console.log("kkkkllll")
//         console.log(results)
//         res.status(200).json({
//             results,
//         });
//     }

// }
exports.displayImage = async (req, res) => {
    const re = await Message.findOne({ _id: req.params.id });
    res.set(("Content-Type", re.file.contentType));
    res.status(200).send(re.file.data);
};

// exports.displayImage = (req, res, next) => {
//     console.log("jjjjj",req.params.id)
//     id = mongoose.Types.ObjectId(req.params.id)
//     const re = Message.findOne({ _id: id });
//     console.log(re.file)
//     res.set(("Content-Type" , re.file.contentType));
//     //res.send(re.file.data)
//     res.status(200).send(re.file.data)

// }
// gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//     // Check if file
//     if (!file || file.length === 0) {
//         return res.status(404).json({
//             err: "No file exists",
//         });
//     }

//     // Check if image
//     if (
//         file.contentType === "image/jpeg" ||
//         file.contentType === "image/png"
//     ) {
//         // Read output to browser
//         const readstream = gfs.createReadStream(file.filename);
//         readstream.pipe(res);
//     } else {
//         res.status(404).json({
//             err: "Not an image",
//         });
//     }
// });

// @route DELETE /files/:id
// @desc  Delete file
// app.delete("/files/:id", (req, res) => {
exports.deletefile = (req, res) => {
    // gfs.remove({ _id: req.params.id, root: "messages" }, (err, gridStore) => {
    //     if (err) {
    //         return res.status(404).json({ err: err });
    //     }
    //     res.redirect("/");
    // });
};

// app.get("/", (req, res) => {
exports.getFiles = (req, res) => {
    // fs.readFile("./docs/apiDocs.json", (err, data) => {
    //     if (err) {
    //         res.status(400).json({
    //             error: err,
    //         });
    //     }
    //     var docs = JSON.parse(data);
    //     res.json(docs);
    // });
};

// Get conversations list
exports.conversations = (req, res) => {
    let from = mongoose.Types.ObjectId(jwtUser.id);
    Conversation.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "recipients",
                foreignField: "_id",
                as: "recipientObj",
            },
        },
    ])
        .match({ recipients: { $all: [{ $elemMatch: { $eq: from } }] } })
        .project({
            "recipientObj.password": 0,
            "recipientObj.__v": 0,
            "recipientObj.date": 0,
        })
        .exec((err, conversations) => {
            if (err) {
                console.log(err);
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: "Failure" }));
                res.sendStatus(500);
            } else {
                res.send(conversations);
            }
        });
};

// Get messages from conversation
// based on to & from
exports.conversationquery = (req, res) => {
    // mongoose.Message.deleteMany({}, null).then((e) => {
    //     console.log(e);
    // });
    // Message.collection.drop();

    let user1 = mongoose.Types.ObjectId(req.params.sender);
    let user2 = mongoose.Types.ObjectId(req.params.reciever);

    Message.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "to",
                foreignField: "_id",
                as: "toObj",
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "from",
                foreignField: "_id",
                as: "fromObj",
            },
        },
    ])
        .match({
            $or: [
                { $and: [{ to: user1 }, { from: user2 }] },
                { $and: [{ to: user2 }, { from: user1 }] },
            ],
        })
        .project({
            "toObj.password": 0,
            "toObj.__v": 0,
            "toObj.date": 0,
            "fromObj.password": 0,
            "fromObj.__v": 0,
            "fromObj.date": 0,
        })
        .exec((err, messages) => {
            if (err) {
                console.log(err);
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: "Failure" }));
                res.sendStatus(500);
            } else {
                res.send(messages);
            }
        });
};

exports.sendmessage1 =
    (upload.single("file"),
    (req, res) => {
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(req, (err, fields, files) => {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    error: "Image couldn't be uploaded",
                });
            }
            // fs.readFile(files.file.path, (err, data) => {
            //     if (err) throw err; // Fail if the file can't be read.
            //     let str = data.toString('base64')
            file1 = {};
            file1.data = fs.readFileSync(files.file.path);
            file1.contentType = files.file.type;
            var m = new Message({
                to: fields.to,
                from: fields.from,
                body: "gg",
                file: file1,
                fileName: fields.name,
                fileType: fields.fileType,
            });
            m.save((err) => {
                if (err) {
                    console.log(err);
                    res.setHeader("Content-Type", "application/json");
                    res.json(JSON.stringify({ message: "Failure" }));
                    res.sendStatus(500);
                } else {
                    res.setHeader("Content-Type", "application/json");
                    res.json(
                        JSON.stringify({
                            message: "Success",
                        })
                    );
                }
            });

            //});
            //var fileBuffer = Buffer.from(files.file)
            // var fileBuffer = Buffer.from(fileBuffer, "base64");
            // console.log(fileBuffer)
        });
    });
// Post private message
exports.sendmessage = (req, res) => {
    console.log(`🚀 > req`, req.body);
    // Message.collection.drop();

    let from = mongoose.Types.ObjectId(req.body.from);
    let to = mongoose.Types.ObjectId(req.body.to);

    Conversation.findOneAndUpdate(
        {
            recipients: {
                $all: [
                    { $elemMatch: { $eq: from } },
                    { $elemMatch: { $eq: to } },
                ],
            },
        },
        {
            recipients: [req.body.from, req.body.to],
            lastMessage: req.body.body,
            date: Date.now(),
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
        function (err, conversation) {
            // let form = new formidable.IncomingForm();
            // form.keepExtensions = true;
            // form.parse(req);
            // if (files.file) {
            //     appointment.file.data = fs.readFileSync(files.file.path);
            //     appointment.file.contentType = files.file.type;
            // }
            console.log(`🚀 > req`, req.body);

            if (err) {
                console.log(err);
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: "Failure" }));
                res.sendStatus(500);
            } else {
                let message = new Message({
                    conversation: conversation._id,
                    to: req.body.to,
                    from: req.body.from,
                    body: req.body.body,
                    file: req.body.file,
                    fileName: req.body.fileName,
                    fileType: req.body.fileType,
                });

                message.save((err) => {
                    if (err) {
                        console.log(err);
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify({ message: "Failure" }));
                        res.sendStatus(500);
                    } else {
                        res.setHeader("Content-Type", "application/json");
                        res.end(
                            JSON.stringify({
                                message: "Success",
                                conversationId: conversation._id,
                            })
                        );
                    }
                });
            }
        }
    );
};
