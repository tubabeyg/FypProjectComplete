var createError = require("http-errors");
var cors = require("cors");
var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var authRouter = require("./routes/auth");
var dotenv = require("dotenv");
dotenv.config();
var cors = require("cors");
var appointmentRouter = require("./routes/appointment");
var logger = require("morgan");
const expressValidator = require("express-validator");
var authRouter = require("./routes/auth");
var dotenv = require("dotenv");
dotenv.config();
var cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const crypto = require("crypto");
const bodyParser = require("body-parser");
var chatRouter = require("./routes/chat");
var appointmentRouter = require("./routes/appointment");
var patientRouter = require("./routes/patient");
var hospitalRouter = require("./routes/hospital");
var doctorRouter = require("./routes/doctor");
var superAdminRouter = require("./routes/superAdmin");
var reportRouter = require("./routes/report");
var pathRouter = require("./routes/pathreport");
var radRouter = require("./routes/radreport");

var fs = require("fs");

var app = express();

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected"))
    .catch((err) => console.log(err));

mongoose.connection.on("error", (err) => {
    console.log("DB Connection error :" + err.message);
});
const MONGO_URI =
    "mongodb://talha123:talha123@radiology-shard-00-00.bsp2s.mongodb.net:27017,radiology-shard-00-01.bsp2s.mongodb.net:27017,radiology-shard-00-02.bsp2s.mongodb.net:27017/admindb?ssl=true&replicaSet=atlas-qwyx44-shard-0&authSource=admin&retryWrites=true&w=majority";

//Middleware
// @route GET /
// @desc Loads form
// app.get("/", (req, res) => {
//     gfs.files.find().toArray((err, files) => {
//         // Check if files
//         if (!files || files.length === 0) {
//             res.render("index", { files: false });
//         } else {
//             files.map((file) => {
//                 if (
//                     file.contentType === "image/jpeg" ||
//                     file.contentType === "image/png"
//                 ) {
//                     file.isImage = true;
//                 } else {
//                     file.isImage = false;
//                 }
//             });
//             res.render("index", { files: files });
//         }
//     });
// });

// // @route POST /upload
// // @desc  Uploads file to DB
// app.post("/upload", upload.single("file"), (req, res) => {
//     // res.json({ file: req.file });
//     res.redirect("/");
// });

// // @route GET /files
// // @desc  Display all files in JSON
// app.get("/files", (req, res) => {
//     gfs.files.find().toArray((err, files) => {
//         // Check if files
//         if (!files || files.length === 0) {
//             return res.status(404).json({
//                 err: "No files exist",
//             });
//         }

//         // Files exist
//         return res.json(files);
//     });
// });

// // @route GET /files/:filename
// // @desc  Display single file object
// app.get("/files/:filename", (req, res) => {
//     gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//         // Check if file
//         if (!file || file.length === 0) {
//             return res.status(404).json({
//                 err: "No file exists",
//             });
//         }
//         // File exists
//         return res.json(file);
//     });
// });

// // @route GET /image/:filename
// // @desc Display Image
// app.get("/image/:filename", (req, res) => {
//     gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//         // Check if file
//         if (!file || file.length === 0) {
//             return res.status(404).json({
//                 err: "No file exists",
//             });
//         }

//         // Check if image
//         if (
//             file.contentType === "image/jpeg" ||
//             file.contentType === "image/png"
//         ) {
//             // Read output to browser
//             const readstream = gfs.createReadStream(file.filename);
//             readstream.pipe(res);
//         } else {
//             res.status(404).json({
//                 err: "Not an image",
//             });
//         }
//     });
// });

// // @route DELETE /files/:id
// // @desc  Delete file
// app.delete("/files/:id", (req, res) => {
//     gfs.remove({ _id: req.params.id, root: "uploads" }, (err, gridStore) => {
//         if (err) {
//             return res.status(404).json({ err: err });
//         }

//         res.redirect("/");
//     });
// });
// app.get("/", (req, res) => {
//     fs.readFile("./docs/apiDocs.json", (err, data) => {
//         if (err) {
//             res.status(400).json({
//                 error: err,
//             });
//         }
//         var docs = JSON.parse(data);
//         res.json(docs);
//     });
// });

// view engine setup
app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "jade");
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
// app.use(methodOverride(_method));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(expressValidator());
app.use("/", appointmentRouter);
app.use("/", authRouter);
app.use("/", patientRouter);
app.use("/hospital", hospitalRouter);
app.use("/doctor", doctorRouter);
app.use("/superAdmin", superAdminRouter);
app.use("/report", reportRouter);
app.use("/pathreport", pathRouter);
app.use("/radreport", radRouter);

app.use("/chat", chatRouter);
app.use(cors());
app.use(function (err, req, res, next) {
    if (err.name === "UnauthorizedError") {
        res.status(401).json({
            error: "Unauthorized",
        });
    }
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// app.post("/upload", (req, res) => {
//     if (req.files === null) {
//         return res.status(400).json({ msg: "No file was uploaded." });
//     }
//     const file = req.files.file;
//     file.mv("${__dirname}/ppfront/public/assets/${file.name)", (err) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).send(err);
//         }
//         res.json({ fileName: file.name, filePath: "/assets/ ${file.name}" });
//     });
// });
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
