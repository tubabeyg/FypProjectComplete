import { PaperClipOutlined } from "@ant-design/icons";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import SendIcon from "@material-ui/icons/Send";
import axios from "axios";
import classnames from "classnames";
import { get } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";
import commonUtilites from "../Utilities/common";
import { getmessages, sendmessage } from "./../Reports/pathreportapi";
const useStyles = makeStyles((theme) => ({
    root: {
        height: "100%",
        color: "#000080",
    },
    headerRow: {
        maxHeight: 60,
        zIndex: 5,
    },
    paper: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: theme.palette.primary.light,
    },
    messageContainer: {
        height: "100%",
        display: "flex",
        alignContent: "flex-end",
    },
    messagesRow: {
        maxHeight: "calc(100vh - 184px)",
        overflowY: "auto",
    },
    newMessageRow: {
        width: "100%",
        padding: theme.spacing(0, 2, 1),
    },
    messageBubble: {
        padding: 10,
        border: "1px solid white",
        backgroundColor: "white",
        borderRadius: "0 10px 10px 10px",
        boxShadow: "-3px 4px 4px 0px rgba(0,0,0,0.08)",
        marginTop: 8,
        maxWidth: "40em",
    },
    messageBubbleRight: {
        borderRadius: "10px 0 10px 10px",
    },
    inputRow: {
        display: "flex",
        alignItems: "flex-end",
    },
    form: {
        width: "100%",
    },
    avatar: {
        margin: theme.spacing(1, 1.5),
    },
    listItem: {
        display: "flex",
        width: "100%",
    },
    listItemRight: {
        flexDirection: "row-reverse",
    },
}));

