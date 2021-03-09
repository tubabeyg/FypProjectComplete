import React from "react";
import styled from "styled-components";

export const HomeContent = () => {
    return (
        <Homecontent className="container p-5 px-md-5">
            <div className="mx-md-5 px-md-5">
                <div className="row mx-md-5 px-md-5">
                    <div className="col-md-8 offset-md-2">
                        <h1 className="dash-head">Right there with you</h1>
                        <p>We're taking deliberate steps to protect you</p>
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
        </Homecontent>
    );
};

const Homecontent = styled.div`
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
