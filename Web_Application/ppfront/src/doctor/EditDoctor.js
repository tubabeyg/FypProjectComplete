import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth//index";
import DefaultProfile from "../images/avatar.png";
import { getdoctor, updated, updateDoctor } from "./doctorapi";

class EditDoctor extends Component {
    constructor() {
        super();
        this.state = {
            id: "",
            firstname: "",
            lastname: "",
            phone: "",
            designation: "",
            password: "",
            age: "",
            email: "",
            redirectToProfile: false,
            error: "",
            fileSize: 0,
            loading: false,
        };
    }

    init = (doctorId) => {
        const token = isAuthenticated().token;

        getdoctor(doctorId, token).then((data) => {
            console.log(data);
            if (data.error) {
                this.setState({
                    redirectToProfile: true,
                });
            } else {
                this.setState({
                    id: data._id,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    phone: data.phone,
                    designation: data.designation,
                    password: data.password,
                    age: data.age,
                    email: data.email,
                    error: "",
                });
            }
        });
    };

    componentDidMount() {
        this.doctorData = new FormData();
        const doctorId = this.props.match.params.doctorId;
        this.init(doctorId);
    }

    isValid = () => {
        const {
            firstname,
            lastname,
            phone,
            designation,
            email,
            fileSize,
        } = this.state;
        if (fileSize > 1000000) {
            this.setState({
                error: "File size should be less than 1000kb",
            });
            return false;
        }
        if (firstname.length === 0) {
            this.setState({
                error: "First name is required",
            });
            console.log(this.error);
            return false;
        }

        if (phone.length <= 1 && phone.length >= 11) {
            this.setState({
                error: "Enter a valid phone number",
            });
            console.log(this.error);
            return false;
        }
        if (designation.length === 0) {
            this.setState({
                error: "Designation is required",
            });
            console.log(this.error);
            return false;
        }

        if (lastname.length === 0) {
            this.setState({
                error: "Last name is required",
            });
            console.log(this.error);
            return false;
        }
        if (!/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/.test(email)) {
            this.setState({
                error: "Valid email is required",
            });
            console.log(this.error);
            return false;
        }

        return true;
    };

    handleChange = (name) => (event) => {
        this.setState({
            error: "",
        });
        const value =
            name === "photo" ? event.target.files[0] : event.target.value;
        const fileSize = name === "photo" ? event.target.files[0].size : 0;
        this.doctorData.set(name, value);
        this.setState({ [name]: value, fileSize });
    };
    clickSubmit = (event) => {
        event.preventDefault();
        this.setState({
            loading: true,
        });
        if (this.isValid()) {
            const doctorId = this.props.match.params.doctorId;
            const token = isAuthenticated().token;
            updated(doctorId, token, this.doctorData).then((data) => {
                if (data.error) {
                    console.log(data.error);
                    this.setState({ error: data.error });
                } else {
                    updateDoctor(data, () => {
                        this.setState({
                            redirectToProfile: true,
                        });
                    });
                }
            });
        }
    };
    render() {
        const {
            id,
            firstname,
            lastname,
            age,
            phone,
            designation,
            email,
            redirectToProfile,
            error,
            loading,
        } = this.state;
        if (redirectToProfile) {
            return <Redirect to={`/doctor/profile/${id}`} />;
        }
        const photoUrl = id
            ? `http://localhost:8080/doctor/photo/${id}`
            : DefaultProfile;

        return (
            <div class="row my-5">
                <div class="col-md-4 m-auto doctor-dibba">
                    <h2 className="mb-3 text-center">
                        <i className="fas fa-user-edit text-info mr-2" />
                        Edit Profile
                        {this.state.loading && (
                            <i className="fa fa-circle-notch fa-spin ml-2" />
                        )}
                    </h2>
                    <div
                        class="alert alert-danger alert-dismissible fade show"
                        role="alert"
                        style={{
                            display: this.state.error ? "" : "none",
                        }}
                    >
                        {error}
                        <button
                            type="button"
                            class="close"
                            data-dismiss="alert"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div
                        className="d-flex align-items-center"
                        style={{
                            height: "200px",
                            width: "200px",
                            margin: "auto",
                            borderRadius: "50%",
                            overflow: "hidden",
                        }}
                    >
                        <img
                            style={{
                                width: "200px",
                            }}
                            src={photoUrl}
                            onError={(i) =>
                                (i.target.src = `${DefaultProfile}`)
                            }
                            alt={firstname}
                        />
                    </div>

                    <form action="/signup" method="POST">
                        <div class="form-group">
                            <label className="text-muted mb-0" for="photo">
                                Profile Photo
                            </label>
                            <input
                                onChange={this.handleChange("photo")}
                                type="file"
                                id="firstname"
                                accept="image/*"
                                class="form-control"
                            />
                        </div>

                        <div class="form-group">
                            <label className="text-muted mb-0" for="firstname">
                                First Name
                            </label>
                            <input
                                onChange={this.handleChange("firstname")}
                                type="firstname"
                                id="firstname"
                                name="firstname"
                                class="form-control"
                                placeholder="Enter first name"
                                value={firstname}
                            />
                        </div>

                        <div class="form-group">
                            <label className="text-muted mb-0" for="lastname">
                                Last Name
                            </label>
                            <input
                                onChange={this.handleChange("lastname")}
                                type="lastname"
                                id="lastname"
                                name="lastname"
                                class="form-control"
                                placeholder="Enter last name"
                                value={lastname}
                            />
                        </div>

                        <div class="form-group">
                            <label className="text-muted mb-0" for="age">
                                Age
                            </label>
                            <input
                                onChange={this.handleChange("age")}
                                type="age"
                                id="age"
                                name="age"
                                class="form-control"
                                placeholder="Enter age"
                                value={age}
                            />
                        </div>

                        <div class="form-group">
                            <label className="text-muted mb-0" for="phone">
                                Mobile
                            </label>
                            <input
                                onChange={this.handleChange("phone")}
                                type="phone"
                                id="phone"
                                name="phone"
                                class="form-control"
                                placeholder="Enter mobile"
                                minLength="11"
                                maxLength="11"
                                value={phone}
                            />
                        </div>

                        <div class="form-group">
                            <label className="text-muted mb-0" for="age">
                                Designation
                            </label>
                            <input
                                onChange={this.handleChange("designation")}
                                type="designation"
                                id="designation"
                                name="designation"
                                class="form-control"
                                placeholder="Enter designation"
                                value={designation}
                            />
                        </div>

                        <div class="form-group">
                            <label className="text-muted mb-0" for="email">
                                Email
                            </label>
                            <input
                                onChange={this.handleChange("email")}
                                type="email"
                                id="email"
                                name="email"
                                class="form-control"
                                placeholder="Enter email"
                                value={email}
                                disabled
                            />
                        </div>

                        <button
                            onClick={this.clickSubmit}
                            type="submit"
                            class="btn btn-primary"
                        >
                            {this.state.loading && (
                                <i className="fa fa-circle-notch fa-spin mr-2" />
                            )}
                            Update
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default EditDoctor;
