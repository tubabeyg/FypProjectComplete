import React from "react";
import styled from "styled-components";

export const superAdminDashboardContent = () => {
    return (
        <superAdminDashboard className="container p-5 px-md-5">
            <div className="mx-md-5 px-md-5">
                <div className="row mx-md-5 px-md-5">
                    <div className="col-md-8 offset-md-2">
                        <h1 className="dash-head2"></h1>
                        <p></p>
                        <p></p>
                    </div>
                </div>
            </div>
        </superAdminDashboard>
    );
};

const superAdminDashboard = styled.div`
    color: white;

    .row {
        background-color: #00000033;
    }

    .dash-head2 {
        color: white;
        font-weight: bold;
    }

    p {
        font-size: 1rem;
    }
`;
