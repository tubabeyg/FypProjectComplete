import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth//index";
import DefaultProfile from "../images/avatar.png";
import { read, update, updatePatient } from "./apiPatient";
class EditPatient extends Component {
    constructor() {
        super();
        this.state = {
            id: "",
            firstname: "",
            lastname: "",
            phone: "",
            password: "",
            age: "",
            email: "",
            redirectToProfile: false,
            error: "",
            fileSize: 0,
            loading: false,
        };
    }

    init = (patientId) => {
        const token = isAuthenticated().token;

        read(patientId, token).then((data) => {
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
                    password: data.password,
                    age: data.age,
                    email: data.email,
                    error: "",
                });
            }
        });
    };

    componentDidMount() {
        console.log("Hhhhhh");
        this.patientData = new FormData();
        const patientId = this.props.match.params.id;
        this.init(patientId);
    }

    isValid = () => {
        const { firstname, lastname, phone, email, fileSize } = this.state;
        if (fileSize > 100000) {
            this.setState({
                error: "File size should be less than 100kb",
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

        // if (phone.length >= 1 && phone.length <= 11) {
        //     this.setState({
        //         error: "Enter a valid phone number",
        //     });
        //     console.log(this.error);
        //     return false;
        // }

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
        this.patientData.set(name, value);
        this.setState({ [name]: value, fileSize });
    };
    clickSubmit = (event) => {
        event.preventDefault();
        this.setState({
            loading: true,
        });
        if (this.isValid()) {
            const patientId = this.props.match.params.id;
            const token = isAuthenticated().token;
            console.log(patientId, token);
            update(patientId, token, this.patientData).then((data) => {
                if (data.error) {
                    console.log(data.error);
                    this.setState({ error: data.error });
                } else {
                    updatePatient(data, () => {
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
            email,
            redirectToProfile,
            error,
            loading,
        } = this.state;
        if (redirectToProfile) {
            return <Redirect to={`/patient/${id}`} />;
        }
        const photoUrl = id
            ? `http://localhost:8080/patient/photo/${id}`
            : DefaultProfile;
        return (
            <div>
                <div class="row mt-5">
                    <div class="col-md-6 m-auto">
                        <div class="card card-body">
                            <h1 class="text-center mb-3">
                                <i class="fas fa-user-edit"></i> Edit Profile
                            </h1>
                            <div
                                class="alert alert-danger 
                            alert-dismissible fade show"
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
                            {loading ? (
                                <div className="jumbotron text-center">
                                    <h2>Loading....</h2>
                                </div>
                            ) : (
                                ""
                            )}
                            <img
                                style={{ height: "auto", width: "300px" }}
                                className="img-thumbnail"
                                src={photoUrl}
                                alt={firstname}
                            />
                            <form action="/signup" method="POST">
                                <div class="form-group">
                                    <label className="text-muted" for="photo">
                                        Profile Photo
                                    </label>
                                    <input
                                        onChange={this.handleChange("photo")}
                                        type="file"
                                        id="firstname"
                                        accept="image/*"
                                        class="form-control"
                                    />
                                    <label
                                        className="text-muted"
                                        for="firstname"
                                    >
                                        First Name
                                    </label>
                                    <input
                                        onChange={this.handleChange(
                                            "firstname"
                                        )}
                                        type="firstname"
                                        id="firstname"
                                        name="firstname"
                                        class="form-control"
                                        placeholder="Enter First Name"
                                        value={firstname}
                                    />
                                </div>
                                <div class="form-group">
                                    <label
                                        className="text-muted"
                                        for="lastname"
                                    >
                                        Last Name
                                    </label>
                                    <input
                                        onChange={this.handleChange("lastname")}
                                        type="lastname"
                                        id="lastname"
                                        name="lastname"
                                        class="form-control"
                                        placeholder="Enter Last Name"
                                        value={lastname}
                                    />
                                </div>
                                <div class="form-group">
                                    <label className="text-muted" for="age">
                                        Age
                                    </label>
                                    <input
                                        onChange={this.handleChange("age")}
                                        type="age"
                                        id="age"
                                        name="age"
                                        class="form-control"
                                        placeholder="Enter Age"
                                        value={age}
                                    />
                                </div>

                                <div class="form-group">
                                    <label className="text-muted" for="phone">
                                        Phone
                                    </label>
                                    <input
                                        onChange={this.handleChange("phone")}
                                        type="phone"
                                        id="phone"
                                        name="phone"
                                        class="form-control"
                                        placeholder="Enter Phone"
                                        value={phone}
                                    />
                                </div>
                                <div class="form-group">
                                    <label className="text-muted" for="email">
                                        Email
                                    </label>
                                    <input
                                        onChange={this.handleChange("email")}
                                        type="email"
                                        id="email"
                                        name="email"
                                        class="form-control"
                                        placeholder="Enter Email"
                                        value={email}
                                    />
                                </div>

                                <button
                                    onClick={this.clickSubmit}
                                    type="submit"
                                    class="btn btn-primary btn-block"
                                >
                                    Update
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EditPatient;
