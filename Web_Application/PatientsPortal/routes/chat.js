var express = require("express");
//const { getFile } = require("filestack-js/build/main/lib/api/upload");
var {
    sendmessage,
    conversationquery,
    conversations,
    displayImage,
    sendmessage1,
    allmessages,
} = require("../controller/chat");
var router = express.Router();

router.get("/conversations", conversations);
router.get("/conversation/query/:sender/:reciever", conversationquery);
router.post("/sendmessage", sendmessage);
router.post("/sendmessage1", sendmessage1);
router.get("/image/:id", displayImage);
router.get("/allmessages", allmessages);

module.exports = router;
