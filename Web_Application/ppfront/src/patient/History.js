import React, { Component } from 'react';
import { listByUser } from '../appointment/apiAppointment';
import { isAuthenticated } from "../auth/index";
import { read } from './apiPatient';

class History extends Component {
    constructor() {
        super();
        this.state = {
            patient: "",
            redirect: false,
            appointments: []
        };
    }


    init = patientId => {
        const token = isAuthenticated().token;

        read(patientId, token).then(data => {
            console.log(data)
            if (data.error) {
                this.setState({
                    redirect: true
                })
            } else {
                this.setState({
                    patient: data
                })
                this.loadApointments(data._id);
            }
        })
    }

    loadApointments = patientId => {
        const token = isAuthenticated().token
        listByUser(patientId, token).then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({
                    appointments: data
                })
            }
        })
    }

    componentDidMount() {
        const patientId = this.props.match.params.patientId;
        this.init(patientId)
    }

    componentWillReceiveProps(props) {
        const patientId = props.match.params.patientId;
        this.init(patientId)
    }
    render() {
        const { appointments } = this.state
        return (
            <div>
                <div className="container">
                    <h2 className="mt-5 mb-5">
                        {!appointments.length ? "Loading..." : "Recent Appointments"}
                    </h2>
                    {JSON.stringify(appointments)}
                </div>
            </div>
        );
    }
}


export default History;