const ChatBox = (props) => {
    const [currentUserId] = useState(localStorage.getItem("doctor_id"));
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [show, setShow] = useState(false);
    const [src, setSrc] = useState("");

    let chatBottom = useRef(null);
    const classes = useStyles();

    useEffect(() => {
     
        loadmessages();
        scrollToBottom();

        // eslint-disable-next-line
    }, [props.scope, props.conversationId]);

    const handleClose = () => setShow(false);

    const handleShow = () => setShow(true);

    const loadmessages = () => {
        if (props.scope === "Global Chat") {
            setMessages([]);
        } else {
            const message = {
                reciever: props.user._id,
                sender: localStorage.getItem("doctor_id"),
            };
            getmessages(message).then((data) => {
                console.log(data);
                if (data.error) {
                    //this.setState({ error: data.error });
                    console.log(data.error);
                } else {
                    setMessages(data);
                    console.log(data);
                    setNewMessage("");
                }
            });
        }
    };

    const handleUpload = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        const fileName = event.target.files[0].name;
        const fileSize = event.target.files[0].size;
        const fileType = event.target.files[0].type;

        const uploadImg = new FormData();
        uploadImg.append("file", file);

        const message = new FormData();
        message.append("fileName", fileName);
        message.append("fileType", fileType);
        message.append("conversation", "");
        message.append("to", props.user._id);
        message.append("from", localStorage.getItem("doctor_id"));
        message.append("body", "(upload)");
        message.append("date", new Date());

        var endpoint = "https://dev.g2gwireless.com/api/v1/uploadfyp/fyp";
        axios.post(endpoint, uploadImg).then((res) => {
            console.log(res.statusText);
            console.log(`🚀 > axios.post > res.data`, res.data);

            if (get(res, "data.data")) {
                const message = {
                    conversation: "",
                    to: props.user._id,
                    from: localStorage.getItem("doctor_id"),
                    date: new Date(),
                    body: "https://dev.g2gwireless.com/".concat(res.data.data),
                    fileName,
                    fileType,
                };

                sendNewMessageRequest(message);
            }
        });
    };

    const scrollToBottom = () => {
        chatBottom.current.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!newMessage) {
            return;
        }

        const message = {
            conversation: "",
            to: props.user._id,
            from: localStorage.getItem("doctor_id"),
            body: newMessage,
            date: new Date(),
            file: null,
            fileName: "text",
            fileType: "text",
        };

        sendNewMessageRequest(message);
    };

    const sendNewMessageRequest = (message) => {
        sendmessage(message).then((data) => {
            if (!data || get(data, "error")) {
                //this.setState({ error: data.error });
            } else {
                setMessages([...messages, message]);
                setNewMessage("");
            }
            loadmessages();
        });
    };
    const handleFileChange = (event) => {
        if (event.target.files.length) {
            const file = event.target.files[0];
            const fileName = event.target.files[0].name;
            // const fileSize = event.target.files[0].size;
            const fileType = event.target.files[0].type;
            // this.appointmentData.set(name, value);

            const message = {
                conversation: "",
                to: props.user._id,
                from: localStorage.getItem("doctor_id"),
                date: new Date(),
                body: "Show me not",
                file: file,
                file1: file,
                fileName: fileName,
                fileType: fileType,
            };
          
            console.log(message);
            sendmessage(message).then((data) => {
                if (data.error) {
                    //this.setState({ error: data.error });
                } else {
                    setMessages([...messages, message]);
                    setNewMessage("");
                }
            });
        }
        loadmessages();
    };
    const imageClick = (i) => {
        console.log("Click", i);
        setSrc(i);
        handleShow();
    };
    return (
        <Grid container className={classes.root}>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Image
                        className="cover-image-deal"
                        width="100%"
                        height="auto"
                        src={src}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Grid item xs={12} className={classes.headerRow}>
                <Paper className={classes.paper} square elevation={2}>
                    <Typography color="inherit" variant="h6">
                        {props.scope}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Grid container className={classes.messageContainer}>
                    <Grid item xs={12} className={classes.messagesRow}>
                        {messages && (
                            <List>
                                {messages.map((m) => (
                                    <ListItem
                                        key={m._id}
                                        className={classnames(
                                            classes.listItem,
                                            {
                                                [`${classes.listItemRight}`]:
                                                    m.from === currentUserId,
                                            }
                                        )}
                                        alignItems="flex-start"
                                    >
                                        <ListItemAvatar
                                            className={classes.avatar}
                                        >
                                            <Avatar>
                                                {commonUtilites.getInitialsFromName(
                                                    props.user.email
                                                )}
                                            </Avatar>
                                        </ListItemAvatar>
                                        {m.fileType === "text" ? (
                                            <ListItemText
                                                classes={{
                                                    root: classnames(
                                                        classes.messageBubble,
                                                        {
                                                            [`${classes.messageBubbleRight}`]:
                                                                m.to ===
                                                                currentUserId,
                                                        }
                                                    ),
                                                }}
                                                primary={m.body}
                                                secondary={
                                                    m.from === currentUserId
                                                        ? ""
                                                        : props.scope
                                                }
                                            />
                                        ) : m?.fileType?.includes("image/") ? (
                                            <Image
                                                className="cover-image-deal"
                                                width="300px"
                                                height="auto"
                                                src={m.body}
                                                onClick={() =>
                                                    imageClick(m.body)
                                                }
                                            />
                                        ) : (
                                            <a
                                                className="d-flex flex-column align-items-center"
                                                href={m.body}
                                                target="_blank"
                                            >
                                                <i class="fa fa-file fa-5x text-muted"></i>
                                                {m.fileName}
                                            </a>
                                        )}
                                    </ListItem>
                                ))}
                            </List>
                        )}
                        <div ref={chatBottom} />
                    </Grid>
                    <form
                        action="/upload"
                        method="POST"
                        encType="multipart/form-data"
                        onSubmit={handleSubmit}
                        className="d-flex w-100 mx-3"
                    >
                        <Grid item xs={10}>
                            <TextField
                                id="message"
                                label="Message"
                                variant="outlined"
                                margin="dense"
                                fullWidth
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton>
                                <PaperClipOutlined
                                    onClick={(e) =>
                                        document.getElementById("file").click()
                                    }
                                />
                                <input
                                    onChange={handleUpload}
                                    type="file"
                                    id="file"
                                    name="file"
                                    className="d-none"
                                />
                            </IconButton>

                            <IconButton type="submit">
                                <SendIcon />
                            </IconButton>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ChatBox;
