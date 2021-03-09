import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import React from "react";
import ChatBox from "./Chat/ChatBox";
import Conversations from "./Chat/Conversations";
import { getUsersDropdowndoctors } from "./Reports/pathreportapi";
import commonUtilites from "./Utilities/common";

class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            allDoctors: [],
            scope: "Global Chat",
            tab: 1,
            user: null,
            src: "https://homepages.cae.wisc.edu/~ece533/images/airplane.png",
        };
    }
    componentDidMount() {
        getUsersDropdowndoctors().then((res) => {
            this.setState({ allDoctors: res.results });
        });
    }
    handleChange = (e, newVal) => {
        this.setState({ tab: newVal });
    };

    render() {
        return (
            <React.Fragment>
                <Grid container>
                    <Grid item md={4}>
                        <Paper square elevation={5}>
                            <Paper square>
                                {/* <Image className="cover-image-deal"
              width={150} height={200}
              src={`http://localhost:8080/chat/image/5fda8848d8cb660e2cf99bf6`} roundedCircle/> */}
                            </Paper>
                            <Paper square>
                                <Tabs
                                    onChange={this.handleChange}
                                    variant="fullWidth"
                                    value={this.state.tab}
                                    indicatorColor="primary"
                                    textColor="primary"
                                >
                                    <Tab label="Doctors" />
                                </Tabs>
                            </Paper>
                            {this.state.tab === 0 && (
                                <Conversations
                                    setUser={this.state.user}
                                    setScope={this.state.scope}
                                />
                            )}

                            <List
                                style={{
                                    maxHeight: "calc(100vh - 112px)",
                                    overflowY: "auto",
                                }}
                            >
                                {this.state.allDoctors.map((u) => (
                                    <ListItem
                                        key={u._id}
                                        onClick={() => {
                                            this.setState({ user: u });
                                            this.setState({ scope: u.email });
                                        }}
                                        style={{
                                            color: "black",
                                        }}
                                        button
                                    >
                                        <ListItemAvatar>
                                            <Avatar>
                                                {commonUtilites.getInitialsFromName(
                                                    u.firstname
                                                )}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    type="body2"
                                                    style={{ color: "black" }}
                                                >
                                                    {u.email}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item md={8}>
                        {this.state.scope !== "Global Chat" &&
                            this.state.tab === 1 && (
                                <ChatBox
                                    scope={this.state.scope}
                                    user={this.state.user}
                                />
                            )}
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

export default Chat;
