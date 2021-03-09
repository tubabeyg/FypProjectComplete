import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated, signout } from "../auth/index";
import { remove } from "./apiPatient";

class DeletePatient extends Component {
    state = {
        redirect: false,
    };

    deleteAccount = () => {
        const token = isAuthenticated().token;
        const patientId = this.props.patientId;
        remove(patientId, token).then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                signout(() => console.log("user deleted"));

                this.setState({
                    redirect: true,
                });
            }
        });
    };

    deleteConfirmed = () => {
        let answer = window.confirm(
            "Are you sure you want to delete this account"
        );

        if (answer) {
            this.deleteAccount();
        }
    };
    render() {
        if (this.state.redirect) {
            return <Redirect to="/signin" />;
        }
        return (
            <button
                onClick={this.deleteConfirmed}
                className="btn btn-raised btn-danger m-5"
            >
                Delete Profile
            </button>
        );
    }
}

export default DeletePatient;
