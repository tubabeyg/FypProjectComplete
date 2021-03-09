import React, {Component} from "react"
import Menu from "../core/Menu"
import {singlePost, remove} from "./apiAppointment"
import {Link,  Redirect} from 'react-router-dom'
import DefaultProfile from '../images/avatar.png'
import  {isAuthenticated} from '../auth/index'

class SinglePost extends Component {

    state = {
        appointment: "",
        redirect: false
    }

    componentDidMount = () =>{
        const appointmentId = this.props.match.params.appointmentId
        singlePost(appointmentId).then(data=>{
            if(data.error){
                console.log(data.error)
            }
            else{
                this.setState({
                    appointment: data
                })
            }
        })
    }

    deleteAppointment = () =>{
        const appointmentId = this.props.match.params.appointmentId;
        const token = isAuthenticated().token
        remove(appointmentId,token).then(data =>{
            if(data.error){
                console.log(data.error)

            }else{
                this.setState({
                    redirect: true
                })
            
            }
        })

    }

    deleteConfirmed = () =>{
        let answer = window.confirm("Are you sure you want to delete this appointment");

        if (answer){
            this.deleteAppointment();
        }

    };
    renderAppointment = appointment => {
        const posterId = appointment.postedBy ? `/patient/${appointment.postedBy._id}`: ""
        const posterName = appointment.postedBy ? appointment.postedBy.firstname: " Unknown"

        return (
                <div class="card-body">
                    <img 
                        style={{height:"300px",width:"100", objectFit:"cover"}} 
                        className="img-thumbnail" 
                        src={`http://localhost:8080/appointment/photo/${appointment._id}`} 
                        onError={i =>(i.target.src = `${DefaultProfile}`)}
                        alt={appointment.title} 
                    />
                        <p class="card-text">{appointment.body}</p>
                        <br/>
                        <p className="font-italic mark">Posted by <Link to={`${posterId}`}>{posterName}{" "}</Link>
                        on {new Date(appointment.created).toDateString()}
                        </p>
                        <Link to={`/`} class="btn btn-raised btn-primary btn-sm mr-5">Back to Home</Link>
                        {isAuthenticated().patient && isAuthenticated().patient._id === appointment.postedBy._id &&
                        <>
                            <button onClick={this.deleteConfirmed} className="btn btn-raised btn-danger mr-5">
                                Delete
                            </button>
                            <button className="btn btn-raised btn-warning ">
                                Update Appointment
                            </button>
                        </>
                        }
                    </div>
    
        )
    }
    render(){
        if(this.state.redirect){
            return <Redirect to={"/"} />
        }
        const {appointment} = this.state
        return (
            <div>
                <div className="container">
                    <h2 className="display-2 mt-5 mb-5">{appointment.title}</h2>
                    {!appointment ?(
                        <div className="jumbotron text-center">
                            <h2>Loading....</h2>
                        </div>
                    ) : (
                        this.renderAppointment(appointment) 
                    )}
                    
                </div>
            </div>
        );
    }
}


export default SinglePost;