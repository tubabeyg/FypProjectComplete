import React from "react";
import styled from "styled-components";

export const DashboardContent = () => {
    return (
        <Dashboard className="container p-5 px-md-5">
            <div className="mx-md-5 px-md-5">
                <div className="row mx-md-5 px-md-5">
                    <div className="col-md-8 offset-md-2">
                        <h1 className="dash-head">
                            Making healthcare integration easy
                        </h1>
                        <p>
                            For healthcare organizations facing the challenges
                            of accessing and exchanging data from a growing
                            number of systems, devices, facilities, and
                            organizations, we're here to help.
                        </p>
                        <p>
                            This management portal delivers a rapid, reliable,
                            and scalable interoperability solution for
                            healthcare organizations through the acquisition and
                            exchange of healthcare information.
                        </p>
                    </div>
                </div>
            </div>
        </Dashboard>
    );
};

const Dashboard = styled.div`
    color: white;

    .row {
        background-color: #00000033;
    }

    .dash-head {
        color: white;
        font-weight: bold;
    }

    p {
        font-size: 1rem;
    }
`;
