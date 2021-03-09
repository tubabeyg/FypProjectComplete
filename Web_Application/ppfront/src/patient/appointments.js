import React, { Component } from 'react';
import { isAuthenticated } from "../auth";
import { userapps } from './apiPatient';

class appointments extends Component {
    constructor() {
        super();
        this.state = {
            patients: []
        }
    }

    componentDidMount = () => {
        userapps(isAuthenticated().patient._id).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                console.log(data)
                this.setState({
                    patients: data
                })
            }
        })
    }
    renderPatients = patient => {
        return <div className="row">
            {
                patient?.map((patient, i) => {
                    return <div class="card col-md-4" key={i}>
                        <div class="card-body">
                            <h5 class="card-title">{patient.title}</h5>
                            <p class="card-text">{patient.status}.</p>
                        </div>
                    </div>
                })
            }
        </div>
    }
    render() {
        const { patients } = this.state
        return (
            <div>
                <div className="container">
                    <h2 className="mt-5 mb-5">{isAuthenticated().patient.firstname}'s appointments</h2>
                    {this.renderPatients(patients)}
                </div>
            </div>
        );
    }
}

export default appointments;