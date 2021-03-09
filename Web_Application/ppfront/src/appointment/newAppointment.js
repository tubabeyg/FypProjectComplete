import React, { Component } from "react";
import { isAuthenticated } from "../auth//index";
import Menu from "../core/Menu";
import { create } from "./apiAppointment";

class NewAppointment extends Component {
    constructor() {
        super();
        this.state = {
            title: "",
            body: "",
            photo: "",
            error: "",
            patient: {},
            fileSize: 0,
            loading: false,
        };
    }

    componentDidMount() {
        this.appointmentData = new FormData();
        this.setState({
            patient: isAuthenticated().patient,
        });
    }

    isValid = () => {
        const { title, body, fileSize } = this.state;
        if (fileSize > 100000) {
            this.setState({
                error: "File size should be less than 100kb",
            });
            return false;
        }
        if (title.length === 0) {
            this.setState({
                error: "Title is required",
            });
            console.log(this.error);
            return false;
        }

        if (body.length === 0) {
            this.setState({
                error: "Body is required",
            });
            console.log(this.error);
            return false;
        }
        if (title.length === 0 || body.length === 0) {
            this.setState({
                error: "All feild are required",
            });
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
        this.appointmentData.set(name, value);
        this.setState({ [name]: value, fileSize });
    };
    clickSubmit = (event) => {
        event.preventDefault();
        this.setState({
            loading: true,
        });
        if (this.isValid()) {
            const patientId = isAuthenticated().patient._id;
            const token = isAuthenticated().token;
            console.log(patientId, token);
            create(
                patientId,
                this.props.match.params.doctorId,
                token,
                this.appointmentData
            ).then((data) => {
                if (data.error) {
                    console.log(data.error);
                    this.setState({ error: data.error });
                } else {
                    this.setState({
                        loading: false,
                        title: "",
                        body: "",
                        photo: "",
                    });

                    console.log("new appointment :", data);
                }
            });
        }
    };
    render() {
        const { title, body, photo, patient, error, loading } = this.state;
        // if(redirectToProfile){
        //     return <Redirect to={`/patient/${id}`} />
        // }
        // const photoUrl = id ? `http://localhost:8080/patient/photo/${id}` : DefaultProfile;
        return (
            <div>
                <Menu />
                <div class="row mt-5">
                    <div class="col-md-6 m-auto">
                        <div class="card card-body">
                            <h1 class="text-center mb-3">
                                <i class="fas fa-user-edit"></i> Create
                                Appointment
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
                            {/* <img style={{height:"auto",width:"300px"}} className="img-thumbnail" src={photoUrl} alt={firstname} /> */}
                            <form action="/signup" method="POST">
                                <div class="form-group">
                                    {/* <label className="text-muted" for="photo">Photo</label>
                                    <input
                                        onChange={this.handleChange("photo")}
                                        type="file"
                                        id="photo"
                                        accept="image/*"
                                        class="form-control"
                                    /> */}
                                    <label className="text-muted" for="title">
                                        Title
                                    </label>
                                    <input
                                        onChange={this.handleChange("title")}
                                        type="title"
                                        id="title"
                                        name="title"
                                        class="form-control"
                                        placeholder="Enter Title"
                                        value={title}
                                    />
                                </div>
                                <div class="form-group">
                                    <label className="text-muted" for="body">
                                        Description
                                    </label>
                                    <textarea
                                        onChange={this.handleChange("body")}
                                        type="body"
                                        id="body"
                                        name="body"
                                        class="form-control"
                                        placeholder="Enter Description"
                                        value={body}
                                    />
                                </div>

                                <button
                                    onClick={this.clickSubmit}
                                    type="submit"
                                    class="btn btn-primary btn-block"
                                >
                                    Create
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NewAppointment;
