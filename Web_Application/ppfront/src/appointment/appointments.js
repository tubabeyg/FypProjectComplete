import React, { Component} from 'react';
import {list} from './apiAppointment';
import DefaultProfile from '../images/avatar.png'
import {Link} from 'react-router-dom'
class Appointments extends Component{
    constructor(){
        super();
        this.state={
            appointments:[]
        }
    }

    componentDidMount = ()=>{
        list().then(data => {
            if(data.error){
                console.log(data.error);
            } else {
                this.setState({
                    appointments:data
                })
            }
        })
    }
    renderAppointments = appointments => {
        return <div className="row">
        {
            appointments.map((appointment, i)=>{

                const posterId = appointment.postedBy ? `/patient/${appointment.postedBy._id}`: ""
                const posterName = appointment.postedBy ? appointment.postedBy.firstname: " Unknown"

                return <div class="card col-md-4" key={i}>
                <img 
                    style={{height:"300px",width:"auto"}} 
                    className="img-thumbnail" 
                    src={`http://localhost:8080/appointment/photo/${appointment._id}`} 
                    onError={i =>(i.target.src = `${DefaultProfile}`)}
                    alt={appointment.title} 
                />
                    <div class="card-body">
                        <h5 class="card-title">{appointment.title}</h5>
                        <p class="card-text">{appointment.body.substring(0,100)}</p>
                        <br/>
                        <p className="font-italic mark">Posted by <Link to={`${posterId}`}>{posterName}{" "}</Link>
                        on {new Date(appointment.created).toDateString()}
                        </p>
                        <Link to={`/appointment/${appointment._id}`} class="btn btn-raised btn-primary ">Read More</Link>
                    </div>
                </div>
            })
        }
        </div>
    }
    render(){
        const {appointments} = this.state
        return (
            <div>
                <div className="container">
                    <h2 className="mt-5 mb-5">
                        {!appointments.length ? "Loading...":"Recent Appointments"}
                    </h2>
                    {this.renderAppointments(appointments) }
                </div>
            </div>
        );
    }
}

export default Appointments;