import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import commonUtilites from "../Utilities/common";


const useStyles = makeStyles((theme) => ({
  subheader: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  globe: {
    backgroundColor: theme.palette.primary.dark,
  },
  subheaderText: {
    color: theme.palette.primary.dark,
  },
  list: {
    maxHeight: "calc(100vh - 112px)",
    overflowY: "auto",
  },
}));

const Conversations = (props) => {
  const classes = useStyles();
  const [conversations] = useState([]);
  
  // Returns the recipient name that does not
  // belong to the current user.
  const handleRecipient = (recipients) => {
    // for (let i = 0; i < recipients.length; i++) {
    //   if (
    //     recipients[i].username !==
    //     authenticationService.currentUserValue.username
    //   ) {
    //     return recipients[i];
    //   }
    // }
    // return null;
  };

  
  return (
    <List className={classes.list}>
      {/* <ListItem
        classes={{ root: classes.subheader }}
        onClick={() => {
          props.setScope("Global Chat");
        }}
      >
        <ListItemAvatar>
          <Avatar className={classes.globe}>
            <LanguageIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText className={classes.subheaderText} primary="Global Chat" />
      </ListItem> */}
      <Divider />

      {conversations && (
        <React.Fragment>
          {conversations.map((c) => (
            <ListItem
              className={classes.listItem}
              key={c._id}
              button
              onClick={() => {
                props.setUser(handleRecipient(c.recipientObj));
                props.setScope(handleRecipient(c.recipientObj).name);
              }}
            >
              <ListItemAvatar>
                <Avatar>
                  {commonUtilites.getInitialsFromName(
                    handleRecipient(c.recipientObj).name
                  )}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={handleRecipient(c.recipientObj).name}
                secondary={<React.Fragment>{c.lastMessage}</React.Fragment>}
              />
            </ListItem>
          ))}
        </React.Fragment>
      )}
    </List>
  );
};

export default Conversations;
