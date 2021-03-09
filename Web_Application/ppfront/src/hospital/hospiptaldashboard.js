import React from "react";
import styled from "styled-components";

export const HospitalDashboardContent = () => {
    return (
        <HospitalDashboard className="container p-5 px-md-5">
            <div className="mx-md-5 px-md-5">
                <div className="row mx-md-5 px-md-5">
                    <div className="col-md-8 offset-md-2">
                        <h1 className="dash-head">Making lives easy</h1>
                        <p>
                            A hospital is a health care institution providing
                            patient treatment with specialized staff and
                            equipment which plays an important role in society.
                            Hospitals and health clinic can be very different
                            from other work environments.
                        </p>
                        <p>
                            Hospital, an institution that is built, staffed, and
                            equipped for the diagnosis of disease; for the
                            treatment, both medical and surgical, of the sick
                            and the injured; and for their housing during this
                            process. The modern hospital also often serves as a
                            centre for investigation and for teaching
                        </p>
                    </div>
                </div>
            </div>
        </HospitalDashboard>
    );
};

const HospitalDashboard = styled.div`
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
