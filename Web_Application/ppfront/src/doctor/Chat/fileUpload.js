// import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
// import { isAuthenticated } from "../auth//index";
// import { uploaded } from "../doctorapi";
// import DefaultProfile from "../images/avatar.png";
// import { fileUpload } from "./doctorapi";

// class FileUpload extends Component {
//     constructor() {
//         super();
//         this.state = {
//             fileName: "",
//             fileType: "",
//             fileSize: 0,
//             loading: false,
//         };
//     }

//     init = (doctorId) => {
//         const token = isAuthenticated().token;

//         getdoctor(doctorId, token).then((data) => {
//             console.log(data);
//             if (data.error) {
//                 this.setState({
//                     redirectToProfile: true,
//                 });
//             } else {
//                 this.setState({
//                     id: data._id,
//                     fileName: data.fileName,
//                     fileSize: data.fileSize,
//                     fileType:data.fileType,
//                     error: "",
//                 });
//             }
//         });
//     };

//     componentDidMount() {
//         this.messageData = new FormData();
//         const messageId = this.props.match.params.messageId;
//         this.init(messageId);
//     }

//     isValid = () => {
//         const { fileSize } = this.state;
//         if (fileSize > 1000000) {
//             this.setState({
//                 error: "File size should be less than 1000kb",
//             });
//             return false;
//         }

//         return true;
//     };

//     handleChange = (name) => (event) => {
//         this.setState({
//             error: "",
//         });
//         const value =
//             name === "file" ? event.target.files[0] : event.target.value;
//         const fileSize = name === "file" ? event.target.files[0].size : 0;
//         this.messageData.set(name, value);
//         this.setState({ [name]: value, fileSize });
//     };
//     clickSubmit = (event) => {
//         event.preventDefault();
//         this.setState({
//             loading: true,
//         });
//         if (this.isValid()) {
//             const messageId= this.props.match.params.messageId;
//             const token = isAuthenticated().token;
//             uploaded(messageId, token, this.messageData).then((data) => {
//                 if (data.error) {
//                     console.log(data.error);
//                     this.setState({ error: data.error });
//                 } else {
//                     fileUpload(data, () => {
//                         this.setState({
//                             redirectToProfile: true,
//                         });
//                     });
//                 }
//             });
//         }
//     };
//     render() {
//         const {
//             id,
//             firstname,
//             lastname,
//             age,
//             phone,
//             designation,
//             email,
//             redirectToProfile,
//             error,
//             loading,
//         } = this.state;
//         if (redirectToProfile) {
//             return <Redirect to={`/doctor/profile/${id}`} />;
//         }
//         const photoUrl = id
//             ? `http://localhost:8080/doctor/photo/${id}`
//             : DefaultProfile;
//         return (
//             <div>
//                 <div class="row mt-5">
//                     <div class="col-md-6 m-auto">
//                         <div class="card card-body">
//                             <h1 class="text-center mb-3">
//                                 <i class="fas fa-user-edit"></i> Edit Profile
//                             </h1>
//                             <div
//                                 class="alert alert-danger
//                             alert-dismissible fade show"
//                                 role="alert"
//                                 style={{
//                                     display: this.state.error ? "" : "none",
//                                 }}
//                             >
//                                 {error}
//                                 <button
//                                     type="button"
//                                     class="close"
//                                     data-dismiss="alert"
//                                     aria-label="Close"
//                                 >
//                                     <span aria-hidden="true">&times;</span>
//                                 </button>
//                             </div>
//                             {loading ? (
//                                 <div className="jumbotron text-center">
//                                     <h2>Loading....</h2>
//                                 </div>
//                             ) : (
//                                 ""
//                             )}
//                             <img
//                                 style={{ height: "auto", width: "300px" }}
//                                 className="img-thumbnail"
//                                 src={photoUrl}
//                                 alt={firstname}
//                                 onError={(i) =>
//                                     (i.target.src = `${DefaultProfile}`)
//                                 }
//                             />
//                             <form action="/signup" method="POST">
//                                 <div class="form-group">
//                                     <label className="text-muted" for="photo">
//                                         Profile Photo
//                                     </label>
//                                     <input
//                                         onChange={this.handleChange("photo")}
//                                         type="file"
//                                         id="firstname"
//                                         accept="image/*"
//                                         class="form-control"
//                                     />
//                                     <label
//                                         className="text-muted"
//                                         for="firstname"
//                                     >
//                                         First Name
//                                     </label>
//                                     <input
//                                         onChange={this.handleChange(
//                                             "firstname"
//                                         )}
//                                         type="firstname"
//                                         id="firstname"
//                                         name="firstname"
//                                         class="form-control"
//                                         placeholder="Enter First Name"
//                                         value={firstname}
//                                     />
//                                 </div>
//                                 <div class="form-group">
//                                     <label
//                                         className="text-muted"
//                                         for="lastname"
//                                     >
//                                         Last Name
//                                     </label>
//                                     <input
//                                         onChange={this.handleChange("lastname")}
//                                         type="lastname"
//                                         id="lastname"
//                                         name="lastname"
//                                         class="form-control"
//                                         placeholder="Enter Last Name"
//                                         value={lastname}
//                                     />
//                                 </div>
//                                 <div class="form-group">
//                                     <label className="text-muted" for="age">
//                                         Age
//                                     </label>
//                                     <input
//                                         onChange={this.handleChange("age")}
//                                         type="age"
//                                         id="age"
//                                         name="age"
//                                         class="form-control"
//                                         placeholder="Enter Age"
//                                         value={age}
//                                     />
//                                 </div>

//                                 <div class="form-group">
//                                     <label className="text-muted" for="phone">
//                                         Phone
//                                     </label>
//                                     <input
//                                         onChange={this.handleChange("phone")}
//                                         type="phone"
//                                         id="phone"
//                                         name="phone"
//                                         class="form-control"
//                                         placeholder="Enter Phone"
//                                         value={phone}
//                                     />
//                                 </div>
//                                 <div class="form-group">
//                                     <label className="text-muted" for="age">
//                                         Designation
//                                     </label>
//                                     <input
//                                         onChange={this.handleChange(
//                                             "designation"
//                                         )}
//                                         type="designation"
//                                         id="designation"
//                                         name="designation"
//                                         class="form-control"
//                                         placeholder="Enter Age"
//                                         value={designation}
//                                     />
//                                 </div>
//                                 <div class="form-group">
//                                     <label className="text-muted" for="email">
//                                         Email
//                                     </label>
//                                     <input
//                                         onChange={this.handleChange("email")}
//                                         type="email"
//                                         id="email"
//                                         name="email"
//                                         class="form-control"
//                                         placeholder="Enter Email"
//                                         value={email}
//                                         disabled
//                                     />
//                                 </div>

//                                 <button
//                                     onClick={this.clickSubmit}
//                                     type="submit"
//                                     class="btn btn-primary btn-block"
//                                 >
//                                     Update Settings
//                                 </button>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
// }

// export default FileUpload;
