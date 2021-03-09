// import React, { Component } from "react";
// import { Card } from "react-bootstrap";
// import { Link } from "react-router-dom";

// import { Layout } from "antd";
// import superAdminImage from "../../images/superAdmin.jpg";

// const { Header, Content, Footer } = Layout;

// class checkReport extends Component {
//   constructor() {
//     super();
//     this.state = {
//       doctors: [],
//       keyword: "",
//     };

//     console.log("CreateReport");
//   }

//   componentDidMount = () => {};

//   handleChange = (name) => (event) => {
//     this.setState({ error: " " });
//     this.setState({ [name]: event.target.value });
//   };

//   renderDoctors = (doctor) => {
//     return (
//       <div className="home-body">
//         <div className="container">
//           <h2>Choose template:</h2>
//           <div className="row p-3 justify-content-center">
//             <div className="col-md-4">
//               <div className="home-deck-card">
//                 <Link to={"/doctor/Reports/Report1"}>
//                   <Card.Img
//                     style={{ maxHeight: "180px", maxWidth: "100%" }}
//                     variant="top"
//                     src={superAdminImage}
//                   />
//                   <Card.Body>
//                     <Card.Title>Super Admin's Portal</Card.Title>
//                     <Card.Text>Hello admin.</Card.Text>
//                     <span class="btn btn-raised btn-primary ">
//                       Super Admin's Portal
//                     </span>
//                   </Card.Body>
//                 </Link>
//               </div>
//             </div>

//             <div className="col-md-4">
//               <div className="home-deck-card">
//                 <Link to={"/doctor/report/report-2"}>
//                   <Card.Img variant="top" src="" />
//                   <Card.Body>
//                     <Card.Title>Report 2</Card.Title>
//                     <Card.Text></Card.Text>
//                   </Card.Body>
//                 </Link>
//               </div>
//             </div>

//             <div className="col-md-4">
//               <div className="home-deck-card">
//                 <Link to={"/doctor/report/report-3"}>
//                   <Card.Img variant="top" />
//                   <Card.Body>
//                     <Card.Title>Report 3</Card.Title>
//                     <Card.Text></Card.Text>
//                   </Card.Body>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };
//   render() {
//     const { keyword } = this.state;
//     console.log(keyword);
//     const doctors = this.state.doctors.filter((doctor) => {
//       return doctor.firstname.toLowerCase().includes(keyword.toLowerCase());
//     });
//     console.log(doctors);
//     return (
//       <div>
//         <div className="container">
//           <h2 className=" mb-5">Reports</h2>
//           {this.renderDoctors(doctors)}
//         </div>
//       </div>
//     );
//   }
// }

// export default checkReport;
